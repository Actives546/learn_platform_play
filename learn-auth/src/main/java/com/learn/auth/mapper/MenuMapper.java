package com.learn.auth.mapper;

import com.learn.common.entity.Menu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 菜单数据访问层接口
 * 提供菜单相关的数据库操作方法
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Mapper
public interface MenuMapper {

    /**
     * 查询所有菜单
     *
     * @return 菜单列表
     */
    List<Menu> selectAll();

    /**
     * 根据ID查询菜单
     *
     * @param id 菜单ID
     * @return 菜单实体对象
     */
    Menu selectById(@Param("id") Long id);

    /**
     * 根据父菜单ID查询子菜单
     *
     * @param parentId 父菜单ID
     * @return 子菜单列表
     */
    List<Menu> selectByParentId(@Param("parentId") Long parentId);

    /**
     * 插入新菜单
     *
     * @param menu 菜单实体对象
     * @return 受影响的行数
     */
    int insert(Menu menu);

    /**
     * 根据ID更新菜单
     *
     * @param menu 菜单实体对象
     * @return 受影响的行数
     */
    int updateById(Menu menu);

    /**
     * 根据ID删除菜单
     *
     * @param id 菜单ID
     * @return 受影响的行数
     */
    int deleteById(@Param("id") Long id);

    /**
     * 查询是否有子菜单
     *
     * @param parentId 父菜单ID
     * @return 子菜单数量
     */
    int countByParentId(@Param("parentId") Long parentId);
}
