<template>
    <header class="stiky top-0 w-full flex items-center px-[0.8rem] md:px-[5.12rem]">
        <Logo class="logo block w-[3.4rem]"/>
        <div class="flex items-center gap-x-4 ml-auto">
            <!-- <w3m-button :balance="'hide'"/> -->
            <a-button @click="handlePostTwitter" type="primary" shape="round">Get Ready</a-button>
        </div>
    </header>
</template>

<script setup>
import { onMounted } from 'vue';
import { getAccount } from '@wagmi/core';
import { useWeb3Modal } from '@web3modal/wagmi/vue'
const { open, close } = useWeb3Modal()

import { useAuthStore } from '@/store/auth'
const authStore = useAuthStore()

const handleIncrece = (address) => {
    authStore.setAddress(address)
}

const handleConnectWallet = async () => {
    open().then(res => {
        console.log('res:', res)
    })
    
}

const handlePostTwitter = () => {
    let text = `I am already prepared to explore the new era of RWAFi.\n @Dormydotai is a bridge connecting fractional real estate and DeFi. It allows you to farm without impermanent loss, and your assets are also continuously appreciating. Discover more at`
    let url = encodeURIComponent(`https://Dormy.ai\r`)
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`)
}

onMounted(() => {
    console.log('result:', getAccount())
})

</script>

<style scoped lang="less">
header {
    box-sizing: border-box;
    height: var(--header-height);
}
</style>