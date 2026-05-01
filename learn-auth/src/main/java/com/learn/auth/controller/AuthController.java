package com.learn.auth.controller;

import com.learn.auth.service.AuthService;
import com.learn.common.constant.CommonConstant;
import com.learn.common.dto.LoginDTO;
import com.learn.common.dto.UserDTO;
import com.learn.common.result.Result;
import com.learn.common.util.UserContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 认证控制器
 * 提供用户登录、注册、登出、获取用户信息、获取验证码等认证相关接口
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@RestController
@RequestMapping
@RequiredArgsConstructor
public class AuthController {

    /**
     * 认证服务
     */
    private final AuthService authService;

    /**
     * 用户登录接口
     * 验证用户名密码和验证码，生成JWT Token并返回用户信息
     *
     * @param loginDTO 登录参数（用户名、密码、uuid、验证码）
     * @return 登录结果，包含token和用户信息
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginDTO loginDTO) {
        log.info("收到登录请求: userName={}", loginDTO.getUserName());
        return authService.login(loginDTO);
    }

    /**
     * 用户注册接口
     * 验证验证码，检查用户名是否存在，创建新用户
     *
     * @param userDTO 注册参数（用户名、密码、昵称、手机号、邮箱、uuid、验证码）
     * @return 注册结果
     */
    @PostMapping("/register")
    public Result<Void> register(@Valid @RequestBody UserDTO userDTO) {
        log.info("收到注册请求: userName={}", userDTO.getUserName());
        return authService.register(userDTO);
    }

    /**
     * 用户登出接口
     * 从Redis中删除用户的登录信息，使token失效
     *
     * @param request HTTP请求对象，用于获取用户ID
     * @return 登出结果
     */
    @PostMapping("/logout")
    public Result<Void> logout(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        log.info("收到登出请求: userId={}", userId);
        return authService.logout(userId);
    }

    /**
     * 获取当前登录用户信息接口
     * 根据用户ID查询用户详情并返回
     *
     * @param request HTTP请求对象，用于获取用户ID
     * @return 用户信息
     */
    @GetMapping("/userInfo")
    public Result<Map<String, Object>> getUserInfo(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        log.info("收到获取用户信息请求: userId={}", userId);
        return authService.getUserInfo(userId);
    }

    /**
     * 获取图形验证码接口
     * 生成图形验证码图片并返回Base64编码，同时将验证码值存储到Redis
     *
     * @param uuid 验证码唯一标识，用于后续验证时从Redis获取对应的验证码
     * @return 验证码图片的Base64编码字符串
     */
    @GetMapping("/captcha")
    public Result<String> getCaptcha(@RequestParam String uuid) {
        log.info("收到获取验证码请求: uuid={}", uuid);
        return authService.getCaptcha(uuid);
    }

    /**
     * 从请求中获取用户ID
     * 优先从请求头获取，其次从UserContext获取
     *
     * @param request HTTP请求对象
     * @return 用户ID
     * @throws RuntimeException 如果获取不到用户ID则抛出异常
     */
    private Long getUserIdFromRequest(HttpServletRequest request) {
        // 1. 优先从请求头获取用户ID（网关传递）
        String userIdStr = request.getHeader(CommonConstant.USER_ID);
        if (userIdStr != null) {
            return Long.parseLong(userIdStr);
        }

        // 2. 其次从UserContext获取（本地线程存储）
        Long userId = UserContext.getUserId();
        if (userId != null) {
            return userId;
        }

        // 3. 都获取不到则抛出异常
        log.error("获取用户ID失败，请求头和UserContext中都没有用户信息");
        throw new RuntimeException("获取用户ID失败");
    }
}
