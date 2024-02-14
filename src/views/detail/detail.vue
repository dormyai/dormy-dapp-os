<script setup lang="jsx">
import { ref, onMounted, computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import { propertyDetail } from '@/api';
import { useRoute, useRouter } from 'vue-router';
import { readContract, erc20ABI, getAccount, writeContract, prepareWriteContract, getNetwork, getContract, waitForTransaction } from '@wagmi/core'
import { propertyAddress, propertyAbi, usdtAddress, dormyAddress, dormyAbi } from '@/abi'
import { IconQuestionCircle, IconExclamationCircle } from '@arco-design/web-vue/es/icon';
import { formatEther, getAddress, parseUnits } from 'viem'
import { useAuthStore } from '@/store/auth'
import { commonStore } from '@/store/common'
import { Notification, Space, Button } from '@arco-design/web-vue';
import { Loader } from '@googlemaps/js-api-loader';
import Loading from '@/components/Loading.vue'
import Image from '@/components/Image.vue'
import Big from 'big.js';
import Decimal from 'decimal.js';
import 'swiper/css';
import 'swiper/css/navigation';

const store = useAuthStore()
const commonstore = commonStore()

const route = useRoute()
const router = useRouter()
const detailContent = ref(null)
const detailChaniContent = ref(null)
const detailMedia = ref([])
const mentCon = ref(null)
const currentSwipper = ref(0)

const tokenName = ref(null)
const tokenPrice = ref(null)
const tokenAmount = ref(null)
const minPurchase = ref(null)
const maxPurchase = ref(null)
const minIncrement = ref(null)
const minLoading = ref(false)

const approveTokenHash = ref('')
const mintHash = ref('')

const youBuy = ref(1)
const balance = ref(0)
const symbol = ref('')

// propertyDetail
onMounted(async () => {
    
    commonstore.updateRate()
    await getDetailContent()
    const status = await readContract({
        address: propertyAddress,
        abi: propertyAbi,
        functionName: 'getPropertyInfo',
        args: [detailContent.value.property_number]
    })
    tokenName.value = status.propertyNumber
    const ment = await readContract({
        address: propertyAddress,
        abi: propertyAbi,
        functionName: 'getPropertyInvestmentValue',
        args: [detailContent.value.property_number]
    })
    mentCon.value = ment
    tokenPrice.value = formatEther(ment.tokenPrice)
    tokenAmount.value = calculatePrice(ment.tokenAmount)
    minPurchase.value = calculatePrice(ment.minPurchase)
    maxPurchase.value = calculatePrice(ment.maxPurchase)
    minIncrement.value = calculatePrice(ment.minIncrement)

    getAccountToken()

    initMap()
})

const initMap = () => {
    let position = { lat: Number(detailContent.value.latitude) || 51.504528, lng: Number(detailContent.value.longitude) || -0.128245 }
    const loader = new Loader({
        apiKey: "AIzaSyDuvfD-QZ9riDmGljBVe9wQiuXgKvZbY5E",
        version: "weekly",
        libraries: ["places"]
    });

    loader.importLibrary('maps').then(() => {
        let map = new google.maps.Map(document.getElementById("map"), {
            center: position,
            zoom: 10,
        });
        // The marker
        const marker = new google.maps.Marker({
            position: position,
            map: map,
        });
    })
}

const calculateStock = computed(() => {
    if (!mentCon.value) return null
    return new Big(mentCon.value.tokenAmount).minus(mentCon.value.soldQuantity)
})
const calculatePercent = computed(() => {
    if (!mentCon.value) return 0
    let tokenAmount = new Big(mentCon.value.tokenAmount)
    let sold = new Big(mentCon.value.soldQuantity)
    return Number(sold.div(tokenAmount).toString())
})
const youPay = computed(() => {
    let result  = youBuy.value * tokenPrice.value
    return result
})
const mintDisabled = computed(() => {
    return youBuy.value > 0 && balance.value > 0
})

const getAccountToken = async () => {
    readContract({
        address: usdtAddress,
        abi: erc20ABI,
        functionName: 'symbol',
        args: []
    }).then(res => {
        symbol.value = res
    })
    let account = await getAccount()
    if (account.address) {
        const tokenCon = await readContract({
            address: usdtAddress,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [account.address]
        })
        balance.value = parseFloat(formatEther(tokenCon)).toFixed(2)
    }
}

const handleMintOp = async () => {
    // 1. 钱包链接
    // 2. checkApproval
    // 3. approveTokens
    // 4. mint

    minLoading.value = true
    store.switchNetwork().then(async r => {
        let account = await getAccount()
        let checkAllow = await checkApproval(account.address)
    
        if (new Big(youPay.value).cmp(new Big(checkAllow)) == 1) {
    
            await approveTokens(account.address)
    
        } else {
            handleMint(account.address)
        }
    }).catch(err => {
        minLoading.value = false
    })

}

const checkApproval = async (address) => {
    let allowance = await readContract({
        address: usdtAddress,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address, dormyAddress]
    })
    return formatEther(allowance)
}

