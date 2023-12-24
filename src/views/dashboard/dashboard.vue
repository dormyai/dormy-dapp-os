<script setup>
import { ref } from 'vue';

</script>

<template>
    <div class="dashboard-container px-[0.8rem] md:px-[5.12rem]">

        <h1 class="m-h1">Dashboard</h1>

        <h3 class="m-h3">Overview</h3>
        <div class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 mt-1">
            <div class="overview">
                <p class="text-[#525767]">Total Investment</p>
                <h1 class="price">$2,420</h1>
                <div class="flex items-center gap-1">
                    <p class="text-[#6D6F80]">Appreciation</p>
                    <span class="text-[#16C784]">+$200</span>
                    <a-tag class="ml-auto" color="#16C784">+10%</a-tag>
                </div>
            </div>
            <div class="overview">
                <p class="text-[#755A4C]">Total Investment</p>
            </div>
            <div class="overview">
                <p class="text-[#443872]">Total Investment</p>
            </div>
            <div class="overview">
                <p class="text-[#285F5F]">Total Investment</p>
            </div>
        </div>

    </div>
</template>

<style lang="less" scoped>

.dashboard-container {
    color: #2A2934;

    .m-h1 {
        font-size: 28px;
    }
    .m-h3 {
        font-size: 20px;
    }

    .overview {
        padding: 0.52rem 0.48rem;
        border-radius: 16px;
        font-size: 16px;
        &:nth-of-type(1) {
            background: #F2F5FF url('../../assets/images/dashboard/pic-dashboard-01.png') no-repeat right bottom / contain;
        }
        &:nth-of-type(2) {
            background: #FDF5F0 url('../../assets/images/dashboard/pic-dashboard-02.png') no-repeat right bottom / contain;
        }
        &:nth-of-type(3) {
            background: #F4F1FE url('../../assets/images/dashboard/pic-dashboard-03.png') no-repeat right bottom / contain;
        }
        &:nth-of-type(4) {
            background: #EFFCFC url('../../assets/images/dashboard/pic-dashboard-04.png') no-repeat right bottom / contain;
        }
        .price {
            font-size: 42px;
            margin: 16px 0;
            line-height: 1;
        }
        .arco-tag {
            border-radius: 99px;
        }
    }
}

</style>