package com.learn.auth.service.impl;

import cn.hutool.crypto.digest.BCrypt;
import com.learn.auth.mapper.UserMapper;
import com.learn.auth.service.AuthService;
import com.learn.common.constant.CommonConstant;
import com.learn.common.dto.LoginDTO;
import com.learn.common.dto.UserDTO;
import com.learn.common.entity.User;
import com.learn.common.exception.BusinessException;
import com.learn.common.result.Result;
import com.learn.common.util.IdGenerator;
import com.learn.common.util.JwtUtil;
import com.learn.common.util.RedisUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final RedisUtil redisUtil;

    @Override
    public Result<Map<String, Object>> login(LoginDTO loginDTO) {
        User user = userMapper.selectByUserName(loginDTO.getUserName());
        if (user == null) {
            throw BusinessException.of("用户名或密码错误");
        }
        if (user.getStatus() != 1) {
            throw BusinessException.of("账号已被禁用");
        }
        if (!BCrypt.checkpw(loginDTO.getPassword(), user.getPassword())) {
            throw BusinessException.of("用户名或密码错误");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("userName", user.getUserName());
        claims.put("roleId", user.getRoleId());

        String token = JwtUtil.createToken(claims, CommonConstant.TOKEN_EXPIRE_TIME);

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("tokenType", "Bearer");
        result.put("expiresIn", CommonConstant.TOKEN_EXPIRE_TIME / 1000);

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("userName", user.getUserName());
        userInfo.put("nickName", user.getNickName());
        userInfo.put("avatar", user.getAvatar());
        userInfo.put("roleId", user.getRoleId());
        result.put("userInfo", userInfo);

        String redisKey = CommonConstant.LOGIN_USER_KEY + user.getId();
        redisUtil.set(redisKey, result, CommonConstant.TOKEN_EXPIRE_TIME, TimeUnit.MILLISECONDS);

        log.info("用户登录成功: {}", user.getUserName());
        return Result.success("登录成功", result);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> register(UserDTO userDTO) {
        User existUser = userMapper.selectByUserName(userDTO.getUserName());
        if (existUser != null) {
            throw BusinessException.of("用户名已存在");
        }

        User user = new User();
        BeanUtils.copyProperties(userDTO, user);
        user.setId(IdGenerator.nextId());
        user.setPassword(BCrypt.hashpw(userDTO.getPassword()));
        user.setStatus(1);
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());

        if (user.getRoleId() == null) {
            user.setRoleId(3L);
        }

        userMapper.insert(user);
        log.info("用户注册成功: {}", user.getUserName());
        return Result.success("注册成功", null);
    }

    @Override
    public Result<Void> logout(Long userId) {
        String redisKey = CommonConstant.LOGIN_USER_KEY + userId;
        redisUtil.delete(redisKey);
        log.info("用户退出登录: {}", userId);
        return Result.success("退出成功", null);
    }

    @Override
    public Result<Map<String, Object>> getUserInfo(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw BusinessException.of("用户不存在");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("userName", user.getUserName());
        result.put("nickName", user.getNickName());
        result.put("phone", user.getPhone());
        result.put("email", user.getEmail());
        result.put("avatar", user.getAvatar());
        result.put("roleId", user.getRoleId());
        result.put("status", user.getStatus());

        return Result.success(result);
    }

    @Override
    public Result<String> getCaptcha(String uuid) {
        String captcha = generateCaptcha();
        String redisKey = CommonConstant.CAPTCHA_KEY + uuid;
        redisUtil.set(redisKey, captcha, CommonConstant.CAPTCHA_EXPIRE, TimeUnit.MINUTES);
        return Result.success(captcha);
    }

    private String generateCaptcha() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 4; i++) {
            sb.append((int) (Math.random() * 10));
        }
        return sb.toString();
    }
}
