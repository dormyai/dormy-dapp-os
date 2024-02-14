<script setup>
import { onMounted, ref } from 'vue';
import { readContract, getAccount, writeContract, prepareWriteContract, getContract, waitForTransaction } from '@wagmi/core'
import { rentAddress, rentAbi } from '@/abi'
import { Notification } from '@arco-design/web-vue';
import { formatEther } from 'viem'
import Big from 'big.js';
import Loading from '@/components/Loading.vue'
const claimLoading = ref(false)
const dividends = ref('')
const readingContract = ref(true)
const props = defineProps({
    data: {
        require: true,
    }
})
const dateFormat = (time) => {
    return new Date(time).toLocaleDateString();
}
const calculatePrice = (bigVal) => {
    return new Big(bigVal).toString()
}


const getRentParams = async (slotid, starttime, endtime) => {
    let account = await getAccount()
    readingContract.value = true
    try {
        const params = await readContract({
            address: rentAddress,
            abi: rentAbi,
            functionName: 'queryRent',
            args: [account.address, slotid, starttime, endtime]
        })
        console.log('params>>>', params)
        dividends.value = params
        readingContract.value = false
        // claimFun(slotid, starttime, endtime)
    } catch(err) {
        readingContract.value = false
    }
}

const claimFun = async(slotid, starttime, endtime) => {
    let account = await getAccount()
    claimLoading.value = true
    
    try {
        const preparClaimConfig = await prepareWriteContract({
            address: rentAddress,
            abi: rentAbi,
            functionName: 'claimRent',
            args: [account.address, slotid, starttime, endtime],
            overrides: {
                gasLimit: 300000,
                from: account.address
            },
            account: account.address
        })
        const result = await writeContract(preparClaimConfig)
        waitForTransaction({
            hash: result.hash,
        }).then(r => {
            if (r.status == 'success') {
                Notification.success({
                    title: 'Successful!',
                    duration: 3000
                })
                claimLoading.value = false
            }
        })
    } catch(err) {
        console.log('err:', err)
        claimLoading.value = false
        Notification.error({
            title: err.message,
            duration: 3000
        })
    }
}

onMounted(() => {
    getRentParams(props.data.slot_id, props.data.start_time, props.data.end_time)
})
</script>

<template>
    <div class="list-row flex items-center px-[0.36rem] py-[0.3rem] hover:bg-[#FeFeFe]">
        <div class="w-[4rem]">{{ dateFormat(data.start_time * 1000) }}</div>
        <div class="w-[4rem]">{{ dateFormat(data.end_time * 1000) }}</div>
        <div class="w-[4rem]">{{ calculatePrice(data.total_amount / 1e18) }}</div>
        <div class="w-[4rem]"><Loading v-if="readingContract" /><span v-else>{{ formatEther(dividends.toString()) }}</span></div>
        <div class="flex-1 text-right">
            <a-button class="button" :disabled="claimLoading" :loading="claimLoading" shape="round" size="mini" type="outline" @click="claimFun(data.slot_id, data.start_time, data.end_time)">Claim</a-button>
        </div>
    </div>
</template>

<style scoped lang="less">

</style>
