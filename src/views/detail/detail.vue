<script setup>
import { ref, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
</script>

<template>
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
        </main>
        <aside class="aside text-[#2A2934] px-2 py-[0.4rem]">
            <p class="text-[0.48rem] font-bold">Purchase</p>
            <div class="token-price bg-[#F4F6FF] rounded-[0.2rem] mt-[0.2rem]">
                <div class="top flex items-center text-[0.36rem] px-[0.56rem] py-[0.4rem]">
                    <p class="font-bold">Token Price:</p>
                    <span class="text-[#F6615A] font-bold mx-1 text-[0.42rem]">$200</span>
                    <span class="text-[#888A9A]">≈ £160</span>
                </div>
                <div class="px-[0.56rem] py-[0.1rem]">
                    <div class="cell"><span class="label">Token name:</span><span class="value">$DSFT-1</span></div>
                    <div class="cell"><span class="label">Token Amount:</span><span class="value">1500 </span></div>
                    <div class="cell"><span class="label">Min purchase:</span><span class="value">1500 </span></div>
                    <div class="cell"><span class="label">Max purchase:</span><span class="value">1500 </span></div>
                    <div class="cell"><span class="label">Min increment:</span><span class="value">1500 </span></div>
                </div>
            </div>
        </aside>
    </div>
</template>

<style lang="less">
.detail-container {
    --swiper-navigation-size: 24px;
    --swiper-navigation-sides-offset: 10px;
    display: flex;
    align-items: start;
    gap: 16px;
    .main {
        flex: 1;
        .preview-image {
            width: 100%;
            height: 30vw;
            object-fit: cover;
            display: block;
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
    }

    .aside {
        width: 372px;
        background: #FFFFFF;
        box-shadow: 0px 4px 16px 0px rgba(8,8,35,0.04);
        border-radius: 16px;
        border: 1px solid #EBEBEB;

        .token-price {
            .top {
                border-bottom: 1px solid #EAECF5;
            }
            .cell {
                display: flex;
                align-items: center;
                font-size: 0.32rem;
                color: #5E6F86;
                padding: 8px 0;
                .value {
                    color: #09043E;
                    margin-left: auto;
                }
            }
        }
    }
}
</style>