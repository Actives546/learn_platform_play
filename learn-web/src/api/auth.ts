import { post, get, ApiResponse } from '@/utils/request'

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

export interface UserInfo {
  id: number
  userName: string
  nickName: string
  avatar: string
  roleId: number
}

export interface LoginResult {
  token: string
  tokenType: string
  expiresIn: number
  userInfo: UserInfo
}

export const login = (params: LoginParams): Promise<ApiResponse<LoginResult>> => {
  return post<LoginResult>('/auth/login', params)
}

export const register = (params: RegisterParams): Promise<ApiResponse<void>> => {
  return post<void>('/auth/register', params)
}

export const logout = (): Promise<ApiResponse<void>> => {
  return post<void>('/auth/logout')
}

export const getUserInfo = (): Promise<ApiResponse<UserInfo>> => {
  return get<UserInfo>('/auth/userInfo')
}

export const getCaptcha = (uuid: string): Promise<ApiResponse<string>> => {
  return get<string>(`/auth/captcha?uuid=${uuid}`)
}
