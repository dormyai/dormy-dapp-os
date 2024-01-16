<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { userPropertList, calculateUserProperty } from '@/api';
import DashboardItem from './components/dashboardItem.vue';
import Loading from '@/components/Loading.vue';
import Empty from '@/components/Empty.vue';
import { useAuthStore } from '@/store';
const authStore = useAuthStore()
const propertyList = reactive({ list: null })
const dashboardDetail = reactive({ detail: null })
const detailLoading = ref(false)
const listLoading = ref(false)
const listTotal = ref(0)
const listParams = ref({
    pn: 1,
    ps: 10,
})

const getDashboard = () => {

    if(!authStore.token) return;

    detailLoading.value = true
    calculateUserProperty().then(res => {
        if (res.code == 200) {
            dashboardDetail.detail = res.data
        }
        detailLoading.value = false
    })
}

const getList = () => {

    if(!authStore.token) return;
    if(listLoading.value) return;

    listLoading.value = true
    userPropertList({
        pn: listParams.value.pn,
        ps: listParams.value.ps
    }).then(res => {
        if (res.code == 200) {
            propertyList.list = res.data.result || []
            listTotal.value = res.data.total
        } else {

        }
        listLoading.value = false
    })
}

onMounted(() => {

})

watch(
    () => authStore.token,
    (val) => {
        if (!val) return;
        getDashboard()
        getList()
    }
)

</script>

<template>
    <div class="dashboard-container">

        <div class="inner md:w-[28rem] mx-auto">
            <h1 class="m-h1">Dashboard</h1>
    
            <h3 class="m-h3">Overview</h3>
            <div class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                <div class="overview">
                    <p class="text-[#525767]">Total Investment</p>
                    <Loading class="price" v-if="detailLoading" />
                    <h1 class="price" v-else>${{ dashboardDetail.detail?.total_investment || 0 }}</h1>
                    <!-- <div class="flex items-center gap-1">
                        <p class="text-[#6D6F80]">Appreciation</p>
                        <span class="text-[#16C784]">+$200</span>
                        <a-tag class="ml-auto" color="#16C784">+10%</a-tag>
                    </div> -->
                </div>
                <div class="overview">
                    <p class="text-[#755A4C]">Total Asset Value</p>
                    <Loading class="price" v-if="detailLoading" />
                    <h1 class="price" v-else>${{ dashboardDetail.detail?.total_asset_value || 0 }}</h1>
                </div>
                <div class="overview">
                    <p class="text-[#443872]">Total Rental Yield</p>
                    <Loading class="price" v-if="detailLoading" />
                    <h1 class="price" v-else>${{ dashboardDetail.detail?.total_rental_yield || 0 }}</h1>
                </div>
                <div class="overview">
                    <p class="text-[#285F5F]">Actual ROI</p>
                    <Loading class="price" v-if="detailLoading" />
                    <h1 class="price" v-else>{{ dashboardDetail.detail?.actual_roi || 0 }}%</h1>
                </div>
            </div>
        </div>

        <!-- list -->
        <div class="inner md:w-[28rem] mx-auto py-8">
            <h3 class="m-h3 flex items-center">
                <span>Property Assets</span>
                <a-button class="title-button ml-auto" size="small" type="outline" shape="round">Claim All Rents</a-button>
            </h3>
            <main class="main-list mt-2">
                <header class="flex items-center px-[0.36rem] bg-[#F6F6F8] py-[0.5rem]">
                    <div class="w-[12.5rem]">Token</div>
                    <div class="w-[2rem]">Amount</div>
                    <div class="w-[2.5rem]">Value</div>
                    <div class="w-[3.6rem]">Rent Start Date</div>
                    <div class="w-[3.2rem]">Rents Income</div>
                    <div class="w-[3.5rem]">Action</div>
                </header>
                <Empty v-if="!authStore.token" message="To see more information, please connect your wallet. " class="py-8">
                    <template #default>
                        <a-button @click="authStore.connectWallet" class="login-button" size="small" type="outline" shape="round">Connect Wallet</a-button>
                    </template>
                </Empty>
                <template v-else>
                    <Empty v-if="!listLoading && propertyList.list?.length == 0" class="py-8" />
                    <div class="list-box">
                        <DashboardItem v-for="item,index in propertyList.list" :item="item" :key="index" />
                        <div class="text-center py-4" v-if="listLoading"><Loading /></div>
                    </div>
                    <div class="text-right mt-3 flex justify-end">
                        <a-pagination :size="'small'" :total="listTotal"/>
                    </div>
                </template>
            </main>
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

    .title-button {
        font-size: 16px;
    }

    .main-list {
        
        header {
            border-radius: 16px 16px 0px 0px;
            color: #54546C;
            font-size: 16px;
            border: 1px solid #F6F6F8;
            > div {
                text-align: center;
                position: relative;
                &:not(:last-child) {
                    &::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        right: 0;
                        transform: translateY(-50%);
                        width: 1px;
                        height: 20px;
                        background: #B0B0B5;
                    }
                }
            }
        }

        .list-box {
            border-radius: 0px 0px 16px 16px;
            border: 1px solid #E6E6E6;
            border-top: 0;
        }

        .login-button {
            font-size: 16px;
        }
    }
}

</style>