package com.learn.common.entity;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 角色菜单关联实体类
 * 对应数据库中的role_menu表，存储角色与菜单的关联关系
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Data
public class RoleMenu implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    private Long id;

    /**
     * 角色ID
     */
    private Long roleId;

    /**
     * 菜单ID
     */
    private Long menuId;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;
}
