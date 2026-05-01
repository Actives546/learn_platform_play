import { post, get } from '@/utils/request'

export interface LoginParams {
  userName: string
  password: string
}

export interface RegisterParams {
  userName: string
  password: string
  nickName?: string
  phone?: string
  email?: string
}

export interface LoginResult {
  token: string
  tokenType: string
  expiresIn: number
  userInfo: {
    id: number
    userName: string
    nickName: string
    avatar: string
    roleId: number
  }
}

export const login = (params: LoginParams) => {
  return post<LoginResult>('/auth/login', params)
}

export const register = (params: RegisterParams) => {
  return post<void>('/auth/register', params)
}

export const logout = () => {
  return post<void>('/auth/logout')
}

export const getUserInfo = () => {
  return get<any>('/auth/userInfo')
}

export const getCaptcha = (uuid: string) => {
  return get<string>(`/auth/captcha?uuid=${uuid}`)
}
