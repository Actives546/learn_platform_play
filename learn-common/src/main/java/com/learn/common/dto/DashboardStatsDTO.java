package com.learn.common.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 首页统计数据传输对象
 * 用于封装首页数据统计看板所需的所有统计数据
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Data
public class DashboardStatsDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户统计信息
     */
    private UserStats userStats;

    /**
     * 课程统计信息
     */
    private CourseStats courseStats;

    /**
     * 章节统计信息
     */
    private ChapterStats chapterStats;

    /**
     * 用户统计内部类
     */
    @Data
    public static class UserStats implements Serializable {
        private static final long serialVersionUID = 1L;

        /**
         * 学生总人数
         * 统计roleId=3的用户数量
         */
        private Long studentCount;

        /**
         * 老师总人数
         * 统计作为讲师创建过课程的用户数量
         */
        private Long teacherCount;
    }

    /**
     * 课程统计内部类
     */
    @Data
    public static class CourseStats implements Serializable {
        private static final long serialVersionUID = 1L;

        /**
         * 课程总数
         */
        private Long totalCount;

        /**
         * 已上架课程数量
         * status=1
         */
        private Long publishedCount;

        /**
         * 草稿课程数量
         * status=0
         */
        private Long draftCount;

        /**
         * 已下架课程数量
         * status=2
         */
        private Long offlineCount;

        /**
         * 本月新增课程数
         * 统计本月创建的课程数量
         */
        private Long thisMonthNewCount;
    }

    /**
     * 章节统计内部类
     */
    @Data
    public static class ChapterStats implements Serializable {
        private static final long serialVersionUID = 1L;

        /**
         * 已发布章节总数
         * 统计所有未删除的章节数量
         */
        private Long publishedCount;
    }
}
