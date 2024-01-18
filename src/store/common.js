import { defineStore } from 'pinia'
import { getRate } from '@/api'

export const commonStore = defineStore('common', {
    state: () => ({
        _rate: 0.79,
    }),
    getters: {
        rate: state => state._rate
    },
    actions: {
        updateRate() {
            return new Promise((resolve, reject) => {
                getRate().then(res => {
                    this._rate = res.data.rate.Value
                })
            })
        }
    }
})