package com.learn.auth.service.impl;

import com.learn.auth.mapper.RoleMapper;
import com.learn.auth.mapper.RoleMenuMapper;
import com.learn.auth.service.RoleService;
import com.learn.common.entity.Role;
import com.learn.common.entity.RoleMenu;
import com.learn.common.exception.BusinessException;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;
import com.learn.common.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 角色服务实现类
 * 实现角色的增删改查、获取角色列表、授权菜单等核心功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleMapper roleMapper;
    private final RoleMenuMapper roleMenuMapper;

    /**
     * 获取所有角色列表
     *
     * @return 角色列表
     */
    @Override
    public Result<List<Role>> getRoleList() {
        log.info("获取角色列表");
        
        List<Role> roles = roleMapper.selectAll();
        log.info("查询到角色总数: {}", roles.size());
        
        return Result.success("获取角色列表成功", roles);
    }

    /**
     * 分页查询角色列表
     *
     * @param roleName 角色名称（模糊查询）
     * @param pageNum  页码
     * @param pageSize 每页大小
     * @return 分页结果
     */
    @Override
    public Result<PageResult<Role>> getRolePage(String roleName, Integer pageNum, Integer pageSize) {
        log.info("分页查询角色列表: roleName={}, pageNum={}, pageSize={}", roleName, pageNum, pageSize);
        
        // 设置默认值
        if (pageNum == null || pageNum <= 0) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize <= 0) {
            pageSize = 10;
        }
        
        // 计算偏移量
        int offset = (pageNum - 1) * pageSize;
        
        // 查询总数
        long total = roleMapper.countTotal(roleName);
        log.info("查询到角色总数: {}", total);
        
        // 分页查询数据
        List<Role> roles = roleMapper.selectPage(roleName, offset, pageSize);
        log.info("分页查询到角色数量: {}", roles.size());
        
        // 构建分页结果
        PageResult<Role> pageResult = PageResult.of(total, roles, pageNum, pageSize);
        
        return Result.success("分页查询角色列表成功", pageResult);
    }

    /**
     * 根据ID获取角色详情
     *
     * @param id 角色ID
     * @return 角色详情
     */
    @Override
    public Result<Role> getRoleById(Long id) {
        log.info("获取角色详情: id={}", id);
        
        Role role = roleMapper.selectById(id);
        if (role == null) {
            log.warn("角色不存在: id={}", id);
            throw BusinessException.of("角色不存在");
        }
        
        return Result.success("获取角色详情成功", role);
    }

    /**
     * 新增角色
     *
     * @param role 角色信息
     * @return 新增结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> addRole(Role role) {
        log.info("新增角色: roleName={}", role.getRoleName());
        
        // 校验必填字段
        validateRole(role);
        
        // 设置默认值
        if (role.getStatus() == null) {
            role.setStatus(1);
        }
        
        // 生成ID并设置时间
        role.setId(IdGenerator.nextId());
        role.setCreateTime(LocalDateTime.now());
        role.setUpdateTime(LocalDateTime.now());
        
        // 插入数据库
        roleMapper.insert(role);
        log.info("新增角色成功: id={}, roleName={}", role.getId(), role.getRoleName());
        
        return Result.success("新增角色成功", null);
    }

    /**
     * 更新角色
     *
     * @param role 角色信息
     * @return 更新结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> updateRole(Role role) {
        log.info("更新角色: id={}", role.getId());
        
        // 校验角色是否存在
        Role existRole = roleMapper.selectById(role.getId());
        if (existRole == null) {
            log.warn("角色不存在: id={}", role.getId());
            throw BusinessException.of("角色不存在");
        }
        
        // 校验必填字段
        validateRole(role);
        
        // 设置更新时间
        role.setUpdateTime(LocalDateTime.now());
        
        // 更新数据库
        roleMapper.updateById(role);
        log.info("更新角色成功: id={}", role.getId());
        
        return Result.success("更新角色成功", null);
    }

    /**
     * 删除角色
     *
     * @param id 角色ID
     * @return 删除结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> deleteRole(Long id) {
        log.info("删除角色: id={}", id);
        
        // 校验角色是否存在
        Role role = roleMapper.selectById(id);
        if (role == null) {
            log.warn("角色不存在: id={}", id);
            throw BusinessException.of("角色不存在");
        }
        
        // 删除角色菜单关联
        roleMenuMapper.deleteByRoleId(id);
        
        // 删除角色
        roleMapper.deleteById(id);
        log.info("删除角色成功: id={}", id);
        
        return Result.success("删除角色成功", null);
    }

    /**
     * 获取角色的菜单ID列表
     *
     * @param roleId 角色ID
     * @return 菜单ID列表
     */
    @Override
    public Result<List<Long>> getRoleMenuIds(Long roleId) {
        log.info("获取角色菜单ID列表: roleId={}", roleId);
        
        // 校验角色是否存在
        Role role = roleMapper.selectById(roleId);
        if (role == null) {
            log.warn("角色不存在: roleId={}", roleId);
            throw BusinessException.of("角色不存在");
        }
        
        List<Long> menuIds = roleMenuMapper.selectMenuIdsByRoleId(roleId);
        log.info("查询到角色菜单数量: {}", menuIds.size());
        
        return Result.success("获取角色菜单列表成功", menuIds);
    }

    /**
     * 为角色授权菜单
     *
     * @param roleId  角色ID
     * @param menuIds 菜单ID列表
     * @return 授权结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> grantMenus(Long roleId, List<Long> menuIds) {
        log.info("为角色授权菜单: roleId={}, menuIds={}", roleId, menuIds);
        
        // 校验角色是否存在
        Role role = roleMapper.selectById(roleId);
        if (role == null) {
            log.warn("角色不存在: roleId={}", roleId);
            throw BusinessException.of("角色不存在");
        }
        
        // 先删除原有的菜单关联
        roleMenuMapper.deleteByRoleId(roleId);
        log.info("删除角色原有菜单关联: roleId={}", roleId);
        
        // 批量插入新的菜单关联
        if (menuIds != null && !menuIds.isEmpty()) {
            List<RoleMenu> roleMenus = new ArrayList<>();
            LocalDateTime now = LocalDateTime.now();
            for (Long menuId : menuIds) {
                RoleMenu roleMenu = new RoleMenu();
                roleMenu.setRoleId(roleId);
                roleMenu.setMenuId(menuId);
                roleMenu.setCreateTime(now);
                roleMenus.add(roleMenu);
            }
            roleMenuMapper.batchInsert(roleMenus);
            log.info("批量插入角色菜单关联: count={}", roleMenus.size());
        }
        
        // 更新角色更新时间
        role.setUpdateTime(LocalDateTime.now());
        roleMapper.updateById(role);
        
        return Result.success("授权菜单成功", null);
    }

    /**
     * 校验角色必填字段
     *
     * @param role 角色信息
     */
    private void validateRole(Role role) {
        if (!StringUtils.hasText(role.getRoleName())) {
            throw BusinessException.of("角色名称不能为空");
        }
        if (!StringUtils.hasText(role.getRoleCode())) {
            throw BusinessException.of("角色编码不能为空");
        }
    }
}
