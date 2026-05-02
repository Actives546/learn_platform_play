package com.learn.auth.service;

import com.learn.common.entity.Menu;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;

import java.util.List;

/**
 * 菜单服务接口
 * 定义菜单的增删改查、获取菜单树等核心功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
public interface MenuService {

    /**
     * 获取菜单树
     *
     * @return 菜单树列表
     */
    Result<List<Menu>> getMenuTree();

    /**
     * 获取所有菜单列表
     *
     * @return 菜单列表
     */
    Result<List<Menu>> getMenuList();

    /**
     * 分页查询菜单列表
     *
     * @param menuName 菜单名称（模糊查询）
     * @param pageNum  页码
     * @param pageSize 每页大小
     * @return 分页结果
     */
    Result<PageResult<Menu>> getMenuPage(String menuName, Integer pageNum, Integer pageSize);

    /**
     * 根据ID获取菜单详情
     *
     * @param id 菜单ID
     * @return 菜单详情
     */
    Result<Menu> getMenuById(Long id);

    /**
     * 新增菜单
     *
     * @param menu 菜单信息
     * @return 新增结果
     */
    Result<Void> addMenu(Menu menu);

    /**
     * 更新菜单
     *
     * @param menu 菜单信息
     * @return 更新结果
     */
    Result<Void> updateMenu(Menu menu);

    /**
     * 删除菜单
     *
     * @param id 菜单ID
     * @return 删除结果
     */
    Result<Void> deleteMenu(Long id);
}