const approveTokens = async (address) => {
    try {
        const approveTokenConfig = await prepareWriteContract({
            address: usdtAddress,
            abi: erc20ABI,
            functionName: 'approve',
            account: address,
            args: [dormyAddress, parseUnits((youPay.value).toString(), 18)],
        });
        let approve = await writeContract(approveTokenConfig)

        waitForTransaction({
            hash: approve.hash,
        }).then(r => {
            if (r.status == 'success') {
                handleMint(address)
            } else {
                Notification.error({
                    title: 'Error',
                    duration: 2000
                })
            }
        })
    } catch(err) {
        console.log('err:', err)
        minLoading.value = false
        return Notification.error({
            title: err.message,
            duration: 3000
        })
    }
}

const handleMint = async (address) => {

    let params = [address, 1, youBuy.value]

    try {
        let config = await prepareWriteContract({
            address: dormyAddress,
            abi: dormyAbi,
            functionName: 'mint',
            args: params,
            overrides: {
                value: youBuy.value,
                gasLimit: 300000,
                from: address
            },
            chainId: store.network.id,
            account: address
        })

        const result = await writeContract(config)
        mintHash.value = result.hash

        waitForTransaction({
            hash: result.hash,
        }).then(r => {
            if (r.status == 'success') {
                const id = `${Date.now()}`;
                const closeNotification =  Notification.success({
                    id,
                    title: 'Successful!',
                    duration: 0,
                    footer: <Space>
                        <Button type="primary" shape="round" size="small" onClick={() => {
                            router.push('/dashboard')
                            Notification.remove(id)
                        }}>
                            Go
                        </Button>
                    </Space>
                })
            }
            minLoading.value = false
        })
    } catch (err) {
        console.log('err:', err)
        minLoading.value = false
        
        return Notification.error({
            title: err.message,
            duration: 4000
        })
    }
    
}

const getDetailContent = () => {
    return propertyDetail({
        id: route.params.id
    }).then(res => {
        if (res.code == 200) {
            detailContent.value = res.data.property_info
            detailMedia.value = res.data.property_info_medium
            detailChaniContent.value = res.data.property_chain_info
        }
    })
}

const onSlideChange = (e) => {
    currentSwipper.value = e.activeIndex
}

const handleMaxBuy = () => {
    let buyMaxPurchase = maxPurchase.value // 合约允许最个数
    let BalancePurchase = Math.floor(balance.value / tokenPrice.value) // 账户余额能买到的最个数
    let max = buyMaxPurchase > BalancePurchase ? BalancePurchase : buyMaxPurchase // 得到允许范围内的最大值
    youBuy.value = max
}

const calculatePrice = (bigVal) => {
    return new Big(bigVal).toString()
}

const goback = () => {
    router.go(-1)
}

</script>

