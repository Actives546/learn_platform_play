package com.learn.common.entity;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户实体类
 * 对应数据库中的user表，存储系统用户的基本信息
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Data
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     * 使用雪花算法生成的唯一标识
     */
    private Long id;

    /**
     * 用户名
     * 用于登录认证，唯一不可重复
     */
    private String userName;

    /**
     * 密码
     * 存储BCrypt加密后的密码，不可明文存储
     */
    private String password;

    /**
     * 昵称
     * 用户友好显示名称，可选
     */
    private String nickName;

    /**
     * 手机号
     * 用于找回密码、短信通知等，可选
     */
    private String phone;

    /**
     * 邮箱
     * 用于找回密码、邮件通知等，可选
     */
    private String email;

    /**
     * 头像
     * 存储头像图片的URL地址，可选
     */
    private String avatar;

    /**
     * 角色ID
     * 关联角色表，用于权限控制
     * 默认值：3（普通用户）
     */
    private Long roleId;

    /**
     * 状态
     * 0 - 禁用
     * 1 - 启用（默认）
     */
    private Integer status;

    /**
     * 盐值
     * 用于密码加密（当前使用BCrypt，此字段保留兼容）
     */
    private String salt;

    /**
     * 创建时间
     * 用户注册时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     * 用户信息最后修改时间
     */
    private LocalDateTime updateTime;

    /**
     * 创建人ID
     * 记录创建该用户的管理员ID
     */
    private Long createBy;

    /**
     * 更新人ID
     * 记录最后修改该用户信息的管理员ID
     */
    private Long updateBy;
}
