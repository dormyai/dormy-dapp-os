import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils'
import { userLogin, loginUserInfo } from '@/api'
import { disconnect } from '@wagmi/core';

export const useAuthStore = defineStore('auth', {
    state: () => ({ 
        _address: null,
        _sign: null,
        _token: getToken() || '',
        _user: null,
    }),
    getters: {
        address: state => state._address,
        token: state => state._token,
        sign: state => state._sign,
        user: state => state._user,
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
            disconnect()
        }
    },
})