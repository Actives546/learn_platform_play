package com.learn.auth.service;

import com.learn.common.dto.LoginDTO;
import com.learn.common.dto.UserDTO;
import com.learn.common.result.Result;

import java.util.Map;

/**
 * 认证服务接口
 * 定义用户登录、注册、登出、获取用户信息、生成验证码等核心认证功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
public interface AuthService {

    /**
     * 用户登录
     * 验证用户名密码和验证码，生成JWT Token并返回用户信息
     *
     * @param loginDTO 登录参数（用户名、密码、uuid、验证码）
     * @return 登录结果，包含token、token类型、过期时间和用户信息
     */
    Result<Map<String, Object>> login(LoginDTO loginDTO);

    /**
     * 用户注册
     * 验证验证码，检查用户名是否存在，创建新用户并加密密码
     *
     * @param userDTO 注册参数（用户名、密码、昵称、手机号、邮箱、uuid、验证码）
     * @return 注册结果
     */
    Result<Void> register(UserDTO userDTO);

    /**
     * 用户登出
     * 从Redis中删除用户的登录信息，使token失效
     *
     * @param userId 用户ID
     * @return 登出结果
     */
    Result<Void> logout(Long userId);

    /**
     * 获取当前登录用户信息
     * 根据用户ID查询用户详情并返回
     *
     * @param userId 用户ID
     * @return 用户信息，包含基本信息、联系方式、角色等
     */
    Result<Map<String, Object>> getUserInfo(Long userId);

    /**
     * 获取图形验证码
     * 生成图形验证码图片并返回Base64编码，同时将验证码值存储到Redis
     *
     * @param uuid 验证码唯一标识，用于后续验证时从Redis获取对应的验证码
     * @return 验证码图片的Base64编码字符串，格式为 data:image/png;base64,...
     */
    Result<String> getCaptcha(String uuid);
}
