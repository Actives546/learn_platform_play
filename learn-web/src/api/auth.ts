import { post, get, ApiResponse } from '@/utils/request'

/**
 * 登录请求参数
 */
export interface LoginParams {
  userName: string
  password: string
  uuid?: string
  captcha?: string
}

/**
 * 注册请求参数
 */
export interface RegisterParams {
  userName: string
  password: string
  nickName?: string
  phone?: string
  email?: string
  uuid?: string
  captcha?: string
}

/**
 * 验证码参数
 */
export interface CaptchaParams {
  uuid: string
  captcha: string
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: number
  userName: string
  nickName: string
  avatar: string
  roleId: number
}

/**
 * 登录返回结果
 */
export interface LoginResult {
  token: string
  tokenType: string
  expiresIn: number
  userInfo: UserInfo
}

/**
 * 验证码返回结果
 */
export interface CaptchaResult {
  uuid: string
  image: string
}

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录结果
 */
export const login = (params: LoginParams & CaptchaParams): Promise<ApiResponse<LoginResult>> => {
  return post<LoginResult>('/auth/login', params)
}

/**
 * 用户注册
 * @param params 注册参数
 * @returns 注册结果
 */
export const register = (params: RegisterParams & CaptchaParams): Promise<ApiResponse<void>> => {
  return post<void>('/auth/register', params)
}

/**
 * 用户登出
 * @returns 登出结果
 */
export const logout = (): Promise<ApiResponse<void>> => {
  return post<void>('/auth/logout')
}

/**
 * 获取当前登录用户信息
 * @returns 用户信息
 */
export const getUserInfo = (): Promise<ApiResponse<UserInfo>> => {
  return get<UserInfo>('/auth/userInfo')
}

/**
 * 获取图形验证码
 * @param uuid 唯一标识
 * @returns 验证码图片Base64
 */
export const getCaptcha = (uuid: string): Promise<ApiResponse<string>> => {
  return get<string>(`/auth/captcha?uuid=${uuid}`)
}
