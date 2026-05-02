package com.learn.auth.mapper;

import com.learn.common.entity.RoleMenu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 角色菜单关联数据访问层接口
 * 提供角色菜单关联相关的数据库操作方法
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Mapper
public interface RoleMenuMapper {

    /**
     * 批量插入角色菜单关联
     *
     * @param roleMenus 角色菜单关联列表
     * @return 受影响的行数
     */
    int batchInsert(@Param("roleMenus") List<RoleMenu> roleMenus);

    /**
     * 根据角色ID删除角色菜单关联
     *
     * @param roleId 角色ID
     * @return 受影响的行数
     */
    int deleteByRoleId(@Param("roleId") Long roleId);

    /**
     * 根据菜单ID删除角色菜单关联
     *
     * @param menuId 菜单ID
     * @return 受影响的行数
     */
    int deleteByMenuId(@Param("menuId") Long menuId);

    /**
     * 根据角色ID查询菜单ID列表
     *
     * @param roleId 角色ID
     * @return 菜单ID列表
     */
    List<Long> selectMenuIdsByRoleId(@Param("roleId") Long roleId);
}
