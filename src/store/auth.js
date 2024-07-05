import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils'
import { userLogin, loginUserInfo, signMsg, loginByAddr } from '@/api'
import { disconnect, getNetwork, signMessage } from '@wagmi/core';
import { useWeb3Modal } from '@web3modal/wagmi/vue'
import { Notification } from '@arco-design/web-vue';
import { toHex } from 'viem'

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
            // not login
            if (!this._token) {
                modal.open()
            }
        },
        changeNetword() {
            const modal = useWeb3Modal()
            modal.open({ view: 'Networks' })
        },
        switchNetworks() {
            return new Promise(async (resolve, reject) => {
                let chainId = import.meta.env.VITE_BASE_CHAINID
                if (this._network.id == chainId) {
                    resolve('default')
                } else {
                    if (window.ethereum) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{
                                    chainId: toHex(168587773) // Target chain id
                                }]
                            })
                            setTimeout(async () => {
                                let network = await getNetwork()
                                if (network.chain.id == chainId) {
                                    resolve('change')
                                }
                            }, 500);
                        } catch (e) {
                            reject()
                            if (e.code === 4902) {
                                try {
                                    console.log('wallet_addEthereumChain');
                                    await window.ethereum.request({
                                        method: 'wallet_addEthereumChain',
                                        params: [
                                            {
                                                chainId: toHex(168587773), // Target chain id
                                                chainName: 'Blast Sepolia',
                                                nativeCurrency: {
                                                    name: 'Blast Sepolia',
                                                    symbol: 'ETH',
                                                    decimals: 18
                                                },
                                                rpcUrls: ['https://sepolia.blast.io'],
                                                blockExplorerUrls: ['https://testnet.blastscan.io/']
                                            }
                                        ]
                                    })
                                } catch (ee) {
                                    //
                                    reject()
                                }
                            }
                        }

                    }
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
                            // signature
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