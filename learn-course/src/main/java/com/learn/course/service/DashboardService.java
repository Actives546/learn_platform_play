package com.learn.course.service;

import com.learn.common.dto.DashboardStatsDTO;
import com.learn.common.result.Result;

/**
 * 首页统计服务接口
 * 定义首页数据统计的核心功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
public interface DashboardService {

    /**
     * 获取首页统计数据
     * 包括用户统计、课程统计、章节统计等
     *
     * @return 首页统计数据
     */
    Result<DashboardStatsDTO> getDashboardStats();
}
