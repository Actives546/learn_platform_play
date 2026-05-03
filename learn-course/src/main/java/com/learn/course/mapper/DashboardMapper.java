package com.learn.course.mapper;

import org.apache.ibatis.annotations.Mapper;

/**
 * 首页统计数据访问层接口
 * 提供首页统计相关的数据库操作方法
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Mapper
public interface DashboardMapper {

    /**
     * 统计学生人数
     * 统计roleId=3的用户数量
     *
     * @return 学生人数
     */
    long countStudents();

    /**
     * 统计老师人数
     * 统计作为讲师创建过课程的用户数量（去重）
     *
     * @return 老师人数
     */
    long countTeachers();

    /**
     * 统计课程总数
     *
     * @return 课程总数
     */
    long countTotalCourses();

    /**
     * 统计已上架课程数量
     * status=1
     *
     * @return 已上架课程数量
     */
    long countPublishedCourses();

    /**
     * 统计草稿课程数量
     * status=0
     *
     * @return 草稿课程数量
     */
    long countDraftCourses();

    /**
     * 统计已下架课程数量
     * status=2
     *
     * @return 已下架课程数量
     */
    long countOfflineCourses();

    /**
     * 统计本月新增课程数
     *
     * @return 本月新增课程数
     */
    long countThisMonthNewCourses();

    /**
     * 统计已发布章节总数
     *
     * @return 已发布章节总数
     */
    long countPublishedChapters();
}
