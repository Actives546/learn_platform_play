package com.learn.course.mapper;

import com.learn.common.entity.Course;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 课程数据访问层接口
 * 提供课程相关的数据库操作方法
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Mapper
public interface CourseMapper {

    /**
     * 根据ID查询课程
     *
     * @param id 课程ID
     * @return 课程实体对象
     */
    Course selectById(@Param("id") Long id);

    /**
     * 根据ID列表批量查询课程
     *
     * @param ids 课程ID列表
     * @return 课程列表
     */
    List<Course> selectByIds(@Param("ids") List<Long> ids);

    /**
     * 插入新课程
     *
     * @param course 课程实体对象
     * @return 受影响的行数
     */
    int insert(Course course);

    /**
     * 根据ID更新课程
     *
     * @param course 课程实体对象
     * @return 受影响的行数
     */
    int updateById(Course course);

    /**
     * 根据ID删除课程
     *
     * @param id 课程ID
     * @return 受影响的行数
     */
    int deleteById(@Param("id") Long id);

    /**
     * 分页查询课程列表
     * 支持按课程名称模糊查询、按状态筛选
     *
     * @param courseName 课程名称（模糊查询）
     * @param status     状态
     * @param offset     偏移量
     * @param pageSize   每页大小
     * @return 课程列表
     */
    List<Course> selectPage(
            @Param("courseName") String courseName,
            @Param("status") Integer status,
            @Param("offset") int offset,
            @Param("pageSize") int pageSize);

    /**
     * 查询课程总数
     * 支持按课程名称模糊查询、按状态筛选
     *
     * @param courseName 课程名称（模糊查询）
     * @param status     状态
     * @return 课程总数
     */
    long countTotal(
            @Param("courseName") String courseName,
            @Param("status") Integer status);

    /**
     * 批量更新课程状态
     *
     * @param ids    课程ID列表
     * @param status 新状态
     * @return 受影响的行数
     */
    int updateStatusBatch(@Param("ids") List<Long> ids, @Param("status") Integer status);

    /**
     * 统计老师人数
     * 统计作为讲师创建过课程的用户数量（去重）
     *
     * @return 老师人数
     */
    long countTeachers();

    /**
     * 统计本月新增课程数
     *
     * @return 本月新增课程数
     */
    long countThisMonthNewCourses();

    /**
     * 按状态统计课程数量
     *
     * @param status 课程状态
     * @return 该状态的课程数量
     */
    long countByStatus(@Param("status") Integer status);
}
