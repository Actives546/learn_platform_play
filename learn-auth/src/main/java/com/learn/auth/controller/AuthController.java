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
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginDTO loginDTO) {
        return authService.login(loginDTO);
    }

    @PostMapping("/register")
    public Result<Void> register(@Valid @RequestBody UserDTO userDTO) {
        return authService.register(userDTO);
    }

    @PostMapping("/logout")
    public Result<Void> logout(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        return authService.logout(userId);
    }

    @GetMapping("/userInfo")
    public Result<Map<String, Object>> getUserInfo(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        return authService.getUserInfo(userId);
    }

    @GetMapping("/captcha")
    public Result<String> getCaptcha(@RequestParam String uuid) {
        return authService.getCaptcha(uuid);
    }

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String userIdStr = request.getHeader(CommonConstant.USER_ID);
        if (userIdStr != null) {
            return Long.parseLong(userIdStr);
        }
        Long userId = UserContext.getUserId();
        if (userId != null) {
            return userId;
        }
        throw new RuntimeException("获取用户ID失败");
    }
}
