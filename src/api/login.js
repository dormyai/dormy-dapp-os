import axios from '@/axios'
import qs from 'qs'

export function userLogin(data = {}) {
    return axios({
        url: "/api/v1/user/login",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "post",
        data: qs.stringify(data),
    });
}
export function signMsg(data = {}) {
    return axios({
        url: "/api/v1/user/sign_msg",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "post",
        data: qs.stringify(data),
    });
}
export function loginUserInfo(params = {}) {
    return axios({
        url: "/api/v1/user/login_user_info",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "get",
        params,
    });
}
