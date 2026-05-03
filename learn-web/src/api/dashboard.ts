import { get, ApiResponse } from '@/utils/request'

export interface UserStats {
  studentCount: number
  teacherCount: number
}

export interface CourseStats {
  totalCount: number
  publishedCount: number
  draftCount: number
  offlineCount: number
  thisMonthNewCount: number
}

export interface ChapterStats {
  publishedCount: number
}

export interface DashboardStatsDTO {
  userStats: UserStats
  courseStats: CourseStats
  chapterStats: ChapterStats
}

export const getDashboardStats = (): Promise<ApiResponse<DashboardStatsDTO>> => {
  return get<DashboardStatsDTO>('/dashboard/stats')
}
