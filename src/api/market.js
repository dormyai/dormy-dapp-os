import axios from '@/axios'
import qs from 'qs'

export function propertyList(params = {}) {
    return axios({
        url: "/api/v1/property/list",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "get",
        params,
    });
}

export function propertyDetail(params = {}) {
    return axios({
        url: "/api/v1/property/detail",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "get",
        params,
    });
}

export function userPropertList(params = {}) {
    return axios({
        url: "/api/v1/property/userPropertList",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "get",
        params,
    });
}

export function calculateUserProperty(params = {}) {
    return axios({
        url: "/api/v1/property/calculateUserProperty",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "get",
        params,
    });
}

export function getRate(data = {}) {
    return axios({
        url: "/api/v1/common/get_rate",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "post",
        data: qs.stringify(data),
    });
}

export function rentals(params = {}) {
    return axios({
        url: "/api/v1/property/rentals",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "get",
        params,
    });
}