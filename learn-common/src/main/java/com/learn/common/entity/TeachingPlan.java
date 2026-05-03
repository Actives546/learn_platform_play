package com.learn.common.entity;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 教学计划实体类
 * 对应数据库中的teaching_plan表，存储教学计划的基本信息
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Data
public class TeachingPlan implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     * 使用雪花算法生成的唯一标识
     */
    private Long id;

    /**
     * 课程ID
     * 关联course表的主键ID
     */
    private Long courseId;

    /**
     * 计划名称
     */
    private String planName;

    /**
     * 计划描述
     */
    private String description;

    /**
     * 开始时间
     */
    private LocalDateTime startTime;

    /**
     * 结束时间
     */
    private LocalDateTime endTime;

    /**
     * 每周课时安排
     * JSON格式存储，例如：{"周一": 2, "周三": 1, "周五": 2}
     */
    private String weeklySchedule;

    /**
     * 教学进度
     * 百分比，0-100
     */
    private Integer progress;

    /**
     * 状态
     * 0 - 未开始
     * 1 - 进行中
     * 2 - 已完成
     * 3 - 已暂停
     */
    private Integer status;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 逻辑删除标志
     * 0 - 未删除
     * 1 - 已删除
     */
    private Integer isDeleted;
}
