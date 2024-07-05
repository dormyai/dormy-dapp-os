import axios from 'axios';
import { str2Obj, MD5SHA512 } from '@/utils'
import { useAuthStore } from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // url = base url + request url
  timeout: 60000, // request timeout
});

export function setupAxios() {

  const authStore = useAuthStore()

  // request interceptor
  service.interceptors.request.use(
    config => {
      
      let timestamp = new Date().getTime();
      let transformData;
      config.headers['token'] = authStore.token || ''
      config.headers["ts"] = timestamp;

      if (config.method == 'get') {
        transformData = { ...config.params }
      } else {
        let dataObj = str2Obj(config.data);
        transformData = { ...dataObj }
      }
      
      transformData.ts = timestamp
      config.headers["sign"] = MD5SHA512(transformData);

      return config
    },
    error => {
      // do something with request error
      return Promise.reject(error)
    }
  )

  // response interceptor
  service.interceptors.response.use(
    response => {
      if (response.data.code == 100008) {
        authStore.loginWithSignatureStrict()
      } else if (response.data.code == 100005) {
        authStore.logout()
      } else {
        return response.data
      }
    },
    error => {
      if (response.data.code == 100008) {
        authStore.loginWithSignatureStrict()
      } else if (error.response.data.code == 100005) {
        authStore.logout()
      } else {
        return Promise.reject(error)
      }
    }
  )
}

export default service;