<template>
    <div @click="goback" class="back pt-2 cursor-pointer md:w-[28rem] mx-auto flex items-center text-[#0E1D67] text-[0.36rem]"><div class="icon i-solar-arrow-left-outline"></div><p>Back to listing properties</p></div>
    <div class="detail-container md:w-[28rem] mx-auto flex items-start">
        <main class="main">
            <Image class="preview-image" :src="detailMedia[currentSwipper]?.url" />
            <div class="swiper-wrapper">
                <swiper
                :slidesPerView="'auto'"
                :centeredSlides="true"
                :spaceBetween="8"
                :navigation="true"
                :modules="[Navigation]"
                class="my-swiper"
                @slideChange="onSlideChange"
                >
                    <swiper-slide v-for="item,index in detailMedia" :key="index" class="swiper-slide">
                        <!-- <img class="thumbnail" :src="item.url" alt=""> -->
                        <Image class="thumbnail" :src="item.url" />
                    </swiper-slide>
                </swiper>
            </div>

            <template v-if="detailContent">
                <section class="address-main py-2">
                    <h2 class="c-h2">{{ detailContent.address1 }}, {{ detailContent.address2 }}, {{ detailContent.county }}</h2>
                    <p>{{detailContent.county}}, {{ detailContent.country }}, {{ detailContent.postcode }}</p>
                </section>
                <div class="grid grid-cols-4 gap-1 text-[0.28rem] mt-1">
                    <dl>
                        <dt class="uppercase text-[#7B7B80]">property type</dt>
                        <dd class="flex items-center text-[0.36rem] mt-[0.16rem]"><div class="i-solar-home-linear text-[0.4rem]"></div><div class="ml-[0.2rem]">{{ detailContent.property_type }}</div></dd>
                    </dl>
                    <dl>
                        <dt class="uppercase text-[#7B7B80]">bedrooms</dt>
                        <dd class="flex items-center text-[0.36rem] mt-[0.16rem]"><div class="i-solar-bed-outline text-[0.45rem]"></div><div class="ml-[0.2rem]">×{{ detailContent.bedrooms }}</div></dd>
                    </dl>
                    <dl>
                        <dt class="uppercase text-[#7B7B80]">bathrooms</dt>
                        <dd class="flex items-center text-[0.36rem] mt-[0.16rem]"><div class="i-solar-bath-outline text-[0.45rem]"></div><div class="ml-[0.2rem]">×{{ detailContent.bathrooms }}</div></dd>
                    </dl>
                    <dl>
                        <dt class="uppercase text-[#7B7B80]">size</dt>
                        <dd class="text-[0.36rem] mt-[0.16rem]">
                            <div class="flex items-center">
                                <div class="i-solar-ruler-angular-outline text-[0.4rem]"></div><div class="ml-[0.2rem]">{{ detailContent.internal_size }}sq.ft.</div>
                            </div>
                            <div class="text-[0.28rem] text-[#7B7B80] pl-3">({{ detailContent.council_tax }}sq.m.)</div>
                        </dd>
                    </dl>
                    <dl>
                        <dt class="uppercase text-[#7B7B80] flex items-center"><span>tenure</span><icon-exclamation-circle :size="12" class="cursor-pointer ml-[0.1rem]"/></dt>
                        <dd class="text-[0.36rem] mt-[0.16rem]">Freehold</dd>
                    </dl>
                </div>
                <div class="divide"></div>
                <section class="details-main">
                    <h2 class="c-h">About the Property</h2>
                    <section class="section-block">
                        <h2 class="c-h3">Property Description</h2>
                        <p>{{ detailContent.property_description }}</p>
                    </section>
                    <section class="section-block">
                        <h2 class="c-h3">Property Management and Insurance</h2>
                        <p>{{ detailContent.property_insurance }}</p>
                        <!-- <p>· Managed by Ernest &Manson Property Management</p> -->
                    </section>
                    <section class="section-block">
                        <h2 class="c-h3">Tenancy</h2>
                        <p>{{ detailContent.tenancy }}</p>
                        <!-- <p>· One year tenancy of Room A       (1 Dec, 2023 - 30, Nov, 2024)</p>
                        <p>· Two year tenancy of Room B       (1 Dec, 2023 - 30, Nov, 2025)</p> -->
                    </section>
                    <div class="divide"></div>
                    <section class="section-block">
                        <h2 class="c-h3">Neighbourhood</h2>
                        <p>{{ detailContent.neighbourhood }}</p>
                        <!-- <p class="flex items-center justify-between"><span>· University College of London (UCL)</span> <span class="gray">1 miles</span></p> -->
                    </section>
                    <section class="section-block">
                        <h2 class="c-h3">On the Map</h2>
                        <div class="h-32" id="map"></div>
                    </section>
                </section>
                <div class="divide"></div>
                <section class="details-main">
                    <h2 class="c-h">Financial</h2>
                    <section class="section-block">
                        <h2 class="c-h3">Initial Token Offering (ITO)</h2>
                        <h2 class="c-h4 mt-1 flex items-center justify-between"><span>· Total Investment Value</span><span>${{ detailContent.total_investment_value }}</span></h2>
                        <div class="pl-1">
                            <p class="flex items-center justify-between gray"><span>· Underlying Asset Price</span> <span>${{ detailContent.underlying_asset_price }}</span></p>
                            <p class="flex items-center justify-between gray"><span>· Closing costs(i.e. Stamp duty, Agency fee, Conveyancing, Surveys)</span> <span>${{ detailContent.closing_costs }}</span></p>
                            <p class="flex items-center justify-between gray"><span>· Upfront SPV Fees</span> <span>${{ detailContent.upfront_spv_fees }}</span></p>
                            <p class="flex items-center justify-between gray"><span>· Operating Reserve (5%)</span> <span>${{ detailContent.operating_reserve }}</span></p>
                        </div>
                    </section>
                    <section class="section-block">
                        <h2 class="c-h3">Rents</h2>
                        <h2 class="c-h4 mt-1 flex items-center justify-between"><span>· Annual Gross Rents</span><span>${{ detailContent.annual_gross_rents }}</span></h2>
                        <div class="pl-1">
                            <p class="flex items-center justify-between gray"><span>· Council Tax</span> <span>${{ detailContent.council_tax }}</span></p>
                            <p class="flex items-center justify-between gray"><span>· Homeowners Insurance </span> <span>${{ detailContent.homeowners_insurance }}</span></p>
                            <p class="flex items-center justify-between gray"><span>· Property Management</span> <span>${{ detailContent.property_management_fees }}</span></p>
                            <p class="flex items-center justify-between gray"><span>· Utilities </span> <span>${{ detailContent.utilities }}</span></p>
                            <p class="flex items-center justify-between gray"><span>· Legal Fees (i.e. Annual SPV Admin & filing fees) </span> <span>${{ detailContent.legal_fees }}</span></p>
                            <p class="flex items-center justify-between gray"><span>· Annual Cashflow</span> <span>${{ detailContent.annual_cashflow }}</span></p>
                        </div>
                    </section>
                    <section class="section-block">
                        <h2 class="c-h3">Total Returns</h2>
                        <h2 class="c-h4 mt-1 flex items-center justify-between"><span>· Projected Annual Return </span><span>{{ detailContent.projected_annual_return }}%</span></h2>
                        <div class="pl-1">
                            <p class="flex items-center justify-between gray"><span>· Projected Rental Yield</span> <span>{{ detailContent.projected_rental_yield }}%</span></p>
                            <p class="flex items-center justify-between gray"><span>· Projected Appreciation</span> <span>{{ detailContent.projected_appreciation }}%</span></p>
                            <p class="flex items-center justify-between gray"><span>· Historical Rental Yield</span> <span>{{ detailContent.historical_rental_yield }}%</span></p>
                        </div>
                    </section>
                    <p class="tips mt-[0.8rem]">*Conversions were made based on the exchange rate of GBP and USD</p>
                </section>
                <div class="divide"></div>
                <section class="details-main">
                    <h2 class="c-h">Information Disclosure</h2>
                    <section class="section-block">
                        <h2 class="c-h2">On-Chain Info</h2>
                        <p class="flex items-center justify-between"><span>DSFT-1 Contract</span> <a :href="'https://mumbai.polygonscan.com/address/' + detailChaniContent.property_contract_addr ">{{ detailChaniContent.property_contract_addr }}</a></p>
                        <p class="flex items-center justify-between"><span>Activities & Log</span> <a href="">{{ detailChaniContent.property_contract_addr }}</a></p>
                    </section>
                    <section class="section-block">
                        <h2 class="c-h2">On-Chain Info </h2>
                        <p>· <a href="">Inspection Report</a></p>
                    </section>
                </section>
            </template>
        </main>

        <!-- aside -->
        <aside class="aside text-[#2A2934] px-2 py-[0.4rem]">
            <p class="text-[0.48rem] font-bold">Purchase</p>
            <!-- Token Price -->
            <div class="token-price bg-[#F4F6FF] rounded-[0.2rem] mt-[0.2rem]">
                <div class="top flex items-center flex-wrap text-[0.36rem] px-[0.56rem] py-[0.4rem]">
                    <p class="font-bold whitespace-nowrap">Token Price:</p>
                    <span class="text-[#F6615A] font-bold mx-1 text-[0.42rem]">${{ tokenPrice }}</span>
                    <span class="text-[#888A9A] whitespace-nowrap">≈ £{{ (tokenPrice * commonstore.rate).toFixed(2) }}</span>
                </div>
                <div class="px-[0.56rem] py-[0.1rem]">
                    <div class="cell"><span class="label">Token name:</span><span class="value" v-if="tokenName">{{ tokenName }}</span><Loading class="ml-auto" v-else /></div>
                    <div class="cell"><span class="label">Token Amount:</span><span class="value" v-if="tokenAmount">{{ tokenAmount }}</span><Loading class="ml-auto" v-else /></div>
                    <div class="cell"><span class="label">Min purchase:</span><span class="value" v-if="minPurchase">{{ minPurchase }} {{ tokenName }}</span><Loading class="ml-auto" v-else /></div>
                    <div class="cell"><span class="label">Max purchase:</span><span class="value" v-if="maxPurchase">{{ maxPurchase }} {{ tokenName }}</span><Loading class="ml-auto" v-else /></div>
                    <div class="cell"><span class="label">Min increment:</span><span class="value" v-if="minIncrement">{{ minIncrement }} {{ tokenName }}</span><Loading class="ml-auto" v-else /></div>
                </div>
            </div>
            <!-- Projected Info -->
            <div class="bg-[#FEF9EE] px-[0.56rem] py-[0.1rem] rounded-[0.2rem] mt-1">
                <div class="cell or">
                    <span class="label">Projected Annual Return
                        <a-tooltip content="1234" position="top" mini>
                            <icon-question-circle />
                        </a-tooltip>
                    </span>
                    <span class="value" v-if="detailContent">{{ detailContent.projected_annual_return }}%</span>
                    <Loading class="ml-auto" v-else />
                </div>
                <div class="cell or">
                    <span class="label">Projected Rental Yield
                        <a-tooltip content="1234" position="top" mini>
                            <icon-question-circle />
                        </a-tooltip>
                    </span>
                    <span class="value" v-if="detailContent">{{ detailContent.projected_rental_yield }}%</span>
                    <Loading class="ml-auto" v-else />
                </div>
                <div class="cell or">
                    <span class="label">Projected Appreciation
                        <a-tooltip content="1234" position="top" mini>
                            <icon-question-circle />
                        </a-tooltip>
                    </span>
                    <span class="value" v-if="detailContent">{{ detailContent.projected_appreciation }}%</span>
                    <Loading class="ml-auto" v-else />
                </div>
            </div>
            <!-- Stock -->
            <div class="area">
                <p class="title">Stock: {{ calculateStock }} <Loading v-if="!mentCon" /></p>
                <a-progress :percent="calculatePercent" :style="{ width:'100%' }" />
            </div>
            <!-- Swap -->
            <div class="swap">
                <div class="area">
                    <p class="title">You buy</p>
                    <a-input v-model="youBuy" @input="youBuy=youBuy.replace(/^(0+)|[^\d]+/g,'')" class="input-box mt-1" placeholder="Enter">
                        <template #append>
                            <div class="flex items-center">
                                <a-button @click="handleMaxBuy" class="max-button" type="text">Max</a-button>
                                <div class="w-px h-3 bg-gray-200 mx-1"></div>
                                <span>{{ tokenName }}</span>
                            </div>
                        </template>
                    </a-input>
                </div>
                <div class="area">
                    <p class="title"><span>You Pay</span><span class="ml-auto">Balance: </span><span v-if="balance">{{ balance }}</span><Loading v-else /></p>
                    <div class="input-box-pay mt-1 flex items-center">
                        <span>{{ youPay }}</span>
                        <div class="ml-auto i-cryptocurrency-color-usdt mx-1"></div>
                        <span>{{ symbol }}</span>
                    </div>
                    <p class="tips">Projected Annual Return: {{ detailContent?.projected_rental_yield }}%</p>
                </div>
                <div class="mt-4">
                    <a-button v-if="!store.address" @click="store.connectWallet()" type="primary" shape="round" long>Connect Wallet</a-button>
                    <a-button v-else :disabled="!mintDisabled" :loading="minLoading" @click="handleMintOp" type="primary" shape="round" long>Mint</a-button>
                </div>
            </div>
        </aside>
    </div>
