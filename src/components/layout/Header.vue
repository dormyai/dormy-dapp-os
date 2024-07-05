<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useAuthStore } from '@/store/auth';
import { getAccount, watchNetwork, getNetwork, watchAccount } from '@wagmi/core';
import { useWeb3ModalState } from '@web3modal/wagmi/vue';
import { IconUser } from '@arco-design/web-vue/es/icon';

const state = useWeb3ModalState()
const authStore = useAuthStore()
const loginLoading = ref(false)

// 获取签名
watchEffect(() => {
    if (!!authStore.address && !authStore.token) {
        
        loginLoading.value = true

        authStore.loginWithSignature().then(res => {
            loginLoading.value = false
        }).catch(() => {
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

onMounted(async () => {
    let network = await getNetwork()
    authStore.setCurNetwork(network.chain)

    if (!!authStore.token) {
        let account = await getAccount()
        authStore.setAddress(account.address || null)
    }

    watchNetwork((e) => {
        authStore.setCurNetwork(e.chain)
    })

    watchAccount((a) => {
        if (a.address && !!authStore.token) {
            authStore.setAddress(a.address)
            authStore.loginWithSignature()
        }
    })
      
})

const handleConncetWallet = () => {
    authStore.connectWallet()
}

const handleChangeNetwork = () => {
    authStore.changeNetword()
}

const handleLogout = () => {
    authStore.logout()
}

</script>

<template>
    <header class="sticky top-0 w-full">
        <div class="inner md:w-[28rem] mx-auto flex items-center gap-x-[1.44rem]">
            <router-link to="/"><Logo class="logo block w-[3.4rem]"/></router-link>
            <router-link to="/">Home</router-link>
            <router-link to="/market">Marketplace</router-link>
            <router-link to="/dashboard">Dashboard</router-link>
            <div class="flex items-center gap-x-2 ml-auto">
                <a-button type="outline" v-if="authStore.user" shape="round" @click="handleChangeNetwork">{{ authStore.network?.name }}</a-button>
    
                <a-dropdown v-if="authStore.user">
                    <a-button type="primary" shape="round">{{ authStore.user.name }}</a-button>
                    <template #content>
                        <a-doption class="flex items-center">
                            <a-avatar :size="28" :style="{ backgroundColor: '#F7A2CA' }"><IconUser /></a-avatar>
                            <span class="ml-1">{{ authStore.user.name }}</span>
                        </a-doption>
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
<style lang="less">
.arco-dropdown {
    padding: 0;
    .arco-dropdown-option {
        &:hover {
            .arco-dropdown-option-content {
                color: #3B5CFF;
            }
        }
        .arco-dropdown-option-content {
            color: #5E6F86;
            width: 100%;
            text-align: center;
            cursor: pointer;
            line-height: 3.4;
        }
    }
}
</style>