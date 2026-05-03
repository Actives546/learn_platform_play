package com.learn.course.service;

import com.learn.common.entity.Course;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;

import java.util.List;

/**
 * 课程服务接口
 * 定义课程的增删改查等核心功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
public interface CourseService {

    /**
     * 分页查询课程列表
     * 支持按课程名称模糊查询、按状态筛选
     *
     * @param courseName 课程名称（模糊查询）
     * @param status     状态
     * @param pageNum    页码
     * @param pageSize   每页大小
     * @return 分页结果
     */
    Result<PageResult<Course>> getCoursePage(String courseName, Integer status, Integer pageNum, Integer pageSize);

    /**
     * 根据ID获取课程详情
     *
     * @param id 课程ID
     * @return 课程详情
     */
    Result<Course> getCourseById(Long id);

    /**
     * 新增课程
     *
     * @param course 课程信息
     * @return 新增结果
     */
    Result<Void> addCourse(Course course);

    /**
     * 更新课程
     *
     * @param course 课程信息
     * @return 更新结果
     */
    Result<Void> updateCourse(Course course);

    /**
     * 删除课程
     *
     * @param id 课程ID
     * @return 删除结果
     */
    Result<Void> deleteCourse(Long id);

    /**
     * 批量更新课程状态
     *
     * @param ids    课程ID列表
     * @param status 新状态
     * @return 更新结果
     */
    Result<Void> updateStatusBatch(List<Long> ids, Integer status);
}
