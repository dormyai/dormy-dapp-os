<script setup>
import { ref, reactive, watchEffect, onMounted } from 'vue';
import { propertyList } from '@/api';
import MarketItem from './components/marketitem.vue';

const loading = ref(false)
const queryParams = reactive({ pn: 1, ps: 10 })
const list = ref([])

onMounted(() => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
    getData()
})

const getData = () => {
    if (loading.value) return;

    loading.value = true
    propertyList({
        pn: queryParams.pn,
        ps: queryParams.ps
    }).then(res => {
        if (res.code == 200) {
            if (queryParams.pn == 1) {
                list.value = res.data.result
            }
        }
        loading.value = false
    })
}

</script>

<template>
    <div class="market-container">
        <div class="inner md:w-[28rem] mx-auto pb-4">
            <h1 class="title">Listing Properties</h1>
            <p class="des">Invest in UK student housing and receive a stable rental income!</p>
            <div class="list">
                <MarketItem v-for="item in list" :key="item.property_info.id" :item="item" class="mt-3" />

                <div v-if="loading" class="py-12 text-center">
                    <Loading :size="26" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.market-container {
    --text-color: black;
    color: var(--text-color);
    min-height: 100vh;
    background-color: #F6F6F8;

    .title {
        font-size: 28px;
        padding: 40px 0 8px 0;
        margin: 0;
    }
    .des {
        font-size: 18px;
        color: #5E6F86;
    }
}
</style>