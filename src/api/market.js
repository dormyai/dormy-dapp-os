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

export function propertyDetail(data = {}) {
    return axios({
        url: "/api/v1/property/detail",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "get",
        data: qs.stringify(data),
    });
}