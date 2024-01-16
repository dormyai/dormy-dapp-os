import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils'
import { userLogin, loginUserInfo } from '@/api'
import { disconnect, getNetwork, switchNetwork } from '@wagmi/core';
import { useWeb3Modal } from '@web3modal/wagmi/vue'
import { wagmiConfig, chains } from '@/libs/wagmi'

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
        setSing(s) {
            this._sign = s
        },
        setToken(t) {
            this._token = t
        },
        getCurNetwork() {
            this._network = getNetwork().chain
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
            return new Promise((resolve, reject) => {[
                switchNetwork({ chainId: chains[0].id }).then(res => {
                    console.log('::::::>>>res', res)
                    resolve()
                })
            ]})
        },
        userLoginToken() {
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
                        disconnect()
                    }
                })
            })
        },
        userLoginInfo() {
            return new Promise((resolve, reject) => {
                loginUserInfo().then(res => {
                    if (res.code == 200) {
                        this._user = res.data.user
                        resolve(res)
                    } else {
                        reject()
                        disconnect()
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