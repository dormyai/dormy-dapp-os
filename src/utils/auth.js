import Cookies from 'js-cookie'

const TokenKey = 'token'
const oneDay = 7

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  Cookies.set('domain', import.meta.env.VITE_BASE_DOMAIN)
  return Cookies.set(TokenKey, token, {
    expires: oneDay,
  });
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
