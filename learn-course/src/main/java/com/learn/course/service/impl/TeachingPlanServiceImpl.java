package com.learn.course.service.impl;

import com.learn.common.entity.Course;
import com.learn.common.entity.TeachingPlan;
import com.learn.common.exception.BusinessException;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;
import com.learn.common.util.IdGenerator;
import com.learn.course.mapper.CourseMapper;
import com.learn.course.mapper.TeachingPlanMapper;
import com.learn.course.service.TeachingPlanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 教学计划服务实现类
 * 实现教学计划的增删改查等核心功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TeachingPlanServiceImpl implements TeachingPlanService {

    private final TeachingPlanMapper teachingPlanMapper;
    private final CourseMapper courseMapper;

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
    @Override
    public Result<PageResult<TeachingPlan>> getTeachingPlanPage(Long courseId, String planName, Integer status, Integer pageNum, Integer pageSize) {
        log.info("分页查询教学计划列表: courseId={}, planName={}, status={}, pageNum={}, pageSize={}", courseId, planName, status, pageNum, pageSize);

        if (pageNum == null || pageNum <= 0) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize <= 0) {
            pageSize = 10;
        }

        int offset = (pageNum - 1) * pageSize;

        long total = teachingPlanMapper.countTotal(courseId, planName, status);
        log.info("查询到教学计划总数: {}", total);

        List<TeachingPlan> teachingPlans = teachingPlanMapper.selectPage(courseId, planName, status, offset, pageSize);
        log.info("分页查询到教学计划数量: {}", teachingPlans.size());

        PageResult<TeachingPlan> pageResult = PageResult.of(total, teachingPlans, pageNum, pageSize);

        return Result.success("分页查询教学计划列表成功", pageResult);
    }

    /**
     * 根据ID获取教学计划详情
     *
     * @param id 教学计划ID
     * @return 教学计划详情
     */
    @Override
    public Result<TeachingPlan> getTeachingPlanById(Long id) {
        log.info("获取教学计划详情: id={}", id);

        if (id == null) {
            throw BusinessException.of("教学计划ID不能为空");
        }

        TeachingPlan teachingPlan = teachingPlanMapper.selectById(id);
        if (teachingPlan == null) {
            log.warn("教学计划不存在: id={}", id);
            throw BusinessException.of("教学计划不存在");
        }

        return Result.success("获取教学计划详情成功", teachingPlan);
    }

    /**
     * 根据课程ID获取教学计划列表
     * 按创建时间降序排列
     *
     * @param courseId 课程ID
     * @return 教学计划列表
     */
    @Override
    public Result<List<TeachingPlan>> getTeachingPlansByCourseId(Long courseId) {
        log.info("根据课程ID获取教学计划列表: courseId={}", courseId);

        if (courseId == null) {
            throw BusinessException.of("课程ID不能为空");
        }

        Course course = courseMapper.selectById(courseId);
        if (course == null) {
            log.warn("课程不存在: courseId={}", courseId);
            throw BusinessException.of("课程不存在");
        }

        List<TeachingPlan> teachingPlans = teachingPlanMapper.selectByCourseId(courseId);
        log.info("查询到教学计划数量: {}", teachingPlans.size());

        return Result.success("获取教学计划列表成功", teachingPlans);
    }

    /**
     * 新增教学计划
     *
     * @param teachingPlan 教学计划信息
     * @return 新增结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> addTeachingPlan(TeachingPlan teachingPlan) {
        log.info("新增教学计划: planName={}, courseId={}", teachingPlan.getPlanName(), teachingPlan.getCourseId());

        validateTeachingPlan(teachingPlan);

        if (teachingPlan.getProgress() == null) {
            teachingPlan.setProgress(0);
        }
        if (teachingPlan.getStatus() == null) {
            teachingPlan.setStatus(0);
        }

        teachingPlan.setId(IdGenerator.nextId());
        teachingPlan.setCreateTime(LocalDateTime.now());
        teachingPlan.setUpdateTime(LocalDateTime.now());

        teachingPlanMapper.insert(teachingPlan);
        log.info("新增教学计划成功: id={}, planName={}", teachingPlan.getId(), teachingPlan.getPlanName());

        return Result.success("新增教学计划成功", null);
    }

    /**
     * 更新教学计划
     *
     * @param teachingPlan 教学计划信息
     * @return 更新结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> updateTeachingPlan(TeachingPlan teachingPlan) {
        log.info("更新教学计划: id={}", teachingPlan.getId());

        if (teachingPlan.getId() == null) {
            throw BusinessException.of("教学计划ID不能为空");
        }

        TeachingPlan existTeachingPlan = teachingPlanMapper.selectById(teachingPlan.getId());
        if (existTeachingPlan == null) {
            log.warn("教学计划不存在: id={}", teachingPlan.getId());
            throw BusinessException.of("教学计划不存在");
        }

        if (teachingPlan.getCourseId() != null) {
            Course course = courseMapper.selectById(teachingPlan.getCourseId());
            if (course == null) {
                log.warn("课程不存在: courseId={}", teachingPlan.getCourseId());
                throw BusinessException.of("课程不存在");
            }
        }

        teachingPlan.setUpdateTime(LocalDateTime.now());

        teachingPlanMapper.updateById(teachingPlan);
        log.info("更新教学计划成功: id={}", teachingPlan.getId());

        return Result.success("更新教学计划成功", null);
    }

    /**
     * 删除教学计划
     *
     * @param id 教学计划ID
     * @return 删除结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> deleteTeachingPlan(Long id) {
        log.info("删除教学计划: id={}", id);

        if (id == null) {
            throw BusinessException.of("教学计划ID不能为空");
        }

        TeachingPlan teachingPlan = teachingPlanMapper.selectById(id);
        if (teachingPlan == null) {
            log.warn("教学计划不存在: id={}", id);
            throw BusinessException.of("教学计划不存在");
        }

        teachingPlanMapper.deleteById(id);
        log.info("删除教学计划成功: id={}, planName={}", teachingPlan.getId(), teachingPlan.getPlanName());

        return Result.success("删除教学计划成功", null);
    }

    /**
     * 校验教学计划必填字段
     *
     * @param teachingPlan 教学计划信息
     */
    private void validateTeachingPlan(TeachingPlan teachingPlan) {
        if (teachingPlan.getCourseId() == null) {
            throw BusinessException.of("课程ID不能为空");
        }

        Course course = courseMapper.selectById(teachingPlan.getCourseId());
        if (course == null) {
            log.warn("课程不存在: courseId={}", teachingPlan.getCourseId());
            throw BusinessException.of("课程不存在");
        }

        if (!StringUtils.hasText(teachingPlan.getPlanName())) {
            throw BusinessException.of("计划名称不能为空");
        }
        if (teachingPlan.getPlanName().length() > 200) {
            throw BusinessException.of("计划名称长度不能超过200个字符");
        }

        if (teachingPlan.getProgress() != null) {
            if (teachingPlan.getProgress() < 0 || teachingPlan.getProgress() > 100) {
                throw BusinessException.of("教学进度必须在0-100之间");
            }
        }

        if (teachingPlan.getStatus() != null) {
            if (teachingPlan.getStatus() < 0 || teachingPlan.getStatus() > 3) {
                throw BusinessException.of("状态值无效，有效值为0-3");
            }
        }

        TeachingPlan existTeachingPlan = teachingPlanMapper.selectByCourseIdAndPlanName(
                teachingPlan.getCourseId(), teachingPlan.getPlanName());
        if (existTeachingPlan != null) {
            log.warn("同一课程下计划名称已存在: courseId={}, planName={}",
                    teachingPlan.getCourseId(), teachingPlan.getPlanName());
            throw BusinessException.of("同一课程下计划名称不能重复");
        }
    }
}
