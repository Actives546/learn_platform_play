package com.learn.user.service.impl;

import cn.hutool.crypto.digest.BCrypt;
import com.learn.common.entity.User;
import com.learn.common.exception.BusinessException;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;
import com.learn.common.util.IdGenerator;
import com.learn.user.mapper.UserMapper;
import com.learn.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户服务实现类
 * 实现用户的增删改查等核心功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    /**
     * 分页查询用户列表
     * 支持按用户名、状态、角色ID筛选
     *
     * @param userName 用户名（模糊查询）
     * @param status   状态
     * @param roleId   角色ID
     * @param pageNum  页码
     * @param pageSize 每页大小
     * @return 分页结果
     */
    @Override
    public Result<PageResult<User>> getUserPage(String userName, Integer status, Long roleId, Integer pageNum, Integer pageSize) {
        log.info("分页查询用户列表: userName={}, status={}, roleId={}, pageNum={}, pageSize={}", userName, status, roleId, pageNum, pageSize);

        if (pageNum == null || pageNum <= 0) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize <= 0) {
            pageSize = 10;
        }

        int offset = (pageNum - 1) * pageSize;

        long total = userMapper.countTotal(userName, status, roleId);
        log.info("查询到用户总数: {}", total);

        List<User> users = userMapper.selectPage(userName, status, roleId, offset, pageSize);
        log.info("分页查询到用户数量: {}", users.size());

        PageResult<User> pageResult = PageResult.of(total, users, pageNum, pageSize);

        return Result.success("分页查询用户列表成功", pageResult);
    }

    /**
     * 根据ID获取用户详情
     *
     * @param id 用户ID
     * @return 用户详情
     */
    @Override
    public Result<User> getUserById(Long id) {
        log.info("获取用户详情: id={}", id);

        User user = userMapper.selectById(id);
        if (user == null) {
            log.warn("用户不存在: id={}", id);
            throw BusinessException.of("用户不存在");
        }

        return Result.success("获取用户详情成功", user);
    }

    /**
     * 新增用户
     *
     * @param user 用户信息
     * @return 新增结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> addUser(User user) {
        log.info("新增用户: userName={}", user.getUserName());

        validateUser(user);

        User existUser = userMapper.selectByUserName(user.getUserName());
        if (existUser != null) {
            log.warn("用户名已存在: userName={}", user.getUserName());
            throw BusinessException.of("用户名已存在");
        }

        if (user.getStatus() == null) {
            user.setStatus(1);
        }
        if (user.getRoleId() == null) {
            user.setRoleId(3L);
        }

        user.setId(IdGenerator.nextId());
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        user.setPassword(BCrypt.hashpw(user.getPassword()));

        userMapper.insert(user);
        log.info("新增用户成功: id={}, userName={}", user.getId(), user.getUserName());

        return Result.success("新增用户成功", null);
    }

    /**
     * 更新用户
     *
     * @param user 用户信息
     * @return 更新结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> updateUser(User user) {
        log.info("更新用户: id={}", user.getId());

        User existUser = userMapper.selectById(user.getId());
        if (existUser == null) {
            log.warn("用户不存在: id={}", user.getId());
            throw BusinessException.of("用户不存在");
        }

        if (StringUtils.hasText(user.getUserName())) {
            User userWithSameName = userMapper.selectByUserName(user.getUserName());
            if (userWithSameName != null && !userWithSameName.getId().equals(user.getId())) {
                log.warn("用户名已被其他用户使用: userName={}", user.getUserName());
                throw BusinessException.of("用户名已存在");
            }
        }

        user.setUpdateTime(LocalDateTime.now());

        userMapper.updateById(user);
        log.info("更新用户成功: id={}", user.getId());

        return Result.success("更新用户成功", null);
    }

    /**
     * 删除用户
     *
     * @param id 用户ID
     * @return 删除结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> deleteUser(Long id) {
        log.info("删除用户: id={}", id);

        User user = userMapper.selectById(id);
        if (user == null) {
            log.warn("用户不存在: id={}", id);
            throw BusinessException.of("用户不存在");
        }

        userMapper.deleteById(id);
        log.info("删除用户成功: id={}, userName={}", user.getId(), user.getUserName());

        return Result.success("删除用户成功", null);
    }

    /**
     * 校验用户必填字段
     *
     * @param user 用户信息
     */
    private void validateUser(User user) {
        if (!StringUtils.hasText(user.getUserName())) {
            throw BusinessException.of("用户名不能为空");
        }
        if (!StringUtils.hasText(user.getPassword())) {
            throw BusinessException.of("密码不能为空");
        }
    }
}
