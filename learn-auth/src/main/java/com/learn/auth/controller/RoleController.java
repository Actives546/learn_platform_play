package com.learn.auth.controller;

import com.learn.auth.service.RoleService;
import com.learn.common.entity.Role;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 角色控制器
 * 提供角色的增删改查、获取角色列表、授权菜单等接口
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/role")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    /**
     * 获取角色列表接口
     * 用于角色授权管理页面左侧角色列表展示
     *
     * @return 角色列表
     */
    @GetMapping("/list")
    public Result<List<Role>> getRoleList() {
        log.info("收到获取角色列表请求");
        return roleService.getRoleList();
    }

    /**
     * 分页查询角色列表接口
     * 支持按角色名称模糊查询
     *
     * @param roleName 角色名称（可选，模糊查询）
     * @param pageNum  页码（可选，默认1）
     * @param pageSize 每页大小（可选，默认10）
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<PageResult<Role>> getRolePage(
            @RequestParam(required = false) String roleName,
            @RequestParam(required = false, defaultValue = "1") Integer pageNum,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        log.info("收到分页查询角色列表请求: roleName={}, pageNum={}, pageSize={}", roleName, pageNum, pageSize);
        return roleService.getRolePage(roleName, pageNum, pageSize);
    }

    /**
     * 根据ID获取角色详情接口
     *
     * @param id 角色ID
     * @return 角色详情
     */
    @GetMapping("/{id}")
    public Result<Role> getRoleById(@PathVariable Long id) {
        log.info("收到获取角色详情请求: id={}", id);
        return roleService.getRoleById(id);
    }

    /**
     * 新增角色接口
     *
     * @param role 角色信息
     * @return 新增结果
     */
    @PostMapping
    public Result<Void> addRole(@RequestBody Role role) {
        log.info("收到新增角色请求: roleName={}", role.getRoleName());
        return roleService.addRole(role);
    }

    /**
     * 更新角色接口
     *
     * @param role 角色信息
     * @return 更新结果
     */
    @PutMapping
    public Result<Void> updateRole(@RequestBody Role role) {
        log.info("收到更新角色请求: id={}", role.getId());
        return roleService.updateRole(role);
    }

    /**
     * 删除角色接口
     *
     * @param id 角色ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteRole(@PathVariable Long id) {
        log.info("收到删除角色请求: id={}", id);
        return roleService.deleteRole(id);
    }

    /**
     * 获取角色的菜单ID列表接口
     * 用于角色授权管理页面获取当前角色已选中的菜单
     *
     * @param roleId 角色ID
     * @return 菜单ID列表
     */
    @GetMapping("/menuIds/{roleId}")
    public Result<List<Long>> getRoleMenuIds(@PathVariable Long roleId) {
        log.info("收到获取角色菜单ID列表请求: roleId={}", roleId);
        return roleService.getRoleMenuIds(roleId);
    }

    /**
     * 为角色授权菜单接口
     *
     * @param params 包含角色ID和菜单ID列表
     * @return 授权结果
     */
    @PostMapping("/grantMenus")
    public Result<Void> grantMenus(@RequestBody Map<String, Object> params) {
        Long roleId = ((Number) params.get("roleId")).longValue();
        @SuppressWarnings("unchecked")
        List<Long> menuIds = (List<Long>) params.get("menuIds");
        log.info("收到为角色授权菜单请求: roleId={}, menuIds={}", roleId, menuIds);
        return roleService.grantMenus(roleId, menuIds);
    }
}
