package com.learn.course.service;

import com.learn.common.entity.TeachingPlan;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;

import java.util.List;

/**
 * 教学计划服务接口
 * 提供教学计划的增删改查等核心功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
public interface TeachingPlanService {

    /**
     * 分页查询教学计划列表
     * 支持按课程ID筛选、按计划名称模糊查询、按状态筛选
     * 按创建时间降序排列
     *
     * @param courseId 课程ID（可选）
     * @param planName 计划名称（可选，模糊查询）
     * @param status   状态（可选）
     * @param pageNum  页码
     * @param pageSize 每页大小
     * @return 分页结果
     */
    Result<PageResult<TeachingPlan>> getTeachingPlanPage(Long courseId, String planName, Integer status, Integer pageNum, Integer pageSize);

    /**
     * 根据ID获取教学计划详情
     *
     * @param id 教学计划ID
     * @return 教学计划详情
     */
    Result<TeachingPlan> getTeachingPlanById(Long id);

    /**
     * 根据课程ID获取教学计划列表
     * 按创建时间降序排列
     *
     * @param courseId 课程ID
     * @return 教学计划列表
     */
    Result<List<TeachingPlan>> getTeachingPlansByCourseId(Long courseId);

    /**
     * 新增教学计划
     *
     * @param teachingPlan 教学计划信息
     * @return 新增结果
     */
    Result<Void> addTeachingPlan(TeachingPlan teachingPlan);

    /**
     * 更新教学计划
     *
     * @param teachingPlan 教学计划信息
     * @return 更新结果
     */
    Result<Void> updateTeachingPlan(TeachingPlan teachingPlan);

    /**
     * 删除教学计划
     *
     * @param id 教学计划ID
     * @return 删除结果
     */
    Result<Void> deleteTeachingPlan(Long id);
}
