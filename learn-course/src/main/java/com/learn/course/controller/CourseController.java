package com.learn.course.controller;

import com.learn.common.entity.Course;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;
import com.learn.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 课程控制器
 * 提供课程的增删改查等接口
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/course")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    /**
     * 分页查询课程列表接口
     * 支持按课程名称模糊查询、按状态筛选
     *
     * @param courseName 课程名称（可选，模糊查询）
     * @param status     状态（可选）
     * @param pageNum    页码（可选，默认1）
     * @param pageSize   每页大小（可选，默认10）
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<PageResult<Course>> getCoursePage(
            @RequestParam(required = false) String courseName,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false, defaultValue = "1") Integer pageNum,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        log.info("收到分页查询课程列表请求: courseName={}, status={}, pageNum={}, pageSize={}", courseName, status, pageNum, pageSize);
        return courseService.getCoursePage(courseName, status, pageNum, pageSize);
    }

    /**
     * 根据ID获取课程详情接口
     *
     * @param id 课程ID
     * @return 课程详情
     */
    @GetMapping("/{id}")
    public Result<Course> getCourseById(@PathVariable Long id) {
        log.info("收到获取课程详情请求: id={}", id);
        return courseService.getCourseById(id);
    }

    /**
     * 新增课程接口
     *
     * @param course 课程信息
     * @return 新增结果
     */
    @PostMapping
    public Result<Void> addCourse(@RequestBody Course course) {
        log.info("收到新增课程请求: courseName={}", course.getCourseName());
        return courseService.addCourse(course);
    }

    /**
     * 更新课程接口
     *
     * @param course 课程信息
     * @return 更新结果
     */
    @PutMapping
    public Result<Void> updateCourse(@RequestBody Course course) {
        log.info("收到更新课程请求: id={}", course.getId());
        return courseService.updateCourse(course);
    }

    /**
     * 删除课程接口
     *
     * @param id 课程ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteCourse(@PathVariable Long id) {
        log.info("收到删除课程请求: id={}", id);
        return courseService.deleteCourse(id);
    }

    /**
     * 批量更新课程状态接口
     *
     * @param ids    课程ID列表
     * @param status 新状态
     * @return 更新结果
     */
    @PutMapping("/status/batch")
    public Result<Void> updateStatusBatch(
            @RequestParam List<Long> ids,
            @RequestParam Integer status) {
        log.info("收到批量更新课程状态请求: ids={}, status={}", ids, status);
        return courseService.updateStatusBatch(ids, status);
    }
}
