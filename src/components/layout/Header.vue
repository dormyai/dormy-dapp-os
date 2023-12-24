<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useAuthStore } from '@/store/auth'
import { getAccount, signMessage, disconnect } from '@wagmi/core';
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

// w3m 的弹窗
watch(() => state.open, async (val) => {
    if(!val && !authStore.token) {
        let account = await getAccount()
        authStore.setAddress(account.address || null)
    }
})

onMounted(() => {
    // console.log('result:', getAccount())
    
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
    <header class="sticky top-0 w-full flex items-center px-[0.8rem] md:px-[5.12rem] gap-x-[1.44rem]">
        <Logo class="logo block w-[3.4rem]"/>
        <router-link to="/">Home</router-link>
        <router-link to="/market">Marketplace</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/">Docs</router-link>
        <div class="flex items-center gap-x-2 ml-auto">
            <a-button type="outline" shape="round" @click="handleChangeNetwork">Network</a-button>

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
    </header>
</template>

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
<style>
.arco-dropdown-option-content {
    color: #5E6F86;
    width: 100%;
    text-align: center;
    cursor: pointer;
}
</style>