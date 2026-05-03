package com.learn.course.controller;

import com.learn.common.dto.DashboardStatsDTO;
import com.learn.common.result.Result;
import com.learn.course.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 首页统计控制器
 * 提供首页数据统计相关的接口
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * 获取首页统计数据接口
     * 包括用户统计、课程统计、章节统计等
     *
     * @return 首页统计数据
     */
    @GetMapping("/stats")
    public Result<DashboardStatsDTO> getDashboardStats() {
        log.info("收到获取首页统计数据请求");
        return dashboardService.getDashboardStats();
    }
}
