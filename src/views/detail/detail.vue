<script setup>
import { ref, onMounted, computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import { propertyDetail } from '@/api';
import { useRoute } from 'vue-router';
import { readContract, erc20ABI, getAccount, writeContract, prepareWriteContract, watchContractEvent } from '@wagmi/core'
import { propertyAddress, propertyAbi, usdtAddress, dormyAddress, dormyAbi } from '@/abi'
import { IconQuestionCircle } from '@arco-design/web-vue/es/icon';
import { formatEther, getAddress } from 'viem'
import { useAuthStore } from '@/store/auth'
import Loading from '@/components/Loading.vue'
import Big from 'big.js';
import Decimal from 'decimal.js';
import 'swiper/css';
import 'swiper/css/navigation';

const store = useAuthStore()

const router = useRoute()
const detailContent = ref(null)
const detailMedia = ref([])
const mentCon = ref(null)

const tokenName = ref(null)
const tokenPrice = ref(null)
const tokenAmount = ref(null)
const minPurchase = ref(null)
const maxPurchase = ref(null)
const minIncrement = ref(null)

const youBuy = ref(1)
const balance = ref(0)
const symbol = ref('')

// propertyDetail
onMounted(async () => {
    
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
})

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
    return youBuy.value * tokenPrice.value
})
const mintDisabled = computed(() => {

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
        balance.value = formatEther(tokenCon)
    }
}

const handleMintOp = async () => {
    // 1. 钱包链接
    // 2. checkApproval
    // 3. approveTokens
    // 4. mint
    let account = await getAccount()
    let checkAllow = await checkApproval(account.address)

    // if (checkAllow == 0) { // 未授权，先去授权
    //     let result = await approveTokens()
    //     if (result.hash) { // 授权完成，去mint
    //         handleMint(account.address)
    //     }
    // } else {
    //     handleMint(account.address)
    // }
    console.log('checkAllow::', checkAllow)
}

const checkApproval = async (address) => {
    let allowance = await readContract({
        address: usdtAddress,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address, usdtAddress]
    })
    return formatEther(allowance)
}

const approveTokens = async (address) => {
    let approve = await writeContract({
        address: usdtAddress,
        abi: erc20ABI,
        functionName: 'approve',
        args: [usdtAddress, youPay.value],
        account: address
    })
    return approve
}

const handleMint = async (address) => {

    let params = [address, 1, youBuy.value]
    let config;

    try {
        config = await prepareWriteContract({
            address: dormyAddress,
            abi: dormyAbi,
            functionName: 'mint',
            args: params,
            overrides: {
                gasLimit: 300000,
                from: address
            },
            chainId: store.network.chain.id,
            account: address
        })
    } catch (err) {
        console.log('err::', err, err.message)
    }

    watchContractEvent({
        address: dormyAddress,
        abi: dormyAbi,
        eventName: 'Minted'
    }, (data) => {
        console.log('watch::', data)
    })

    try {
        const result = await writeContract(config)
        result.wait().then((receipt) => {
            if(receipt.status == 0) { // 交易失败
                console.log('mint 失败>>>>>>>')
            }
            if (getAddress(receipt.from) == getAddress(address)) {
                console.log('mint 成功>>>>>>>')
            }
        })
    } catch (err) {
        console.log('err::', err, err.message)
    }
    
}

