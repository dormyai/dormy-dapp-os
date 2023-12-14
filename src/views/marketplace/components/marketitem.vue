<template>
    <div class="market-item flex flex-col md:flex-row">
        <swiper
            :modules="[Navigation]"
            :navigation="true"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
            class="swiper-box"
        >
            <swiper-slide v-for="item, index in imgList" :key="index">
                <img class="select-none" :src="item" alt="">
            </swiper-slide>
            <div class="img-navigation flex-1">
                <div class="icon i-solar-gallery-wide-bold"></div>
                <span>{{ currentSwipper + 1 }} / {{ imgList.length }}</span>
            </div>
        </swiper>
        <div class="market-main flex-1">
            <!-- 状态 -->
            <a-tag color="orangered">IN 21h: 14m: 30s</a-tag><a-tag color="gray">SOLD OUT</a-tag><a-tag color="purple">IN SALE</a-tag>
            <!-- 标题 -->
            <div class="flex items-center mt-1">
                <h2 class="title">Summerlee Avenue, East Finchley, N2</h2>
                <span class="title-tips ml-auto">Stock: 1500</span>
            </div>
            <div class="price bg-[#F6F6F6] grid grid-cols-2">
                <div>
                    <h1>Total Price</h1>
                    <h2><strong>$300,000</strong> ≈ £240,000</h2>
                </div>
                <div>
                    <h1>Total Price</h1>
                    <h2><strong>$300,000</strong> ≈ £240,000</h2>
                </div>
            </div>
            <div class="info flex items-center mt-1">
                <div class="icon i-solar-calendar-outline"></div>
                <p>Projected Annual Return：15.1%</p>
                <div class="icon i-solar-wallet-outline ml-auto"></div>
                <p>Projected Rental Yield：10.2%</p>
            </div>
            <a-button class="mt-2" type="primary" long shape="round">View Property</a-button>
        </div>
    </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import { defineProps, ref } from 'vue';
import 'swiper/css';
import 'swiper/css/navigation';

const props = defineProps({

})

const imgList = ref([
    'https://i.seadn.io/gcs/files/98d9070784ef890a9ba5ab2d17bb185a.png?auto=format&dpr=1&w=640',
    'https://i.seadn.io/gcs/files/98d9070784ef890a9ba5ab2d17bb185a.png?auto=format&dpr=1&w=640',
    'https://i.seadn.io/gcs/files/98d9070784ef890a9ba5ab2d17bb185a.png?auto=format&dpr=1&w=640',
])
const currentSwipper = ref(0)

const onSwiper = (swiper) => {
    console.log(swiper);
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