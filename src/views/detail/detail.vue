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

            <section class="address-main py-2">
                <h2 class="c-h2">Summerlee Avenue,East Finchley, London</h2>
                <p>London, UK, N2 3DP</p>
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
        </main>

        <!-- aside -->
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
    color: #2A2934;
    padding-top: 32px;
    padding-bottom: 98px;
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