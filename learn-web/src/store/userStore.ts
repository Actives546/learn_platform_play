import { create } from 'zustand'
import { setToken, removeToken, setUserInfo, removeUserInfo, getToken, getUserInfo } from '@/utils/token'
import type { UserInfo } from '@/api/auth'

interface UserState {
  token: string | null
  userInfo: UserInfo | null
  isLogin: boolean
  setAuth: (token: string, userInfo: UserInfo) => void
  clearAuth: () => void
  initAuth: () => void
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  userInfo: null,
  isLogin: false,

  setAuth: (token: string, userInfo: UserInfo) => {
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
