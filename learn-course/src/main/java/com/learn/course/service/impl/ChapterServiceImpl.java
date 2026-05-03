package com.learn.course.service.impl;

import com.learn.common.entity.Chapter;
import com.learn.common.entity.Course;
import com.learn.common.exception.BusinessException;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;
import com.learn.common.util.IdGenerator;
import com.learn.course.mapper.ChapterMapper;
import com.learn.course.mapper.CourseMapper;
import com.learn.course.service.ChapterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 章节服务实现类
 * 实现章节的增删改查等核心功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChapterServiceImpl implements ChapterService {

    private final ChapterMapper chapterMapper;
    private final CourseMapper courseMapper;

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
    @Override
    public Result<PageResult<Chapter>> getChapterPage(Long courseId, String chapterName, Integer pageNum, Integer pageSize) {
        log.info("分页查询章节列表: courseId={}, chapterName={}, pageNum={}, pageSize={}", courseId, chapterName, pageNum, pageSize);

        if (pageNum == null || pageNum <= 0) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize <= 0) {
            pageSize = 10;
        }

        int offset = (pageNum - 1) * pageSize;

        long total = chapterMapper.countTotal(courseId, chapterName);
        log.info("查询到章节总数: {}", total);

        List<Chapter> chapters = chapterMapper.selectPage(courseId, chapterName, offset, pageSize);
        log.info("分页查询到章节数量: {}", chapters.size());

        PageResult<Chapter> pageResult = PageResult.of(total, chapters, pageNum, pageSize);

        return Result.success("分页查询章节列表成功", pageResult);
    }

    /**
     * 根据ID获取章节详情
     *
     * @param id 章节ID
     * @return 章节详情
     */
    @Override
    public Result<Chapter> getChapterById(Long id) {
        log.info("获取章节详情: id={}", id);

        if (id == null) {
            throw BusinessException.of("章节ID不能为空");
        }

        Chapter chapter = chapterMapper.selectById(id);
        if (chapter == null) {
            log.warn("章节不存在: id={}", id);
            throw BusinessException.of("章节不存在");
        }

        return Result.success("获取章节详情成功", chapter);
    }

    /**
     * 根据课程ID获取章节列表
     * 按创建时间降序排列
     *
     * @param courseId 课程ID
     * @return 章节列表
     */
    @Override
    public Result<List<Chapter>> getChaptersByCourseId(Long courseId) {
        log.info("根据课程ID获取章节列表: courseId={}", courseId);

        if (courseId == null) {
            throw BusinessException.of("课程ID不能为空");
        }

        Course course = courseMapper.selectById(courseId);
        if (course == null) {
            log.warn("课程不存在: courseId={}", courseId);
            throw BusinessException.of("课程不存在");
        }

        List<Chapter> chapters = chapterMapper.selectByCourseId(courseId);
        log.info("查询到章节数量: {}", chapters.size());

        return Result.success("获取章节列表成功", chapters);
    }

    /**
     * 新增章节
     *
     * @param chapter 章节信息
     * @return 新增结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> addChapter(Chapter chapter) {
        log.info("新增章节: chapterName={}, courseId={}", chapter.getChapterName(), chapter.getCourseId());

        validateChapter(chapter);

        if (chapter.getSort() == null) {
            chapter.setSort(0);
        }

        chapter.setId(IdGenerator.nextId());
        chapter.setCreateTime(LocalDateTime.now());
        chapter.setUpdateTime(LocalDateTime.now());

        chapterMapper.insert(chapter);
        log.info("新增章节成功: id={}, chapterName={}", chapter.getId(), chapter.getChapterName());

        return Result.success("新增章节成功", null);
    }

    /**
     * 更新章节
     *
     * @param chapter 章节信息
     * @return 更新结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> updateChapter(Chapter chapter) {
        log.info("更新章节: id={}", chapter.getId());

        if (chapter.getId() == null) {
            throw BusinessException.of("章节ID不能为空");
        }

        Chapter existChapter = chapterMapper.selectById(chapter.getId());
        if (existChapter == null) {
            log.warn("章节不存在: id={}", chapter.getId());
            throw BusinessException.of("章节不存在");
        }

        if (chapter.getCourseId() != null) {
            Course course = courseMapper.selectById(chapter.getCourseId());
            if (course == null) {
                log.warn("课程不存在: courseId={}", chapter.getCourseId());
                throw BusinessException.of("课程不存在");
            }
        }

        chapter.setUpdateTime(LocalDateTime.now());

        chapterMapper.updateById(chapter);
        log.info("更新章节成功: id={}", chapter.getId());

        return Result.success("更新章节成功", null);
    }

    /**
     * 删除章节
     *
     * @param id 章节ID
     * @return 删除结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> deleteChapter(Long id) {
        log.info("删除章节: id={}", id);

        if (id == null) {
            throw BusinessException.of("章节ID不能为空");
        }

        Chapter chapter = chapterMapper.selectById(id);
        if (chapter == null) {
            log.warn("章节不存在: id={}", id);
            throw BusinessException.of("章节不存在");
        }

        chapterMapper.deleteById(id);
        log.info("删除章节成功: id={}, chapterName={}", chapter.getId(), chapter.getChapterName());

        return Result.success("删除章节成功", null);
    }

    /**
     * 校验章节必填字段
     *
     * @param chapter 章节信息
     */
    private void validateChapter(Chapter chapter) {
        if (chapter.getCourseId() == null) {
            throw BusinessException.of("课程ID不能为空");
        }

        Course course = courseMapper.selectById(chapter.getCourseId());
        if (course == null) {
            log.warn("课程不存在: courseId={}", chapter.getCourseId());
            throw BusinessException.of("课程不存在");
        }

        if (!StringUtils.hasText(chapter.getChapterName())) {
            throw BusinessException.of("章节名称不能为空");
        }
        if (chapter.getChapterName().length() > 200) {
            throw BusinessException.of("章节名称长度不能超过200个字符");
        }

        Chapter existChapter = chapterMapper.selectByCourseIdAndChapterName(
                chapter.getCourseId(), chapter.getChapterName());
        if (existChapter != null) {
            log.warn("同一课程下章节名称已存在: courseId={}, chapterName={}",
                    chapter.getCourseId(), chapter.getChapterName());
            throw BusinessException.of("同一课程下章节名称不能重复");
        }
    }
}
