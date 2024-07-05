<script setup>
import { ref, onMounted } from 'vue';
import Image from '@/components/Image.vue'
import Dialog from '@/components/Dialog.vue'
import Loading from '@/components/Loading.vue'
import TableItem from './tableItem.vue'
import { Notification } from '@arco-design/web-vue';
import { rentals } from '@/api'
import { dormyAddress, dormyAbi } from '@/abi'
import { readContract } from '@wagmi/core'
const showRent = ref(false)
const showPreviewImage = ref(false)
const previewImageData = ref(null)
const loading = ref(false)
const tokenuriLoading = ref(true)
const listTotal = ref(0)
const list = ref([])
const listParams = ref({
    pn: 1,
    ps: 10,
})
const props = defineProps({
    item: {
        type: Object,
        require: true
    }
})

const dateFormat = (time) => {
    return new Date(time).toLocaleDateString();
}

const handleShowRent = (item) => {
    showRent.value = true

    if (loading.value) return;
    loading.value = true
    rentals({
        pn: listParams.value.pn,
        ps: listParams.value.ps,
        propert_info_id: item.property_info.id
    }).then(res => {
        if (res.code == 200) {
            listTotal.value = res.data.total
            list.value = res.data.result
        } else {
            
        }
        loading.value = false
    })
}

const readingTokenuri = async (tokenid) => {

    try {
        tokenuriLoading.value = true
        const params = await readContract({
            address: dormyAddress,
            abi: dormyAbi,
            functionName: 'tokenURI',
            args: [tokenid]
        })
        
        let encodeData = atob(params.substring(29))
        let jsonData = JSON.parse(encodeData)
        previewImageData.value = jsonData?.image
        tokenuriLoading.value = false
    } catch (err) {
        tokenuriLoading.value = false
    }
}

const handlePreview = () => {
    showPreviewImage.value = true
}
const handleClose = () => {
    list.value = []
}

onMounted(() => {
    readingTokenuri(props.item.property_user_summary.token_id)
})

</script>

<template>
    <div class="item flex items-center px-[0.36rem] py-[0.8rem]">
        <div class="w-[12.5rem] flex items-center gap-2">
            <Image v-if="item.property_info_medium && item.property_info_medium.length > 0" class="list-image ml-2" :src="item.property_info_medium[0].url" />
            <Image v-else class="list-image ml-2" :src="''" />
            <div class="text-left">
                <h3 class="m-h3 truncate flex-1">{{ item.property_info.address1 }},{{ item.property_info.address2 }}</h3>
                <p class="name">{{ item.property_info.property_number }}</p>
                <Loading v-if="tokenuriLoading" />
                <span v-else @click="handlePreview">View Title Deed</span>
            </div>
        </div>
        <div class="w-[2rem]">{{ item.property_user_summary.amount }}</div>
        <div class="w-[2.5rem]">{{ (item.property_user_summary.amount * item.property_chain_info.token_price).toFixed(2)}}$</div>
        <div class="w-[3.6rem]">{{ dateFormat(item.property_user_summary.start_time) }}</div>
        <div class="w-[3.2rem]">--</div>
        <div class="w-[3.5rem]">
            <a-button class="button" shape="round" size="small" @click="handleShowRent(item)">Claim Rents</a-button>
        </div>

        <Dialog v-model="showRent" :width="'24rem'" @close="handleClose" :title="'Rental Record'">
            <template #main>
                <header class="header flex items-center px-[0.36rem] bg-[#F6F6F8] py-[0.5rem]">
                    <div class="w-[4rem]">Start time</div>
                    <div class="w-[4rem]">End time</div>
                    <div class="w-[4rem]">Total Rent($)</div>
                    <div class="w-[4rem]">My Dividends($)</div>
                    <div class="flex-1"></div>
                </header>
                <div class="list py-2">
                    <div v-if="loading" class="text-center">
                        <Loading />
                    </div>
                    <TableItem :data="item" v-for="item,index in list" :key="index" />
                </div>
                <a-pagination :size="'small'" :current="listParams.pn" :total="listTotal" @change="handleTurnpage"/>
            </template>
        </Dialog>

        <Dialog v-model="showPreviewImage" :width="'15rem'" title="On-chain property deed">
            <template #main>
                <img class="w-full" :src="previewImageData">
            </template>
        </Dialog>
    </div>
</template>

<style lang="less" scoped>
.m-h3 {
    font-size: 20px;
}
.header {
    font-size: 18px;
}
.list {
    .list-row {
        font-size: 18px;
    }
}
.item {
    text-align: center;
    font-size: 18px;
    .list-image {
        width: 190px;
        height: 120px;
        border-radius: 8px;
    }
    .name {
        font-size: 18px;
        color: #7B7B80;
    }
    .m-h3 {
        max-width: 7.6rem;
    }
    span {
        color: #EC7201;
        font-size: 16px;
        margin-top: 20px;
        display: inline-block;
        text-decoration: underline;
        cursor: pointer;
    }

    .button {
        font-size: 16px;
        background: rgba(59,92,255,0.1);
        color: #3B5CFF;
        &:disabled {
            background: #E9E9E9;
            color: #969696;
        }
    }
}
</style>