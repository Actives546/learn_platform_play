package com.learn.course.mapper;

import com.learn.common.entity.Chapter;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 章节数据访问层接口
 * 提供章节相关的数据库操作方法
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Mapper
public interface ChapterMapper {

    /**
     * 根据ID查询章节
     *
     * @param id 章节ID
     * @return 章节实体对象
     */
    Chapter selectById(@Param("id") Long id);

    /**
     * 根据ID列表批量查询章节
     *
     * @param ids 章节ID列表
     * @return 章节列表
     */
    List<Chapter> selectByIds(@Param("ids") List<Long> ids);

    /**
     * 根据课程ID查询章节列表
     * 按创建时间降序排列
     *
     * @param courseId 课程ID
     * @return 章节列表
     */
    List<Chapter> selectByCourseId(@Param("courseId") Long courseId);

    /**
     * 根据课程ID和章节名称查询章节（用于校验重复）
     * 排除已删除的章节
     *
     * @param courseId    课程ID
     * @param chapterName 章节名称
     * @return 章节实体对象，如果不存在返回null
     */
    Chapter selectByCourseIdAndChapterName(@Param("courseId") Long courseId, @Param("chapterName") String chapterName);

    /**
     * 插入新章节
     *
     * @param chapter 章节实体对象
     * @return 受影响的行数
     */
    int insert(Chapter chapter);

    /**
     * 根据ID更新章节
     *
     * @param chapter 章节实体对象
     * @return 受影响的行数
     */
    int updateById(Chapter chapter);

    /**
     * 根据ID删除章节（逻辑删除）
     *
     * @param id 章节ID
     * @return 受影响的行数
     */
    int deleteById(@Param("id") Long id);

    /**
     * 分页查询章节列表
     * 支持按章节名称模糊查询、按课程ID筛选
     * 按创建时间降序排列
     *
     * @param courseId   课程ID（可选）
     * @param chapterName 章节名称（可选，模糊查询）
     * @param offset     偏移量
     * @param pageSize   每页大小
     * @return 章节列表
     */
    List<Chapter> selectPage(
            @Param("courseId") Long courseId,
            @Param("chapterName") String chapterName,
            @Param("offset") int offset,
            @Param("pageSize") int pageSize);

    /**
     * 查询章节总数
     * 支持按章节名称模糊查询、按课程ID筛选
     *
     * @param courseId   课程ID（可选）
     * @param chapterName 章节名称（可选，模糊查询）
     * @return 章节总数
     */
    long countTotal(
            @Param("courseId") Long courseId,
            @Param("chapterName") String chapterName);
}
