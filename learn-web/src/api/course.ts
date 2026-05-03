import { post, get, put, del, ApiResponse } from '@/utils/request'

export type CourseStatus = 0 | 1 | 2

export interface Course {
  id: string
  courseName: string
  cover?: string
  description?: string
  teacherId?: string
  lessonCount?: number
  status: CourseStatus
  sort?: number
  createTime?: string
  updateTime?: string
  isDeleted?: number
}

export interface CourseForm {
  id?: string
  courseName: string
  cover?: string
  description?: string
  teacherId?: string
  lessonCount?: number
  status?: CourseStatus
  sort?: number
}

export interface Chapter {
  id: string
  courseId: string
  chapterName: string
  description?: string
  sort?: number
  createTime?: string
  updateTime?: string
  isDeleted?: number
}

export interface ChapterForm {
  id?: string
  courseId: string
  chapterName: string
  description?: string
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

export interface ChapterPageParams {
  courseId?: string
  chapterName?: string
  pageNum?: number
  pageSize?: number
}

export const getCoursePage = (params: CoursePageParams): Promise<ApiResponse<PageResult<Course>>> => {
  return get<PageResult<Course>>('/course/page', { params })
}

export const getCourseById = (id: string): Promise<ApiResponse<Course>> => {
  return get<Course>(`/course/${id}`)
}

export const addCourse = (course: CourseForm): Promise<ApiResponse<void>> => {
  return post<void>('/course', course)
}

export const updateCourse = (course: CourseForm): Promise<ApiResponse<void>> => {
  return put<void>('/course', course)
}

export const deleteCourse = (id: string): Promise<ApiResponse<void>> => {
  return del<void>(`/course/${id}`)
}

export const updateStatusBatch = (ids: string[], status: number): Promise<ApiResponse<void>> => {
  return put<void>(`/course/status/batch?ids=${ids.join(',')}&status=${status}`)
}

export const getChapterPage = (params: ChapterPageParams): Promise<ApiResponse<PageResult<Chapter>>> => {
  return get<PageResult<Chapter>>('/chapter/page', { params })
}

export const getChapterById = (id: string): Promise<ApiResponse<Chapter>> => {
  return get<Chapter>(`/chapter/${id}`)
}

export const getChaptersByCourseId = (courseId: string): Promise<ApiResponse<Chapter[]>> => {
  return get<Chapter[]>(`/chapter/course/${courseId}`)
}

export const addChapter = (chapter: ChapterForm): Promise<ApiResponse<void>> => {
  return post<void>('/chapter', chapter)
}

export const updateChapter = (chapter: ChapterForm): Promise<ApiResponse<void>> => {
  return put<void>('/chapter', chapter)
}

export const deleteChapter = (id: string): Promise<ApiResponse<void>> => {
  return del<void>(`/chapter/${id}`)
}

export type TeachingPlanStatus = 0 | 1 | 2 | 3

export interface TeachingPlan {
  id: string
  courseId: string
  planName: string
  description?: string
  startTime?: string
  endTime?: string
  weeklySchedule?: string
  progress?: number
  status: TeachingPlanStatus
  createTime?: string
  updateTime?: string
  isDeleted?: number
}

export interface TeachingPlanForm {
  id?: string
  courseId: string
  planName: string
  description?: string
  startTime?: string
  endTime?: string
  weeklySchedule?: string
  progress?: number
  status?: TeachingPlanStatus
}

export interface TeachingPlanPageParams {
  courseId?: string
  planName?: string
  status?: number
  pageNum?: number
  pageSize?: number
}

export const getTeachingPlanPage = (params: TeachingPlanPageParams): Promise<ApiResponse<PageResult<TeachingPlan>>> => {
  return get<PageResult<TeachingPlan>>('/teaching-plan/page', { params })
}

export const getTeachingPlanById = (id: string): Promise<ApiResponse<TeachingPlan>> => {
  return get<TeachingPlan>(`/teaching-plan/${id}`)
}

export const getTeachingPlansByCourseId = (courseId: string): Promise<ApiResponse<TeachingPlan[]>> => {
  return get<TeachingPlan[]>(`/teaching-plan/course/${courseId}`)
}

export const addTeachingPlan = (teachingPlan: TeachingPlanForm): Promise<ApiResponse<void>> => {
  return post<void>('/teaching-plan', teachingPlan)
}

export const updateTeachingPlan = (teachingPlan: TeachingPlanForm): Promise<ApiResponse<void>> => {
  return put<void>('/teaching-plan', teachingPlan)
}

export const deleteTeachingPlan = (id: string): Promise<ApiResponse<void>> => {
  return del<void>(`/teaching-plan/${id}`)
}
