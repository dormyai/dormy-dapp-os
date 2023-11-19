<template>
    <header class="stiky top-0 w-full flex items-center px-4">
        <Logo class="w-6" />
        <div class="flex items-center gap-x-4 ml-auto">
            <nav class="hidden md:flex items-center gap-x-4 text-md font-bold">
                <a>Market</a>
                <a>Market</a>
                <a>Market</a>
                <i class="i-solar-smile-circle-broken"></i>
            </nav>
            <w3m-button :balance="'hide'"/>
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

onMounted(() => {
    console.log('result:', getAccount())
})

</script>

<style scoped lang="less">
header {
    box-sizing: border-box;
    height: var(--header-height);
    nav {
        a {
            cursor: pointer;
        }
    }
}
</style>