<template>
    <div class="market-item flex flex-col md:flex-row">
        <swiper
            :modules="[Navigation]"
            :navigation="true"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
            class="swiper-box"
        >
            <swiper-slide v-for="v, index in item.property_info_medium" :key="index">
                <img class="select-none" :src="v.url" alt="">
            </swiper-slide>
            <div class="img-navigation flex-1">
                <div class="icon i-solar-gallery-wide-bold"></div>
                <span>{{ currentSwipper + 1 }} / {{ item.property_info_medium.length }}</span>
            </div>
        </swiper>
        <div class="market-main flex-1">
            <!-- 状态: 
                0 New // 新建状态，尚未开始或初始化 Upcoming 
                1 Upcoming // 即将到来，通常用于预售之前
                2 Active // 活动状态，可以进行交易或购买
                3 SoldOut // 已售罄，不再可购买
                4 Disabled // 已禁用或停用，无法进行交易或购买
            -->
            <template v-if="statusCon">
                <a-tag v-if="statusCon.propertyStatus == 0" color="blue">NEW</a-tag>
                <a-tag v-else-if="statusCon.propertyStatus == 1" color="orangered">IN 21h: 14m: 30s</a-tag>
                <a-tag v-else-if="statusCon.propertyStatus == 2" color="purple">IN SALE</a-tag>
                <a-tag v-else-if="statusCon.propertyStatus == 3" color="gray">SOLD OUT</a-tag>
                <a-tag v-else-if="statusCon.propertyStatus == 4" color="gray">DISABLED</a-tag>
                <a-tag v-else color="gray">ERROR</a-tag>
            </template>
            <template v-else>
                <Loading />
            </template>
            <!-- 标题 -->
            <div class="flex items-center mt-1">
                <h2 class="title">{{ item.property_info.address1 }}, {{ item.property_info.address2 }}, {{ item.property_info.postcode }}</h2>
                <span class="title-tips ml-auto">Stock: <span v-if="mentCon">{{ calculateStock }}</span> <span v-else> <Loading /></span> </span>
            </div>
            <div class="price bg-[#F6F6F6] grid grid-cols-2">
                <div>
                    <h1>Total Price</h1>
                    <h2><strong>${{ item.property_info.total_investment_value }}</strong> ≈ £240,000</h2>
                </div>
                <div>
                    <h1>Sqft Price</h1>
                    <h2><strong>${{ item.property_chain_info.token_price }}</strong> ≈ £240,000</h2>
                </div>
            </div>
            <div class="info flex items-center mt-1">
                <div class="icon i-solar-calendar-outline"></div>
                <p>Projected Annual Return：{{ item.property_info.projected_annual_return }}%</p>
                <div class="icon i-solar-wallet-outline ml-auto"></div>
                <p>Projected Rental Yield：{{ item.property_info.projected_rental_yield }}%</p>
            </div>
            <a-button class="mt-2" type="primary" size="large" long shape="round" @click="handleGotoDetail">View Property</a-button>
        </div>
    </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from "vue-router";
import { propertyAddress, propertyAbi } from '@/abi'
import { readContract } from '@wagmi/core'
import Loading from '@/components/Loading.vue'
import Big from 'big.js';
import 'swiper/css';
import 'swiper/css/navigation';

const router = useRouter()
const props = defineProps({
    item: {
        type: Object,
        require: true,
    }
})
const statusCon = ref(null)
const mentCon = ref(null)

const currentSwipper = ref(0)
const onSwiper = (swiper) => {
    // console.log(swiper);
}
const calculateStock = computed(() => {
    if (!mentCon.value) return null
    return new Big(mentCon.value.tokenAmount).minus(mentCon.value.soldQuantity)
})

onMounted(async () => {
    
    const status = await readContract({
        address: propertyAddress,
        abi: propertyAbi,
        functionName: 'getPropertyInfo',
        args: [props.item.property_info.property_number]
    })
    statusCon.value = status
    const ment = await readContract({
        address: propertyAddress,
        abi: propertyAbi,
        functionName: 'getPropertyInvestmentValue',
        args: [props.item.property_info.property_number]
    })
    mentCon.value = ment

})

const handleGotoDetail = () => {
    router.push(`/market/detail/` + props.item.property_info.property_number)
}
const onSlideChange = (e) => {
    currentSwipper.value = e.activeIndex
}
</script>

<style lang="less" scoped>

.market-item {
    --swiper-navigation-size: 0.56rem;
    --swiper-theme-color: white;
    border-radius: 16px;
    overflow: hidden;
    background-color: white;
    .swiper-box {
        width: 540px;
        height: 380px;
        .swiper-slide {
            text-align: center;
            font-size: 18px;
            background: #fff;
    
            /* Center slide text vertically */
            display: flex;
            justify-content: center;
            align-items: center;
        }
    
        .swiper-slide img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    
        .swiper-pagination {
            position: absolute;
            bottom: 10px;
            right: 10px;
        }

        .img-navigation {
            position: absolute;
            font-size: 14px;
            bottom: 15px;
            right: 26px;
            z-index: 1;
            background: rgba(0,0,0, .5);
            border-radius: 20px;
            color: rgba(255,255,255,0.9);
            padding: 4px 12px;
            display: flex;
            align-items: center;
            gap: 6px;
            .icon {
                font-size: 18px;
            }
        }
    }

    .market-main {
        height: 380px;
        padding: 24px 32px;
        .arco-tag-size-medium {
            font-size: 18px;
            border-radius: 20px;
            // padding: 4px 12px;
            height: auto;
            line-height: auto;
        }
        .title {
            font-size: 20px;
            font-weight: bold;
        }
        .title-tips {
            font-size: 16px;
            color: #7B7B80;
        }
        .price {
            border-radius: 12px;
            padding: 22px 0;
            margin-top: 16px;
            > div {
                padding: 0 45px;
                &:nth-of-type(1) {
                    border-right: 1px solid #D8D8D8;
                }
            }
            h1 {
                font-size: 18px;
                margin: 0;
            }
            h2 {
                font-size: 18px;
                color: #7B7B80;
                margin: 0;
                > strong {
                    font-size: 30px;
                }
            }
        }

        .info {
            font-size: 18px;
            .icon {
                font-size: 20px;
            }
            > p {
                margin: 0 0 0 5px;
            }
        }
    }
}
</style>