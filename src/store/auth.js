import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils'
import { userLogin, loginUserInfo, signMsg, loginByAddr } from '@/api'
import { disconnect, switchNetwork, signMessage } from '@wagmi/core';
import { useWeb3Modal } from '@web3modal/wagmi/vue'
import { wagmiConfig, chains } from '@/libs/wagmi'
import { Notification } from '@arco-design/web-vue';

export const useAuthStore = defineStore('auth', {
    state: () => ({ 
        _address: null,
        _sign: null,
        _token: getToken() || '',
        _user: null,
        _network: null,
    }),
    getters: {
        address: state => state._address,
        token: state => state._token,
        sign: state => state._sign,
        user: state => state._user,
        network: state => state._network
    },
    actions: {
        setAddress(a) {
            this._address = a
        },
        setSign(s) {
            this._sign = s
        },
        setToken(t) {
            this._token = t
        },
        setCurNetwork(chain) {
            this._network = chain
        },
        connectWallet() {
            const modal = useWeb3Modal()
            // 未登录，先召唤起登录
            if (!this._token) {
                modal.open()
            }
        },
        changeNetword() {
            const modal = useWeb3Modal()
            modal.open({ view: 'Networks' })
        },
        switchNetwork() {
            return new Promise((resolve, reject) => {
                if (this._network.id == import.meta.env.VITE_BASE_CHAINID) {
                    resolve()
                } else {
                    switchNetwork({ chainId: chains[0].id }).then(res => {
                        console.log('switchNetwork:', res)
                        this.setCurNetwork(res)
                        resolve('change')
                    })
                }
            })
        },
        loginWithSignature() {
            return new Promise((resolve, reject) => {
                loginByAddr({
                    address: this.address
                }).then(async res => {
                    if (res.code == 200) {
                        this._token = res.data.token
                        setToken(this._token)
                        await this.loginWithToken()
                        resolve()
                    }
                })  
            })
        },
        loginWithSignatureStrict() {
            return new Promise((resolve, reject) => {
                signMsg({
                    address: this.address
                }).then(async res => {
                    if (res.code == 200) {

                        try {
                            // 用户签名信息
                            this._sign = await signMessage({ message: res.data.msg })
                            await this.getLoginToken()
                            await this.loginWithToken()
                        } catch (err) {
                            this.logout()
                            reject()
                        }
                    } else {
                        this.logout()
                        return Notification.error({
                            title: 'Error, Please try again.',
                            duration: 2000
                        })
                    }
                })
            })
        },
        getLoginToken() {
            return new Promise((resolve, reject) => {
                userLogin({
                    address: this.address,
                    l_type: 1,
                    sign: this.sign,
                }).then(res => {
                    if (res.code == 200) {
                        this._token = res.data.token
                        setToken(this._token)
                        resolve(res)
                    } else {
                        reject()
                        this.logout()
                        return Notification.error({
                            title: 'Error, Please try again.',
                            duration: 2000
                        })
                    }
                })
            })
        },
        loginWithToken() {
            return new Promise((resolve, reject) => {
                loginUserInfo().then(res => {
                    if (res.code == 200) {
                        this._user = res.data.user
                        resolve(res)
                    } else {
                        reject()
                        this.logout()
                        return Notification.error({
                            title: 'Error, Please try again.',
                            duration: 2000
                        })
                    }
                })
            })  
        },
        logout() {
            removeToken()
            this._token = ''
            this._user = null
            this._address = ''
            disconnect()
        }
    },
})