const getDetailContent = () => {
    return propertyDetail({
        id: router.params.id
    }).then(res => {
        if (res.code == 200) {
            detailContent.value = res.data.property_info
            detailMedia.value = res.data.property_info_medium
        }
    })
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

</script>

<template>
    <div class="back pt-2 cursor-pointer px-[0.8rem] md:px-[5.12rem] flex items-center text-[#0E1D67] text-[0.36rem]"><div class="icon i-solar-arrow-left-outline"></div><p>Back to listing properties</p></div>
    <div class="detail-container px-[0.8rem] md:px-[5.12rem] flex items-start">
        <main class="main">
            <img class="preview-image" src="https://i.seadn.io/gcs/files/98d9070784ef890a9ba5ab2d17bb185a.png?auto=format&dpr=1&w=640" alt="">
            <div class="swiper-wrapper">
                <swiper
                :slidesPerView="'auto'"
                :centeredSlides="true"
                :spaceBetween="8"
                :navigation="true"
                :modules="[Navigation]"
                class="my-swiper"
                >
                    <swiper-slide v-for="item,index in 7" class="swiper-slide"><img class="thumbnail" src="https://i.seadn.io/gcs/files/98d9070784ef890a9ba5ab2d17bb185a.png?auto=format&dpr=1&w=640" alt=""></swiper-slide>
                </swiper>
            </div>

            <template v-if="detailContent">
                <section class="address-main py-2">
                    <h2 class="c-h2">{{ detailContent.address1 }}, {{ detailContent.address2 }}, {{ detailContent.county }}</h2>
                    <p>{{detailContent.county}}, {{ detailContent.country }}, {{ detailContent.postcode }}</p>
                </section>
                <div class="divide"></div>
                <section class="details-main">
                    <h2 class="c-h">About the Property</h2>
                    <section class="section-block">
                        <h2 class="c-h3">Property Description</h2>
                        <p>Situated in this popular tree lined residential turning off Fortis Green and conveniently located within walking distance to local shops, amenities and East Finchley tube station is this recently refurbished and extended four bedroom, two bathroom (one ensuite) end of terraced house. The property is offered chain free and benefits from an approximately 24ft modern kitchen diner with bi folding doors leading to garden, a guest cloakroom, double glazing and a 21ft master bedroom with Juliet Balcony. To really appreciate the size, location and potential an internal viewing is highly recommended via vendors main agents Adam Hayes Estate Agents.</p>
                    </section>
                    <section class="section-block">
                        <h2 class="c-h3">Property Management and Insurance</h2>
                        <p>· Managed by Ernest &Manson Property Management</p>
                        <p>· Insurace Policy from Avaya</p>
                    </section>
                    <section class="section-block">
                        <h2 class="c-h3">Tenancy</h2>
                        <p>· One year tenancy of Room A       (1 Dec, 2023 - 30, Nov, 2024)</p>
                        <p>· Two year tenancy of Room B       (1 Dec, 2023 - 30, Nov, 2025)</p>
                    </section>
                    <div class="divide"></div>
                    <section class="section-block">
                        <h2 class="c-h3">Neighbourhood</h2>
                        <p class="flex items-center justify-between"><span>· University College of London (UCL)</span> <span class="gray">1 miles</span></p>
                        <p class="flex items-center justify-between"><span>· London School of Economics and Political Science  (LSE)</span> <span class="gray">1 miles</span></p>
                        <p class="flex items-center justify-between"><span>· King’s College London (KCL)</span> <span class="gray">1 miles</span></p>
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
                        <h2 class="c-h4 mt-1 flex items-center justify-between"><span>· Total Investment Value</span><span>$307,300</span></h2>
                        <div class="pl-1">
                            <p class="flex items-center justify-between gray"><span>· University College of London (UCL)</span> <span>1 miles</span></p>
                            <p class="flex items-center justify-between gray"><span>· London School of Economics and Political Science  (LSE)</span> <span>1 miles</span></p>
                            <p class="flex items-center justify-between gray"><span>· King’s College London (KCL)</span> <span>1 miles</span></p>
                        </div>
                    </section>
                    <section class="section-block">
                        <h2 class="c-h3">Rents</h2>
                        <h2 class="c-h4 mt-1 flex items-center justify-between"><span>· Annual Gross Rents</span><span>$30,300</span></h2>
                        <div class="pl-1">
                            <p class="flex items-center justify-between gray"><span>· University College of London (UCL)</span> <span>1 miles</span></p>
                            <p class="flex items-center justify-between gray"><span>· London School of Economics and Political Science  (LSE)</span> <span>1 miles</span></p>
                            <p class="flex items-center justify-between gray"><span>· King’s College London (KCL)</span> <span>1 miles</span></p>
                        </div>
                    </section>
                    <section class="section-block">
                        <h2 class="c-h3">Total Returns</h2>
                        <h2 class="c-h4 mt-1 flex items-center justify-between"><span>· Projected Annual Return </span><span>$30,300</span></h2>
                        <div class="pl-1">
                            <p class="flex items-center justify-between gray"><span>· University College of London (UCL)</span> <span>1 miles</span></p>
                            <p class="flex items-center justify-between gray"><span>· London School of Economics and Political Science  (LSE)</span> <span>1 miles</span></p>
                            <p class="flex items-center justify-between gray"><span>· King’s College London (KCL)</span> <span>1 miles</span></p>
                        </div>
                    </section>
                    <p class="tips mt-[0.8rem]">*Conversions were made based on the exchange rate of GBP and USD</p>
                </section>
                <div class="divide"></div>
                <section class="details-main">
                    <h2 class="c-h">Information Disclosure</h2>
                    <section class="section-block">
                        <h2 class="c-h2">On-Chain Info</h2>
                        <p class="flex items-center justify-between"><span>DSFT-1 Contract</span> <a href="">0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503</a></p>
                        <p class="flex items-center justify-between"><span>DSFT-1 Contract</span> <a href="">0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503</a></p>
                    </section>
                    <section class="section-block">
                        <h2 class="c-h2">On-Chain Info </h2>
                        <p>· <a href="">Inspection Report</a></p>
                        <p>· <a href="">Inspection Report</a></p>
                        <p>· <a href="">Inspection Report</a></p>
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
                    <span class="text-[#888A9A] whitespace-nowrap">≈ £160</span>
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
                                <span>SFD-1</span>
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
                    <p class="tips">Projected Annual Return: xx</p>
                </div>
                <div class="mt-4">
                    <a-button @click="handleMintOp" type="primary" shape="round" long>Comfirm</a-button>
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
            object-fit: cover;
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
                width: 812px;
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