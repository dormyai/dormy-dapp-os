<template>
    <header class="sticky top-0 w-full flex items-center px-[0.8rem] md:px-[5.12rem] gap-x-[1.44rem]">
        <Logo class="logo block w-[3.4rem]"/>
        <router-link to="/">Home</router-link>
        <router-link to="/market">Marketplace</router-link>
        <router-link to="/">Dashboard</router-link>
        <router-link to="/">Docs</router-link>
        <div class="flex items-center gap-x-4 ml-auto">
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
    background: white;
    z-index: 99;
    border-bottom: 1px solid #D5D5D5;
    a {
        font-size: 22px;
        text-decoration: none;
        color: black;
    }
}
</style>