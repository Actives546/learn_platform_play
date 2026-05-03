package com.learn.common.entity;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 章节实体类
 * 对应数据库中的chapter表，存储课程章节的基本信息
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Data
public class Chapter implements Serializable {

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
     * 章节名称
     */
    private String chapterName;

    /**
     * 章节描述
     */
    private String description;

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
