package com.learn.auth.service.impl;

import cn.hutool.crypto.digest.BCrypt;
import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.CircleCaptcha;
import cn.hutool.core.codec.Base64;
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
import org.springframework.util.StringUtils;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 认证服务实现类
 * 实现用户登录、注册、登出、获取用户信息、生成验证码等核心认证功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    /**
     * 用户数据访问层
     */
    private final UserMapper userMapper;

    /**
     * Redis工具类
     * 用于存储登录用户信息和验证码
     */
    private final RedisUtil redisUtil;

    /**
     * 用户登录
     * 1. 验证验证码（如果有）
     * 2. 校验用户名和密码
     * 3. 生成JWT Token
     * 4. 存储用户信息到Redis
     * 5. 返回登录结果
     *
     * @param loginDTO 登录参数
     * @return 登录结果，包含token和用户信息
     */
    @Override
    public Result<Map<String, Object>> login(LoginDTO loginDTO) {
        log.info("用户开始登录: userName={}", loginDTO.getUserName());

        // 1. 验证图形验证码（如果前端传递了验证码参数）
        validateCaptcha(loginDTO.getUuid(), loginDTO.getCaptcha());

        // 2. 根据用户名查询用户信息
        User user = userMapper.selectByUserName(loginDTO.getUserName());
        if (user == null) {
            log.warn("登录失败: 用户不存在 - userName={}", loginDTO.getUserName());
            throw BusinessException.of("用户名或密码错误");
        }

        // 3. 检查用户状态
        if (user.getStatus() != 1) {
            log.warn("登录失败: 用户已被禁用 - userName={}", loginDTO.getUserName());
            throw BusinessException.of("账号已被禁用，请联系管理员");
        }

        // 4. 验证密码（使用BCrypt加密校验）
        if (!BCrypt.checkpw(loginDTO.getPassword(), user.getPassword())) {
            log.warn("登录失败: 密码错误 - userName={}", loginDTO.getUserName());
            throw BusinessException.of("用户名或密码错误");
        }

        // 5. 构建JWT Token的载荷信息
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("userName", user.getUserName());
        claims.put("roleId", user.getRoleId());

        // 6. 生成JWT Token
        String token = JwtUtil.createToken(claims, CommonConstant.TOKEN_EXPIRE_TIME);
        log.info("用户登录成功: userId={}, userName={}", user.getId(), user.getUserName());

        // 7. 构建返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("tokenType", "Bearer");
        result.put("expiresIn", CommonConstant.TOKEN_EXPIRE_TIME / 1000);

        // 8. 构建用户信息返回
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("userName", user.getUserName());
        userInfo.put("nickName", user.getNickName());
        userInfo.put("avatar", user.getAvatar());
        userInfo.put("roleId", user.getRoleId());
        result.put("userInfo", userInfo);

        // 9. 存储登录用户信息到Redis，用于后续的token验证
        String redisKey = CommonConstant.LOGIN_USER_KEY + user.getId();
        redisUtil.set(redisKey, result, CommonConstant.TOKEN_EXPIRE_TIME, TimeUnit.MILLISECONDS);
        log.info("用户登录信息已缓存到Redis: userId={}", user.getId());

        return Result.success("登录成功", result);
    }

    /**
     * 用户注册
     * 1. 验证验证码（如果有）
     * 2. 检查用户名是否已存在
     * 3. 加密密码并创建用户
     * 4. 存储用户到数据库
     *
     * @param userDTO 注册参数
     * @return 注册结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> register(UserDTO userDTO) {
        log.info("用户开始注册: userName={}", userDTO.getUserName());

        // 1. 验证图形验证码（如果前端传递了验证码参数）
        validateCaptcha(userDTO.getUuid(), userDTO.getCaptcha());

        // 2. 检查用户名是否已存在
        User existUser = userMapper.selectByUserName(userDTO.getUserName());
        if (existUser != null) {
            log.warn("注册失败: 用户名已存在 - userName={}", userDTO.getUserName());
            throw BusinessException.of("用户名已存在，请更换其他用户名");
        }

        // 3. 创建用户对象并设置属性
        User user = new User();
        BeanUtils.copyProperties(userDTO, user);
        // 使用雪花算法生成唯一ID
        user.setId(IdGenerator.nextId());
        // 使用BCrypt加密密码
        user.setPassword(BCrypt.hashpw(userDTO.getPassword()));
        // 设置默认状态为启用
        user.setStatus(1);
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());

        // 4. 设置默认角色（普通用户）
        if (user.getRoleId() == null) {
            // 默认角色ID为3（普通用户）
            user.setRoleId(3L);
        }

        // 5. 插入用户到数据库
        userMapper.insert(user);
        log.info("用户注册成功: userId={}, userName={}", user.getId(), user.getUserName());

        return Result.success("注册成功，请登录", null);
    }

    /**
     * 用户登出
     * 从Redis中删除用户的登录信息
     *
     * @param userId 用户ID
     * @return 登出结果
     */
    @Override
    public Result<Void> logout(Long userId) {
        log.info("用户开始登出: userId={}", userId);

        // 从Redis中删除登录用户信息
        String redisKey = CommonConstant.LOGIN_USER_KEY + userId;
        redisUtil.delete(redisKey);

        log.info("用户登出成功: userId={}", userId);
        return Result.success("退出成功", null);
    }

    /**
     * 获取当前登录用户信息
     * 根据用户ID查询用户详情
     *
     * @param userId 用户ID
     * @return 用户信息
     */
    @Override
    public Result<Map<String, Object>> getUserInfo(Long userId) {
        log.info("获取用户信息: userId={}", userId);

        // 根据ID查询用户
        User user = userMapper.selectById(userId);
        if (user == null) {
            log.warn("获取用户信息失败: 用户不存在 - userId={}", userId);
            throw BusinessException.of("用户不存在");
        }

        // 构建返回的用户信息
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

    /**
     * 获取图形验证码
     * 1. 使用Hutool生成图形验证码
     * 2. 将验证码值存储到Redis
     * 3. 返回验证码图片的Base64编码
     *
     * @param uuid 验证码唯一标识
     * @return 验证码图片的Base64编码字符串
     */
    @Override
    public Result<String> getCaptcha(String uuid) {
        log.info("生成图形验证码: uuid={}", uuid);

        // 1. 生成4位数字验证码
        String captchaCode = generateCaptchaCode();

        // 2. 使用Hutool生成图形验证码
        // 参数说明：宽120, 高48, 验证码位数4, 干扰圈数量20
        CircleCaptcha captcha = CaptchaUtil.createCircleCaptcha(120, 48, 4, 20);
        captcha.setCode(captchaCode);

        // 3. 将验证码图片转换为Base64编码
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            captcha.write(outputStream);
        } catch (Exception e) {
            log.error("验证码图片生成失败: {}", e.getMessage());
            throw BusinessException.of("验证码生成失败，请重试");
        }

        byte[] imageBytes = outputStream.toByteArray();
        String base64Image = "data:image/png;base64," + Base64.encode(imageBytes);

        // 4. 存储验证码到Redis，设置过期时间
        String redisKey = CommonConstant.CAPTCHA_KEY + uuid;
        redisUtil.set(redisKey, captchaCode, CommonConstant.CAPTCHA_EXPIRE, TimeUnit.MINUTES);

        log.info("验证码已生成并缓存: uuid={}, code={}", uuid, captchaCode);
        return Result.success(base64Image);
    }

    /**
     * 验证图形验证码
     * 从Redis中获取验证码与用户输入进行比对
     * 验证成功后删除Redis中的验证码（防止重复使用）
     *
     * @param uuid    验证码唯一标识
     * @param captcha 用户输入的验证码
     */
    private void validateCaptcha(String uuid, String captcha) {
        // 如果前端没有传递验证码参数，则跳过验证（兼容旧版本）
        if (!StringUtils.hasText(uuid) || !StringUtils.hasText(captcha)) {
            log.warn("验证码参数为空，跳过验证码验证");
            return;
        }

        // 从Redis获取存储的验证码
        String redisKey = CommonConstant.CAPTCHA_KEY + uuid;
        String storedCaptcha = (String) redisUtil.get(redisKey);

        // 验证码不存在或已过期
        if (storedCaptcha == null) {
            log.warn("验证码不存在或已过期: uuid={}", uuid);
            throw BusinessException.of("验证码已过期，请刷新验证码");
        }

        // 验证码比对（不区分大小写）
        if (!storedCaptcha.equalsIgnoreCase(captcha)) {
            log.warn("验证码错误: uuid={}, input={}, expected={}", uuid, captcha, storedCaptcha);
            throw BusinessException.of("验证码错误，请重新输入");
        }

        // 验证成功后删除验证码，防止重复使用
        redisUtil.delete(redisKey);
        log.debug("验证码验证成功，已删除Redis缓存: uuid={}", uuid);
    }

    /**
     * 生成4位随机数字验证码
     *
     * @return 4位数字字符串
     */
    private String generateCaptchaCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 4; i++) {
            // 生成0-9的随机数字
            sb.append((int) (Math.random() * 10));
        }
        return sb.toString();
    }
}
