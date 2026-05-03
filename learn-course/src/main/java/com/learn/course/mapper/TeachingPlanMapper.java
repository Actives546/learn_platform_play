package com.learn.course.mapper;

import com.learn.common.entity.TeachingPlan;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 教学计划数据访问层接口
 * 提供教学计划相关的数据库操作方法
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Mapper
public interface TeachingPlanMapper {

    /**
     * 根据ID查询教学计划
     *
     * @param id 教学计划ID
     * @return 教学计划实体对象
     */
    TeachingPlan selectById(@Param("id") Long id);

    /**
     * 根据ID列表批量查询教学计划
     *
     * @param ids 教学计划ID列表
     * @return 教学计划列表
     */
    List<TeachingPlan> selectByIds(@Param("ids") List<Long> ids);

    /**
     * 根据课程ID查询教学计划列表
     * 按创建时间降序排列
     *
     * @param courseId 课程ID
     * @return 教学计划列表
     */
    List<TeachingPlan> selectByCourseId(@Param("courseId") Long courseId);

    /**
     * 根据课程ID和计划名称查询教学计划（用于校验重复）
     * 排除已删除的教学计划
     *
     * @param courseId 课程ID
     * @param planName 计划名称
     * @return 教学计划实体对象，如果不存在返回null
     */
    TeachingPlan selectByCourseIdAndPlanName(@Param("courseId") Long courseId, @Param("planName") String planName);

    /**
     * 插入新教学计划
     *
     * @param teachingPlan 教学计划实体对象
     * @return 受影响的行数
     */
    int insert(TeachingPlan teachingPlan);

    /**
     * 根据ID更新教学计划
     *
     * @param teachingPlan 教学计划实体对象
     * @return 受影响的行数
     */
    int updateById(TeachingPlan teachingPlan);

    /**
     * 根据ID删除教学计划（逻辑删除）
     *
     * @param id 教学计划ID
     * @return 受影响的行数
     */
    int deleteById(@Param("id") Long id);

    /**
     * 分页查询教学计划列表
     * 支持按计划名称模糊查询、按课程ID筛选、按状态筛选
     * 按创建时间降序排列
     *
     * @param courseId 课程ID（可选）
     * @param planName 计划名称（可选，模糊查询）
     * @param status   状态（可选）
     * @param offset   偏移量
     * @param pageSize 每页大小
     * @return 教学计划列表
     */
    List<TeachingPlan> selectPage(
            @Param("courseId") Long courseId,
            @Param("planName") String planName,
            @Param("status") Integer status,
            @Param("offset") int offset,
            @Param("pageSize") int pageSize);

    /**
     * 查询教学计划总数
     * 支持按计划名称模糊查询、按课程ID筛选、按状态筛选
     *
     * @param courseId 课程ID（可选）
     * @param planName 计划名称（可选，模糊查询）
     * @param status   状态（可选）
     * @return 教学计划总数
     */
    long countTotal(
            @Param("courseId") Long courseId,
            @Param("planName") String planName,
            @Param("status") Integer status);
}
