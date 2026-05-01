package com.learn.common.constant;

/**
 * 系统通用常量接口
 * 定义系统中使用的所有常量值，便于统一管理和维护
 *
 * @author learn-platform
 * @version 1.0.0
 */
public interface CommonConstant {

    /**
     * 默认字符编码
     */
    String DEFAULT_CHARSET = "UTF-8";

    /**
     * 操作成功标识
     */
    String SUCCESS = "success";

    /**
     * 操作失败标识
     */
    String FAIL = "fail";

    /**
     * Token请求头名称
     */
    String TOKEN_HEADER = "Authorization";

    /**
     * Token前缀
     * 格式：Bearer token
     */
    String TOKEN_PREFIX = "Bearer ";

    /**
     * Token过期时间
     * 单位：毫秒
     * 默认7天 = 7 * 24 * 60 * 60 * 1000
     */
    Long TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000L;

    /**
     * 用户ID请求头名称
     * 网关认证通过后，将用户ID传递给下游服务的请求头
     */
    String USER_ID = "userId";

    /**
     * 用户名请求头名称
     * 网关认证通过后，将用户名传递给下游服务的请求头
     */
    String USER_NAME = "userName";

    /**
     * 角色ID请求头名称
     * 网关认证通过后，将角色ID传递给下游服务的请求头
     */
    String ROLE_ID = "roleId";

    /**
     * 登录用户Redis Key前缀
     * 格式：login:user:{userId}
     * 用于存储用户登录信息，实现Token验证和单点登录
     */
    String LOGIN_USER_KEY = "login:user:";

    /**
     * 验证码Redis Key前缀
     * 格式：captcha:{uuid}
     * 用于存储图形验证码的值，实现验证码验证
     */
    String CAPTCHA_KEY = "captcha:";

    /**
     * 验证码过期时间
     * 单位：分钟
     * 默认5分钟
     */
    Integer CAPTCHA_EXPIRE = 5;

    /**
     * 请求ID请求头名称
     * 用于链路追踪，标识每个HTTP请求
     */
    String REQUEST_ID_HEADER = "X-Request-Id";
}
