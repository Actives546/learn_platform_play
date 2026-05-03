package com.learn.course.service;

import com.learn.common.entity.Chapter;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;

import java.util.List;

/**
 * 章节服务接口
 * 定义章节的增删改查等核心功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
public interface ChapterService {

    /**
     * 分页查询章节列表
     * 支持按课程ID筛选、按章节名称模糊查询
     * 按创建时间降序排列
     *
     * @param courseId   课程ID（可选）
     * @param chapterName 章节名称（可选，模糊查询）
     * @param pageNum    页码
     * @param pageSize   每页大小
     * @return 分页结果
     */
    Result<PageResult<Chapter>> getChapterPage(Long courseId, String chapterName, Integer pageNum, Integer pageSize);

    /**
     * 根据ID获取章节详情
     *
     * @param id 章节ID
     * @return 章节详情
     */
    Result<Chapter> getChapterById(Long id);

    /**
     * 根据课程ID获取章节列表
     * 按创建时间降序排列
     *
     * @param courseId 课程ID
     * @return 章节列表
     */
    Result<List<Chapter>> getChaptersByCourseId(Long courseId);

    /**
     * 新增章节
     *
     * @param chapter 章节信息
     * @return 新增结果
     */
    Result<Void> addChapter(Chapter chapter);

    /**
     * 更新章节
     *
     * @param chapter 章节信息
     * @return 更新结果
     */
    Result<Void> updateChapter(Chapter chapter);

    /**
     * 删除章节
     *
     * @param id 章节ID
     * @return 删除结果
     */
    Result<Void> deleteChapter(Long id);
}
