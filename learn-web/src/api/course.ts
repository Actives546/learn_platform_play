import { post, get, put, del, ApiResponse } from '@/utils/request'

export type CourseStatus = 0 | 1 | 2

export interface Course {
  id: number
  courseName: string
  cover?: string
  description?: string
  teacherId?: number
  lessonCount?: number
  status: CourseStatus
  sort?: number
  createTime?: string
  updateTime?: string
  isDeleted?: number
}

export interface CourseForm {
  id?: number
  courseName: string
  cover?: string
  description?: string
  teacherId?: number
  lessonCount?: number
  status?: CourseStatus
  sort?: number
}

export interface PageResult<T> {
  total: number
  records: T[]
  pageNum: number
  pageSize: number
  pages: number
}

export interface CoursePageParams {
  courseName?: string
  status?: number
  pageNum?: number
  pageSize?: number
}

export const getCoursePage = (params: CoursePageParams): Promise<ApiResponse<PageResult<Course>>> => {
  return get<PageResult<Course>>('/course/page', { params })
}

export const getCourseById = (id: number): Promise<ApiResponse<Course>> => {
  return get<Course>(`/course/${id}`)
}

export const addCourse = (course: CourseForm): Promise<ApiResponse<void>> => {
  return post<void>('/course', course)
}

export const updateCourse = (course: CourseForm): Promise<ApiResponse<void>> => {
  return put<void>('/course', course)
}

export const deleteCourse = (id: number): Promise<ApiResponse<void>> => {
  return del<void>(`/course/${id}`)
}

export const updateStatusBatch = (ids: number[], status: number): Promise<ApiResponse<void>> => {
  return put<void>(`/course/status/batch?ids=${ids.join(',')}&status=${status}`)
}
