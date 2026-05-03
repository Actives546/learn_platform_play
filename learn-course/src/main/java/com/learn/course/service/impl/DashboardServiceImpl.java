package com.learn.course.service.impl;

import com.learn.common.dto.DashboardStatsDTO;
import com.learn.common.result.Result;
import com.learn.course.mapper.DashboardMapper;
import com.learn.course.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 首页统计服务实现类
 * 实现首页数据统计的核心功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final DashboardMapper dashboardMapper;

    /**
     * 获取首页统计数据
     * 包括用户统计、课程统计、章节统计等
     *
     * @return 首页统计数据
     */
    @Override
    public Result<DashboardStatsDTO> getDashboardStats() {
        log.info("获取首页统计数据");

        DashboardStatsDTO stats = new DashboardStatsDTO();

        DashboardStatsDTO.UserStats userStats = new DashboardStatsDTO.UserStats();
        userStats.setStudentCount(dashboardMapper.countStudents());
        userStats.setTeacherCount(dashboardMapper.countTeachers());
        stats.setUserStats(userStats);

        DashboardStatsDTO.CourseStats courseStats = new DashboardStatsDTO.CourseStats();
        courseStats.setTotalCount(dashboardMapper.countTotalCourses());
        courseStats.setPublishedCount(dashboardMapper.countPublishedCourses());
        courseStats.setDraftCount(dashboardMapper.countDraftCourses());
        courseStats.setOfflineCount(dashboardMapper.countOfflineCourses());
        courseStats.setThisMonthNewCount(dashboardMapper.countThisMonthNewCourses());
        stats.setCourseStats(courseStats);

        DashboardStatsDTO.ChapterStats chapterStats = new DashboardStatsDTO.ChapterStats();
        chapterStats.setPublishedCount(dashboardMapper.countPublishedChapters());
        stats.setChapterStats(chapterStats);

        log.info("首页统计数据获取完成: userStats={}, courseStats={}, chapterStats={}",
                userStats, courseStats, chapterStats);

        return Result.success("获取首页统计数据成功", stats);
    }
}
