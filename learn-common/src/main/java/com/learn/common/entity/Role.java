package com.learn.common.entity;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 角色实体类
 * 对应数据库中的role表，存储系统角色的基本信息
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Data
public class Role implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    private Long id;

    /**
     * 角色名称
     */
    private String roleName;

    /**
     * 角色编码
     */
    private String roleCode;

    /**
     * 描述
     */
    private String description;

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
     * 菜单ID列表
     * 用于前端传参时的菜单权限
     */
    private List<Long> menuIds;

    /**
     * 菜单列表
     * 用于返回角色拥有的菜单
     */
    private List<Menu> menus;
}
