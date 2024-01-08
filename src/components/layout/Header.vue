<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useAuthStore } from '@/store/auth'
import { getAccount, signMessage, disconnect, getNetwork } from '@wagmi/core';
import { useWeb3Modal, useWeb3ModalState, useWeb3ModalEvents } from '@web3modal/wagmi/vue'
import { signMsg } from '@/api'
import { IconUser } from '@arco-design/web-vue/es/icon';

const modal = useWeb3Modal()
const state = useWeb3ModalState()
const authStore = useAuthStore()
const loginLoading = ref(false)

// 获取签名
watchEffect(() => {
    if (!!authStore.address) {
        
        loginLoading.value = true

        signMsg({
            address: authStore.address
        }).then(async res => {
            if (res.code == 200) {
                
                const signature = await signMessage({
                    message: res.data.msg,
                })
                authStore.setSing(signature)
                await authStore.userLoginToken()
                authStore.userLoginInfo()
            } else {
                disconnect()
            }
            loginLoading.value = false
        })
    }
}, [authStore.address])

const handlePostTwitter = () => {
    let text = `I am already prepared to explore the new era of %23RWAFi.%0a%0a@DormyAI is a bridge connecting fractional real estate and DeFi. It allows you to farm without impermanent loss, and your assets are also continuously appreciating!%0a%0aDiscover more at`
    let url = encodeURIComponent(`https://Dormy.ai\r`)
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=RWA,100xGems`)
}

// w3m 的弹窗
watch(() => state.open, async (val) => {
    if(!val && !authStore.token) {
        let account = await getAccount()
        authStore.setAddress(account.address || null)
    }
})

onMounted(async () => {
    // authStore.getCurNetwork()
    // await authStore.getCurNetwork()
    authStore.getCurNetwork()
    // console.log('account:::', account)
    
})

const handleConncetWallet = () => {
    // 未登录，先召唤起登录
    if (!authStore.token) {
        modal.open()
    }
}

const handleChangeNetwork = () => {
    modal.open({ view: 'Networks' })
}

const handleLogout = () => {
    authStore.logout()
}

</script>

<template>
    <header class="sticky top-0 w-full">
        <div class="inner md:w-[28rem] mx-auto flex items-center gap-x-[1.44rem]">
            <Logo class="logo block w-[3.4rem]"/>
            <router-link to="/">Home</router-link>
            <router-link to="/market">Marketplace</router-link>
            <router-link to="/dashboard">Dashboard</router-link>
            <router-link to="/">Docs</router-link>
            <div class="flex items-center gap-x-2 ml-auto">
                <a-button type="outline" shape="round" @click="handleChangeNetwork">{{ authStore.network?.name }}</a-button>
    
                <a-dropdown trigger="hover" v-if="authStore.user">
                    <a-button type="primary" shape="round">{{ authStore.user.name }}</a-button>
                    <template #content>
                        <a-doption class="flex items-center">
                            <a-avatar :size="28" :style="{ backgroundColor: '#F7A2CA' }"><IconUser /></a-avatar>
                            <span class="ml-1">{{ authStore.user.name }}</span>
                        </a-doption>
                        <a-doption>Verification: Successful</a-doption>
                        <a-doption @click="handleLogout">Logout</a-doption>
                    </template>
                </a-dropdown>
                <a-button v-if="!authStore.user" :loading="loginLoading" type="primary" shape="round" @click="handleConncetWallet">Connect Wallet</a-button>
            </div>
        </div>
    </header>
</template>

<style scoped lang="less">
header {
    box-sizing: border-box;
    background: white;
    z-index: 99;
    border-bottom: 1px solid #D5D5D5;
    .inner {
        height: var(--header-height);
    }
    a {
        font-size: 22px;
        text-decoration: none;
        color: black;
    }
}
</style>
<style>
.arco-dropdown-option-content {
    color: #5E6F86;
    width: 100%;
    text-align: center;
    cursor: pointer;
}
</style>