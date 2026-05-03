package com.learn.course.service.impl;

import com.learn.common.entity.Course;
import com.learn.common.exception.BusinessException;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;
import com.learn.common.util.IdGenerator;
import com.learn.course.mapper.CourseMapper;
import com.learn.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 课程服务实现类
 * 实现课程的增删改查等核心功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseMapper courseMapper;

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
    @Override
    public Result<PageResult<Course>> getCoursePage(String courseName, Integer status, Integer pageNum, Integer pageSize) {
        log.info("分页查询课程列表: courseName={}, status={}, pageNum={}, pageSize={}", courseName, status, pageNum, pageSize);

        if (pageNum == null || pageNum <= 0) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize <= 0) {
            pageSize = 10;
        }

        int offset = (pageNum - 1) * pageSize;

        long total = courseMapper.countTotal(courseName, status);
        log.info("查询到课程总数: {}", total);

        List<Course> courses = courseMapper.selectPage(courseName, status, offset, pageSize);
        log.info("分页查询到课程数量: {}", courses.size());

        PageResult<Course> pageResult = PageResult.of(total, courses, pageNum, pageSize);

        return Result.success("分页查询课程列表成功", pageResult);
    }

    /**
     * 根据ID获取课程详情
     *
     * @param id 课程ID
     * @return 课程详情
     */
    @Override
    public Result<Course> getCourseById(Long id) {
        log.info("获取课程详情: id={}", id);

        Course course = courseMapper.selectById(id);
        if (course == null) {
            log.warn("课程不存在: id={}", id);
            throw BusinessException.of("课程不存在");
        }

        return Result.success("获取课程详情成功", course);
    }

    /**
     * 新增课程
     *
     * @param course 课程信息
     * @return 新增结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> addCourse(Course course) {
        log.info("新增课程: courseName={}", course.getCourseName());

        validateCourse(course);

        if (course.getStatus() == null) {
            course.setStatus(0);
        }
        if (course.getSort() == null) {
            course.setSort(0);
        }
        if (course.getLessonCount() == null) {
            course.setLessonCount(0);
        }

        course.setId(IdGenerator.nextId());
        course.setCreateTime(LocalDateTime.now());
        course.setUpdateTime(LocalDateTime.now());

        courseMapper.insert(course);
        log.info("新增课程成功: id={}, courseName={}", course.getId(), course.getCourseName());

        return Result.success("新增课程成功", null);
    }

    /**
     * 更新课程
     *
     * @param course 课程信息
     * @return 更新结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> updateCourse(Course course) {
        log.info("更新课程: id={}", course.getId());

        Course existCourse = courseMapper.selectById(course.getId());
        if (existCourse == null) {
            log.warn("课程不存在: id={}", course.getId());
            throw BusinessException.of("课程不存在");
        }

        course.setUpdateTime(LocalDateTime.now());

        courseMapper.updateById(course);
        log.info("更新课程成功: id={}", course.getId());

        return Result.success("更新课程成功", null);
    }

    /**
     * 删除课程
     *
     * @param id 课程ID
     * @return 删除结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> deleteCourse(Long id) {
        log.info("删除课程: id={}", id);

        Course course = courseMapper.selectById(id);
        if (course == null) {
            log.warn("课程不存在: id={}", id);
            throw BusinessException.of("课程不存在");
        }

        courseMapper.deleteById(id);
        log.info("删除课程成功: id={}, courseName={}", course.getId(), course.getCourseName());

        return Result.success("删除课程成功", null);
    }

    /**
     * 批量更新课程状态
     *
     * @param ids    课程ID列表
     * @param status 新状态
     * @return 更新结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> updateStatusBatch(List<Long> ids, Integer status) {
        log.info("批量更新课程状态: ids={}, status={}", ids, status);

        if (ids == null || ids.isEmpty()) {
            throw BusinessException.of("课程ID列表不能为空");
        }

        if (status == null) {
            throw BusinessException.of("状态不能为空");
        }

        if (status < 0 || status > 2) {
            throw BusinessException.of("状态值不合法，只能是0(草稿)、1(已上架)、2(已下架)");
        }

        courseMapper.updateStatusBatch(ids, status);
        log.info("批量更新课程状态成功，共更新 {} 条记录", ids.size());

        return Result.success("批量更新课程状态成功", null);
    }

    /**
     * 校验课程必填字段
     *
     * @param course 课程信息
     */
    private void validateCourse(Course course) {
        if (!StringUtils.hasText(course.getCourseName())) {
            throw BusinessException.of("课程名称不能为空");
        }
        if (course.getCourseName().length() > 200) {
            throw BusinessException.of("课程名称长度不能超过200个字符");
        }
    }
}
