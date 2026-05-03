package com.learn.user.service;

import com.learn.common.entity.User;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;

/**
 * 用户服务接口
 * 定义用户的增删改查等核心功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
public interface UserService {

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
    Result<PageResult<User>> getUserPage(String userName, Integer status, Long roleId, Integer pageNum, Integer pageSize);

    /**
     * 根据ID获取用户详情
     *
     * @param id 用户ID
     * @return 用户详情
     */
    Result<User> getUserById(Long id);

    /**
     * 新增用户
     *
     * @param user 用户信息
     * @return 新增结果
     */
    Result<Void> addUser(User user);

    /**
     * 更新用户
     *
     * @param user 用户信息
     * @return 更新结果
     */
    Result<Void> updateUser(User user);

    /**
     * 删除用户
     *
     * @param id 用户ID
     * @return 删除结果
     */
    Result<Void> deleteUser(Long id);
}
