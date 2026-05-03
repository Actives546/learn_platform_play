package com.learn.common.entity;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 课程实体类
 * 对应数据库中的course表，存储课程的基本信息
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Data
public class Course implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     * 使用雪花算法生成的唯一标识
     */
    private Long id;

    /**
     * 课程名称
     */
    private String courseName;

    /**
     * 课程封面
     * 存储封面图片的URL地址
     */
    private String cover;

    /**
     * 课程描述
     */
    private String description;

    /**
     * 讲师ID
     * 关联用户表中的讲师
     */
    private Long teacherId;

    /**
     * 课时数
     */
    private Integer lessonCount;

    /**
     * 课程状态
     * 0 - 草稿
     * 1 - 已上架
     * 2 - 已下架
     */
    private Integer status;

    /**
     * 排序
     * 数值越小越靠前
     */
    private Integer sort;

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
