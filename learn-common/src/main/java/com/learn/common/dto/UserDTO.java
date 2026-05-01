package com.learn.common.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 用户数据传输对象
 * 用于用户注册、修改信息等操作的参数传递
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Data
public class UserDTO {

    /**
     * 用户ID
     */
    private Long id;

    /**
     * 用户名
     * 必填字段，不能为空，用于登录认证
     */
    @NotBlank(message = "用户名不能为空")
    private String userName;

    /**
     * 昵称
     * 选填字段，用于显示用户友好名称
     */
    private String nickName;

    /**
     * 密码
     * 必填字段，不能为空，存储加密后的密码
     */
    @NotBlank(message = "密码不能为空")
    private String password;

    /**
     * 手机号
     * 选填字段，用于找回密码、短信通知等
     */
    private String phone;

    /**
     * 邮箱
     * 选填字段，用于找回密码、邮件通知等
     */
    private String email;

    /**
     * 头像
     * 选填字段，存储头像图片的URL地址
     */
    private String avatar;

    /**
     * 角色ID
     * 选填字段，用于权限控制，默认普通用户角色
     */
    private Long roleId;

    /**
     * 状态
     * 0-禁用 1-启用，用于控制用户账号状态
     */
    private Integer status;

    /**
     * 验证码唯一标识
     * 用于从Redis中获取对应的验证码进行校验
     */
    private String uuid;

    /**
     * 验证码
     * 用户输入的图形验证码内容
     */
    private String captcha;
}
