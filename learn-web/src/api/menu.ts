import { post, get, put, del, ApiResponse } from '@/utils/request'

/**
 * 菜单类型
 * 1 - 目录
 * 2 - 菜单
 * 3 - 按钮
 */
export type MenuType = 1 | 2 | 3

/**
 * 菜单状态
 * 0 - 禁用
 * 1 - 启用
 */
export type MenuStatus = 0 | 1

/**
 * 菜单信息
 */
export interface Menu {
  id: number
  parentId: number
  menuName: string
  path?: string
  component?: string
  icon?: string
  menuType: MenuType
  perms?: string
  sort: number
  status: MenuStatus
  createTime?: string
  updateTime?: string
  children?: Menu[]
}

/**
 * 菜单表单参数
 */
export interface MenuForm {
  id?: number
  parentId: number
  menuName: string
  path?: string
  component?: string
  icon?: string
  menuType: MenuType
  perms?: string
  sort: number
  status: MenuStatus
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
export interface MenuPageParams {
  menuName?: string
  pageNum?: number
  pageSize?: number
}

/**
 * 获取菜单树
 * @returns 菜单树列表
 */
export const getMenuTree = (): Promise<ApiResponse<Menu[]>> => {
  return get<Menu[]>('/menu/tree')
}

/**
 * 获取菜单列表
 * @returns 菜单列表
 */
export const getMenuList = (): Promise<ApiResponse<Menu[]>> => {
  return get<Menu[]>('/menu/list')
}

/**
 * 分页查询菜单列表
 * @param params 查询参数
 * @returns 分页结果
 */
export const getMenuPage = (params?: MenuPageParams): Promise<ApiResponse<PageResult<Menu>>> => {
  return get<PageResult<Menu>>('/menu/page', params)
}

/**
 * 根据ID获取菜单详情
 * @param id 菜单ID
 * @returns 菜单详情
 */
export const getMenuById = (id: number): Promise<ApiResponse<Menu>> => {
  return get<Menu>(`/menu/${id}`)
}

/**
 * 新增菜单
 * @param menu 菜单信息
 * @returns 新增结果
 */
export const addMenu = (menu: MenuForm): Promise<ApiResponse<void>> => {
  return post<void>('/menu', menu)
}

/**
 * 更新菜单
 * @param menu 菜单信息
 * @returns 更新结果
 */
export const updateMenu = (menu: MenuForm): Promise<ApiResponse<void>> => {
  return put<void>('/menu', menu)
}

/**
 * 删除菜单
 * @param id 菜单ID
 * @returns 删除结果
 */
export const deleteMenu = (id: number): Promise<ApiResponse<void>> => {
  return del<void>(`/menu/${id}`)
}