</template>

<style lang="less">
.back {
    .icon {
        transition: all .3s;
    }
    &:hover {
        .icon {
            transform: translateX(-10px);
        }
    }
}
.detail-container {
    --swiper-navigation-size: 24px;
    --swiper-navigation-sides-offset: 10px;
    display: flex;
    align-items: start;
    gap: 16px;
    color: #2A2934;
    padding-top: 12px;
    padding-bottom: 98px;
    .main {
        flex: 1;
        .preview-image {
            width: 100%;
            height: 30vw;
            display: block;
            border-radius: 16px 16px 0 0;
        }
        .swiper-wrapper {
            background: #F6F6F8;
            border-radius: 0px 0px 16px 16px;
            display: flex;
            align-items: center;
            .my-swiper {
                box-sizing: border-box;
                padding: 16px 50px;
                width: 932px;
                height: 214px;
                .swiper-slide {
                    width: 226px;
                    border: 16px;
                    display: block;
                    border-radius: 16px;
                    overflow: hidden;
    
                    /* Center slide text vertically */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    
                    .thumbnail {
                        display: block;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        user-select: none;
                    }
                }
            }
        }

        .c-h {
            font-size: 24px;
        }
        .c-h2 {
            font-size: 22px;
        }
        .c-h3 {
            font-size: 20px;
        }
        .c-h4 {
            font-size: 18px;
        }
        p {
            color: #3A3942;
            font-size: 18px;
            line-height: 1.4;
            margin-top: 12px;
            a {
                color: #1580DF;
            }
        }
        .divide {
            height: 1PX;
            width: 100%;
            background: #DEDEE2;
            margin: 32px 0;
        }
        .gray {
            color: #5E6F86;
        }
        .tips {
            font-size: 14px;
            color: #949499;
        }

        .details-main {
            
            .section-block {
                margin-top: 26px;
                white-space: pre-line;
                > p {
                    line-height: 1.6;
                }
            }
            
        }
    }

    .aside {
        width: 410px;
        background: #FFFFFF;
        box-shadow: 0px 4px 16px 0px rgba(8,8,35,0.04);
        border-radius: 16px;
        border: 1px solid #EBEBEB;

        .token-price {
            .top {
                border-bottom: 1px solid #EAECF5;
            }
        }
        .cell {
            display: flex;
            align-items: center;
            font-size: 0.32rem;
            color: #5E6F86;
            padding: 6px 0;
            &.or {
                color: #867C66;
                .value {
                    color: #BD4F02;
                }
            }
            .value {
                color: #09043E;
                margin-left: auto;
            }
        }
        .area {
            --color-border-1: #fff;
            margin-top: 20px;
            .title {
                font-size: 16px;
                display: flex;
                align-items: center;
            }

            .input-box {
                border: 1px solid #DFDFDF;
                padding: 6px 0;
                border-radius: 99px;
                .max-button {
                    font-size: 14px;
                    padding: 0 2px;
                }
                .arco-input-wrapper,
                .arco-input-append {
                    background-color: transparent;
                    border: 0;
                }
                .arco-input-append {
                    border-left: 0;
                }
            }
            .input-box-pay {
                border: 1px solid #DFDFDF;
                padding: 14px 16px;
                border-radius: 99px;
            }

            .tips {
                font-size: 14px;
                color: #949499;
                margin-top: 6px;
            }

        }
    }
}
</style>