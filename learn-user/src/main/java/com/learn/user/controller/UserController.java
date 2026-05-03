package com.learn.user.controller;

import com.learn.common.entity.User;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;
import com.learn.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 * 提供用户的增删改查等接口
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 分页查询用户列表接口
     * 支持按用户名、状态、角色ID筛选
     *
     * @param userName 用户名（可选，模糊查询）
     * @param status   状态（可选）
     * @param roleId   角色ID（可选）
     * @param pageNum  页码（可选，默认1）
     * @param pageSize 每页大小（可选，默认10）
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<PageResult<User>> getUserPage(
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Long roleId,
            @RequestParam(required = false, defaultValue = "1") Integer pageNum,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        log.info("收到分页查询用户列表请求: userName={}, status={}, roleId={}, pageNum={}, pageSize={}", userName, status, roleId, pageNum, pageSize);
        return userService.getUserPage(userName, status, roleId, pageNum, pageSize);
    }

    /**
     * 根据ID获取用户详情接口
     *
     * @param id 用户ID
     * @return 用户详情
     */
    @GetMapping("/{id}")
    public Result<User> getUserById(@PathVariable Long id) {
        log.info("收到获取用户详情请求: id={}", id);
        return userService.getUserById(id);
    }

    /**
     * 新增用户接口
     *
     * @param user 用户信息
     * @return 新增结果
     */
    @PostMapping
    public Result<Void> addUser(@RequestBody User user) {
        log.info("收到新增用户请求: userName={}", user.getUserName());
        return userService.addUser(user);
    }

    /**
     * 更新用户接口
     *
     * @param user 用户信息
     * @return 更新结果
     */
    @PutMapping
    public Result<Void> updateUser(@RequestBody User user) {
        log.info("收到更新用户请求: id={}", user.getId());
        return userService.updateUser(user);
    }

    /**
     * 删除用户接口（首次调用，返回确认信息）
     *
     * @param id 用户ID
     * @return 删除确认信息
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteUser(@PathVariable Long id) {
        log.info("收到删除用户请求: id={}", id);
        return userService.deleteUser(id);
    }

    /**
     * 确认删除用户接口（二次确认）
     *
     * @param id 用户ID
     * @return 删除结果
     */
    @DeleteMapping("/confirm/{id}")
    public Result<Void> confirmDeleteUser(@PathVariable Long id) {
        log.info("收到确认删除用户请求: id={}", id);
        return userService.confirmDeleteUser(id);
    }
}
