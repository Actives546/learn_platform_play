package com.learn.auth.service;

import com.learn.common.entity.Role;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;

import java.util.List;

/**
 * 角色服务接口
 * 定义角色的增删改查、获取角色列表、授权菜单等核心功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
public interface RoleService {

    /**
     * 获取角色列表
     * 支持按角色名称模糊查询
     *
     * @param roleName 角色名称（可选，模糊查询）
     * @return 角色列表
     */
    Result<List<Role>> getRoleList(String roleName);

    /**
     * 分页查询角色列表
     *
     * @param roleName 角色名称（模糊查询）
     * @param pageNum  页码
     * @param pageSize 每页大小
     * @return 分页结果
     */
    Result<PageResult<Role>> getRolePage(String roleName, Integer pageNum, Integer pageSize);

    /**
     * 根据ID获取角色详情
     *
     * @param id 角色ID
     * @return 角色详情
     */
    Result<Role> getRoleById(Long id);

    /**
     * 新增角色
     *
     * @param role 角色信息
     * @return 新增结果
     */
    Result<Void> addRole(Role role);

    /**
     * 更新角色
     *
     * @param role 角色信息
     * @return 更新结果
     */
    Result<Void> updateRole(Role role);

    /**
     * 删除角色
     *
     * @param id 角色ID
     * @return 删除结果
     */
    Result<Void> deleteRole(Long id);

    /**
     * 获取角色的菜单ID列表
     *
     * @param roleId 角色ID
     * @return 菜单ID列表
     */
    Result<List<Long>> getRoleMenuIds(Long roleId);

    /**
     * 为角色授权菜单
     *
     * @param roleId  角色ID
     * @param menuIds 菜单ID列表
     * @return 授权结果
     */
    Result<Void> grantMenus(Long roleId, List<Long> menuIds);
}
