package com.learn.auth.mapper;

import com.learn.common.entity.Role;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 角色数据访问层接口
 * 提供角色相关的数据库操作方法
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Mapper
public interface RoleMapper {

    /**
     * 查询所有角色
     *
     * @return 角色列表
     */
    List<Role> selectAll();

    /**
     * 按角色名称模糊查询
     *
     * @param roleName 角色名称
     * @return 角色列表
     */
    List<Role> selectByRoleName(@Param("roleName") String roleName);

    /**
     * 根据ID查询角色
     *
     * @param id 角色ID
     * @return 角色实体对象
     */
    Role selectById(@Param("id") Long id);

    /**
     * 插入新角色
     *
     * @param role 角色实体对象
     * @return 受影响的行数
     */
    int insert(Role role);

    /**
     * 根据ID更新角色
     *
     * @param role 角色实体对象
     * @return 受影响的行数
     */
    int updateById(Role role);

    /**
     * 根据ID删除角色
     *
     * @param id 角色ID
     * @return 受影响的行数
     */
    int deleteById(@Param("id") Long id);

    /**
     * 分页查询角色列表
     *
     * @param roleName 角色名称（模糊查询）
     * @param offset   偏移量
     * @param pageSize 每页大小
     * @return 角色列表
     */
    List<Role> selectPage(@Param("roleName") String roleName, @Param("offset") int offset, @Param("pageSize") int pageSize);

    /**
     * 查询角色总数（支持模糊查询）
     *
     * @param roleName 角色名称（模糊查询）
     * @return 角色总数
     */
    long countTotal(@Param("roleName") String roleName);

    /**
     * 根据角色ID查询菜单ID列表
     *
     * @param roleId 角色ID
     * @return 菜单ID列表
     */
    List<Long> selectMenuIdsByRoleId(@Param("roleId") Long roleId);
}
