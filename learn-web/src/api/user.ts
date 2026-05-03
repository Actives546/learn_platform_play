import { post, get, put, del, ApiResponse } from '@/utils/request'

export type UserStatus = 0 | 1

export interface User {
  id: number
  userName: string
  password?: string
  nickName?: string
  phone?: string
  email?: string
  avatar?: string
  roleId: number
  status: UserStatus
  salt?: string
  createTime?: string
  updateTime?: string
  createBy?: number
  updateBy?: number
}

export interface UserForm {
  id?: number
  userName: string
  password?: string
  nickName?: string
  phone?: string
  email?: string
  avatar?: string
  roleId?: number
  status?: UserStatus
}

export interface PageResult<T> {
  total: number
  records: T[]
  pageNum: number
  pageSize: number
  pages: number
}

export interface UserPageParams {
  userName?: string
  status?: number
  roleId?: number
  pageNum?: number
  pageSize?: number
}

export const getUserPage = (params: UserPageParams): Promise<ApiResponse<PageResult<User>>> => {
  return get<PageResult<User>>('/user/page', { params })
}

export const getUserById = (id: number): Promise<ApiResponse<User>> => {
  return get<User>(`/user/${id}`)
}

export const addUser = (user: UserForm): Promise<ApiResponse<void>> => {
  return post<void>('/user', user)
}

export const updateUser = (user: UserForm): Promise<ApiResponse<void>> => {
  return put<void>('/user', user)
}

export const deleteUser = (id: number): Promise<ApiResponse<void>> => {
  return del<void>(`/user/${id}`)
}
