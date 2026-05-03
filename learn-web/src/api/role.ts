import { post, get, put, del, ApiResponse } from '@/utils/request'

/**
 * 角色状态
 * 0 - 禁用
 * 1 - 启用
 */
export type RoleStatus = 0 | 1

/**
 * 角色信息
 */
export interface Role {
  id: number
  roleName: string
  roleCode: string
  description?: string
  status: RoleStatus
  createTime?: string
  updateTime?: string
  menuIds?: number[]
}

/**
 * 角色表单参数
 */
export interface RoleForm {
  id?: number
  roleName: string
  roleCode: string
  description?: string
  status: RoleStatus
}

/**
 * 分页结果
 */
export interface PageResult<T> {
  total: number
  records: T[]
  pageNum: number
  pageSize: number
  pages: number
}

/**
 * 分页查询参数
 */
export interface RolePageParams {
  roleName?: string
  pageNum?: number
  pageSize?: number
}

/**
 * 获取角色列表
 * @param roleName 角色名称（可选，模糊查询）
 * @returns 角色列表
 */
export const getRoleList = (roleName?: string): Promise<ApiResponse<Role[]>> => {
  const params = roleName ? { roleName } : undefined
  return get<Role[]>('/role/list', { params })
}

/**
 * 分页查询角色列表
 * @param params 查询参数
 * @returns 分页结果
 */
export const getRolePage = (params?: RolePageParams): Promise<ApiResponse<PageResult<Role>>> => {
  return get<PageResult<Role>>('/role/page', { params })
}

/**
 * 根据ID获取角色详情
 * @param id 角色ID
 * @returns 角色详情
 */
export const getRoleById = (id: number): Promise<ApiResponse<Role>> => {
  return get<Role>(`/role/${id}`)
}

/**
 * 新增角色
 * @param role 角色信息
 * @returns 新增结果
 */
export const addRole = (role: RoleForm): Promise<ApiResponse<void>> => {
  return post<void>('/role', role)
}

/**
 * 更新角色
 * @param role 角色信息
 * @returns 更新结果
 */
export const updateRole = (role: RoleForm): Promise<ApiResponse<void>> => {
  return put<void>('/role', role)
}

/**
 * 删除角色
 * @param id 角色ID
 * @returns 删除结果
 */
export const deleteRole = (id: number): Promise<ApiResponse<void>> => {
  return del<void>(`/role/${id}`)
}

/**
 * 获取角色的菜单ID列表
 * @param roleId 角色ID
 * @returns 菜单ID列表
 */
export const getRoleMenuIds = (roleId: number): Promise<ApiResponse<number[]>> => {
  return get<number[]>(`/role/menuIds/${roleId}`)
}

/**
 * 为角色授权菜单
 * @param roleId 角色ID
 * @param menuIds 菜单ID列表
 * @returns 授权结果
 */
export const grantMenus = (roleId: number, menuIds: number[]): Promise<ApiResponse<void>> => {
  return post<void>('/role/grantMenus', { roleId, menuIds })
}
