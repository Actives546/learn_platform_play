package com.learn.common.entity;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 菜单实体类
 * 对应数据库中的menu表，存储系统菜单的基本信息
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Data
public class Menu implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    private Long id;

    /**
     * 父菜单ID
     * 0表示顶级菜单
     */
    private Long parentId;

    /**
     * 菜单名称
     */
    private String menuName;

    /**
     * 路由路径
     */
    private String path;

    /**
     * 组件路径
     */
    private String component;

    /**
     * 图标
     */
    private String icon;

    /**
     * 菜单类型
     * 1 - 目录
     * 2 - 菜单
     * 3 - 按钮
     */
    private Integer menuType;

    /**
     * 权限标识
     */
    private String perms;

    /**
     * 排序
     */
    private Integer sort;

    /**
     * 状态
     * 0 - 禁用
     * 1 - 启用
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
     * 子菜单列表
     * 用于构建菜单树
     */
    private List<Menu> children;
}
