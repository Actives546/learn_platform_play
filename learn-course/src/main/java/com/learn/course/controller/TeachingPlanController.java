package com.learn.course.controller;

import com.learn.common.entity.TeachingPlan;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;
import com.learn.course.service.TeachingPlanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 教学计划控制器
 * 提供教学计划的增删改查等接口
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/teaching-plan")
@RequiredArgsConstructor
public class TeachingPlanController {

    private final TeachingPlanService teachingPlanService;

    /**
     * 分页查询教学计划列表接口
     * 支持按课程ID筛选、按计划名称模糊查询、按状态筛选
     * 按创建时间降序排列
     *
     * @param courseId 课程ID（可选）
     * @param planName 计划名称（可选，模糊查询）
     * @param status   状态（可选）
     * @param pageNum  页码（可选，默认1）
     * @param pageSize 每页大小（可选，默认10）
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<PageResult<TeachingPlan>> getTeachingPlanPage(
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) String planName,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false, defaultValue = "1") Integer pageNum,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        log.info("收到分页查询教学计划列表请求: courseId={}, planName={}, status={}, pageNum={}, pageSize={}", courseId, planName, status, pageNum, pageSize);
        return teachingPlanService.getTeachingPlanPage(courseId, planName, status, pageNum, pageSize);
    }

    /**
     * 根据ID获取教学计划详情接口
     *
     * @param id 教学计划ID
     * @return 教学计划详情
     */
    @GetMapping("/{id}")
    public Result<TeachingPlan> getTeachingPlanById(@PathVariable Long id) {
        log.info("收到获取教学计划详情请求: id={}", id);
        return teachingPlanService.getTeachingPlanById(id);
    }

    /**
     * 根据课程ID获取教学计划列表接口
     * 按创建时间降序排列
     *
     * @param courseId 课程ID
     * @return 教学计划列表
     */
    @GetMapping("/course/{courseId}")
    public Result<List<TeachingPlan>> getTeachingPlansByCourseId(@PathVariable Long courseId) {
        log.info("收到根据课程ID获取教学计划列表请求: courseId={}", courseId);
        return teachingPlanService.getTeachingPlansByCourseId(courseId);
    }

    /**
     * 新增教学计划接口
     *
     * @param teachingPlan 教学计划信息
     * @return 新增结果
     */
    @PostMapping
    public Result<Void> addTeachingPlan(@RequestBody TeachingPlan teachingPlan) {
        log.info("收到新增教学计划请求: planName={}, courseId={}", teachingPlan.getPlanName(), teachingPlan.getCourseId());
        return teachingPlanService.addTeachingPlan(teachingPlan);
    }

    /**
     * 更新教学计划接口
     *
     * @param teachingPlan 教学计划信息
     * @return 更新结果
     */
    @PutMapping
    public Result<Void> updateTeachingPlan(@RequestBody TeachingPlan teachingPlan) {
        log.info("收到更新教学计划请求: id={}", teachingPlan.getId());
        return teachingPlanService.updateTeachingPlan(teachingPlan);
    }

    /**
     * 删除教学计划接口
     *
     * @param id 教学计划ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteTeachingPlan(@PathVariable Long id) {
        log.info("收到删除教学计划请求: id={}", id);
        return teachingPlanService.deleteTeachingPlan(id);
    }
}
