import { create } from 'zustand'
import { setToken, removeToken, setUserInfo, removeUserInfo, getToken, getUserInfo } from '@/utils/token'

interface UserState {
  token: string | null
  userInfo: any
  isLogin: boolean
  setAuth: (token: string, userInfo: any) => void
  clearAuth: () => void
  initAuth: () => void
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  userInfo: null,
  isLogin: false,

  setAuth: (token: string, userInfo: any) => {
    setToken(token)
    setUserInfo(userInfo)
    set({
      token,
      userInfo,
      isLogin: true,
    })
  },

  clearAuth: () => {
    removeToken()
    removeUserInfo()
    set({
      token: null,
      userInfo: null,
      isLogin: false,
    })
  },

  initAuth: () => {
    const token = getToken()
    const userInfo = getUserInfo()
    if (token && userInfo) {
      set({
        token,
        userInfo,
        isLogin: true,
      })
    }
  },
}))
