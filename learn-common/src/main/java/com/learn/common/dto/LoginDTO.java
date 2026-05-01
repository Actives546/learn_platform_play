package com.learn.common.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 登录请求数据传输对象
 * 用于接收前端登录请求的参数
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Data
public class LoginDTO {

    /**
     * 用户名
     * 必填字段，不能为空
     */
    @NotBlank(message = "用户名不能为空")
    private String userName;

    /**
     * 密码
     * 必填字段，不能为空
     */
    @NotBlank(message = "密码不能为空")
    private String password;

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
