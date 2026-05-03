package com.learn.course.controller;

import com.learn.common.entity.Chapter;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;
import com.learn.course.service.ChapterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 章节控制器
 * 提供章节的增删改查等接口
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/chapter")
@RequiredArgsConstructor
public class ChapterController {

    private final ChapterService chapterService;

    /**
     * 分页查询章节列表接口
     * 支持按课程ID筛选、按章节名称模糊查询
     * 按创建时间降序排列
     *
     * @param courseId   课程ID（可选）
     * @param chapterName 章节名称（可选，模糊查询）
     * @param pageNum    页码（可选，默认1）
     * @param pageSize   每页大小（可选，默认10）
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<PageResult<Chapter>> getChapterPage(
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) String chapterName,
            @RequestParam(required = false, defaultValue = "1") Integer pageNum,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        log.info("收到分页查询章节列表请求: courseId={}, chapterName={}, pageNum={}, pageSize={}", courseId, chapterName, pageNum, pageSize);
        return chapterService.getChapterPage(courseId, chapterName, pageNum, pageSize);
    }

    /**
     * 根据ID获取章节详情接口
     *
     * @param id 章节ID
     * @return 章节详情
     */
    @GetMapping("/{id}")
    public Result<Chapter> getChapterById(@PathVariable Long id) {
        log.info("收到获取章节详情请求: id={}", id);
        return chapterService.getChapterById(id);
    }

    /**
     * 根据课程ID获取章节列表接口
     * 按创建时间降序排列
     *
     * @param courseId 课程ID
     * @return 章节列表
     */
    @GetMapping("/course/{courseId}")
    public Result<List<Chapter>> getChaptersByCourseId(@PathVariable Long courseId) {
        log.info("收到根据课程ID获取章节列表请求: courseId={}", courseId);
        return chapterService.getChaptersByCourseId(courseId);
    }

    /**
     * 新增章节接口
     *
     * @param chapter 章节信息
     * @return 新增结果
     */
    @PostMapping
    public Result<Void> addChapter(@RequestBody Chapter chapter) {
        log.info("收到新增章节请求: chapterName={}, courseId={}", chapter.getChapterName(), chapter.getCourseId());
        return chapterService.addChapter(chapter);
    }

    /**
     * 更新章节接口
     *
     * @param chapter 章节信息
     * @return 更新结果
     */
    @PutMapping
    public Result<Void> updateChapter(@RequestBody Chapter chapter) {
        log.info("收到更新章节请求: id={}", chapter.getId());
        return chapterService.updateChapter(chapter);
    }

    /**
     * 删除章节接口
     *
     * @param id 章节ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteChapter(@PathVariable Long id) {
        log.info("收到删除章节请求: id={}", id);
        return chapterService.deleteChapter(id);
    }
}
