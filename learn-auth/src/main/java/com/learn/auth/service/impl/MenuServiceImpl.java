package com.learn.auth.service.impl;

import com.learn.auth.mapper.MenuMapper;
import com.learn.auth.service.MenuService;
import com.learn.common.entity.Menu;
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
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 菜单服务实现类
 * 实现菜单的增删改查、获取菜单树等核心功能
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {

    private final MenuMapper menuMapper;

    /**
     * 获取菜单树
     * 1. 查询所有菜单
     * 2. 构建菜单树结构
     *
     * @return 菜单树列表
     */
    @Override
    public Result<List<Menu>> getMenuTree() {
        log.info("获取菜单树");
        
        // 1. 查询所有菜单
        List<Menu> allMenus = menuMapper.selectAll();
        log.info("查询到菜单总数: {}", allMenus.size());
        
        // 2. 构建菜单树
        List<Menu> menuTree = buildMenuTree(allMenus);
        
        return Result.success("获取菜单树成功", menuTree);
    }

    /**
     * 获取所有菜单列表
     *
     * @return 菜单列表
     */
    @Override
    public Result<List<Menu>> getMenuList() {
        log.info("获取菜单列表");
        
        List<Menu> menus = menuMapper.selectAll();
        log.info("查询到菜单总数: {}", menus.size());
        
        return Result.success("获取菜单列表成功", menus);
    }

    /**
     * 分页查询菜单列表
     *
     * @param menuName 菜单名称（模糊查询）
     * @param pageNum  页码
     * @param pageSize 每页大小
     * @return 分页结果
     */
    @Override
    public Result<PageResult<Menu>> getMenuPage(String menuName, Integer pageNum, Integer pageSize) {
        log.info("分页查询菜单列表: menuName={}, pageNum={}, pageSize={}", menuName, pageNum, pageSize);
        
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
        long total = menuMapper.countTotal(menuName);
        log.info("查询到菜单总数: {}", total);
        
        // 分页查询数据
        List<Menu> menus = menuMapper.selectPage(menuName, offset, pageSize);
        log.info("分页查询到菜单数量: {}", menus.size());
        
        // 构建分页结果
        PageResult<Menu> pageResult = PageResult.of(total, menus, pageNum, pageSize);
        
        return Result.success("分页查询菜单列表成功", pageResult);
    }

    /**
     * 根据ID获取菜单详情
     *
     * @param id 菜单ID
     * @return 菜单详情
     */
    @Override
    public Result<Menu> getMenuById(Long id) {
        log.info("获取菜单详情: id={}", id);
        
        Menu menu = menuMapper.selectById(id);
        if (menu == null) {
            log.warn("菜单不存在: id={}", id);
            throw BusinessException.of("菜单不存在");
        }
        
        return Result.success("获取菜单详情成功", menu);
    }

    /**
     * 新增菜单
     *
     * @param menu 菜单信息
     * @return 新增结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> addMenu(Menu menu) {
        log.info("新增菜单: menuName={}", menu.getMenuName());
        
        // 1. 校验必填字段
        validateMenu(menu);
        
        // 2. 设置默认值
        if (menu.getParentId() == null) {
            menu.setParentId(0L);
        }
        if (menu.getSort() == null) {
            menu.setSort(0);
        }
        if (menu.getStatus() == null) {
            menu.setStatus(1);
        }
        
        // 3. 生成ID并设置时间
        menu.setId(IdGenerator.nextId());
        menu.setCreateTime(LocalDateTime.now());
        menu.setUpdateTime(LocalDateTime.now());
        
        // 4. 插入数据库
        menuMapper.insert(menu);
        log.info("新增菜单成功: id={}, menuName={}", menu.getId(), menu.getMenuName());
        
        return Result.success("新增菜单成功", null);
    }

    /**
     * 更新菜单
     *
     * @param menu 菜单信息
     * @return 更新结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> updateMenu(Menu menu) {
        log.info("更新菜单: id={}", menu.getId());
        
        // 1. 校验菜单是否存在
        Menu existMenu = menuMapper.selectById(menu.getId());
        if (existMenu == null) {
            log.warn("菜单不存在: id={}", menu.getId());
            throw BusinessException.of("菜单不存在");
        }
        
        // 2. 校验必填字段
        validateMenu(menu);
        
        // 3. 设置更新时间
        menu.setUpdateTime(LocalDateTime.now());
        
        // 4. 更新数据库
        menuMapper.updateById(menu);
        log.info("更新菜单成功: id={}", menu.getId());
        
        return Result.success("更新菜单成功", null);
    }

    /**
     * 删除菜单
     *
     * @param id 菜单ID
     * @return 删除结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> deleteMenu(Long id) {
        log.info("删除菜单: id={}", id);
        
        // 1. 校验菜单是否存在
        Menu menu = menuMapper.selectById(id);
        if (menu == null) {
            log.warn("菜单不存在: id={}", id);
            throw BusinessException.of("菜单不存在");
        }
        
        // 2. 检查是否有子菜单
        int childCount = menuMapper.countByParentId(id);
        if (childCount > 0) {
            log.warn("菜单存在子菜单，无法删除: id={}, childCount={}", id, childCount);
            throw BusinessException.of("存在子菜单，请先删除子菜单");
        }
        
        // 3. 删除菜单
        menuMapper.deleteById(id);
        log.info("删除菜单成功: id={}", id);
        
        return Result.success("删除菜单成功", null);
    }

    /**
     * 构建菜单树
     *
     * @param menus 所有菜单列表
     * @return 菜单树列表
     */
    private List<Menu> buildMenuTree(List<Menu> menus) {
        // 1. 将菜单按 parentId 分组
        Map<Long, List<Menu>> menuMap = menus.stream()
                .collect(Collectors.groupingBy(Menu::getParentId));
        
        // 2. 为每个菜单设置子菜单
        for (Menu menu : menus) {
            menu.setChildren(menuMap.getOrDefault(menu.getId(), new ArrayList<>()));
        }
        
        // 3. 返回顶级菜单（parentId 为 0 的菜单）
        return menuMap.getOrDefault(0L, new ArrayList<>());
    }

    /**
     * 校验菜单必填字段
     *
     * @param menu 菜单信息
     */
    private void validateMenu(Menu menu) {
        if (!StringUtils.hasText(menu.getMenuName())) {
            throw BusinessException.of("菜单名称不能为空");
        }
        if (menu.getMenuType() == null) {
            throw BusinessException.of("菜单类型不能为空");
        }
        // 菜单和按钮类型需要校验路径
        if (menu.getMenuType() == 2 && !StringUtils.hasText(menu.getPath())) {
            throw BusinessException.of("菜单路径不能为空");
        }
    }
}
