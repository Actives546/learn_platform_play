package com.learn.auth.controller;

import com.learn.auth.service.MenuService;
import com.learn.common.entity.Menu;
import com.learn.common.result.PageResult;
import com.learn.common.result.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 菜单控制器
 * 提供菜单的增删改查、获取菜单树等接口
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    /**
     * 获取菜单树接口
     * 用于前端侧边栏菜单展示
     *
     * @return 菜单树列表
     */
    @GetMapping("/tree")
    public Result<List<Menu>> getMenuTree() {
        log.info("收到获取菜单树请求");
        return menuService.getMenuTree();
    }

    /**
     * 获取菜单列表接口
     * 用于菜单管理页面展示
     *
     * @return 菜单列表
     */
    @GetMapping("/list")
    public Result<List<Menu>> getMenuList() {
        log.info("收到获取菜单列表请求");
        return menuService.getMenuList();
    }

    /**
     * 分页查询菜单列表接口
     * 支持按菜单名称模糊查询
     *
     * @param menuName 菜单名称（可选，模糊查询）
     * @param pageNum  页码（可选，默认1）
     * @param pageSize 每页大小（可选，默认10）
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<PageResult<Menu>> getMenuPage(
            @RequestParam(required = false) String menuName,
            @RequestParam(required = false, defaultValue = "1") Integer pageNum,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        log.info("收到分页查询菜单列表请求: menuName={}, pageNum={}, pageSize={}", menuName, pageNum, pageSize);
        return menuService.getMenuPage(menuName, pageNum, pageSize);
    }

    /**
     * 根据ID获取菜单详情接口
     *
     * @param id 菜单ID
     * @return 菜单详情
     */
    @GetMapping("/{id}")
    public Result<Menu> getMenuById(@PathVariable Long id) {
        log.info("收到获取菜单详情请求: id={}", id);
        return menuService.getMenuById(id);
    }

    /**
     * 新增菜单接口
     *
     * @param menu 菜单信息
     * @return 新增结果
     */
    @PostMapping
    public Result<Void> addMenu(@RequestBody Menu menu) {
        log.info("收到新增菜单请求: menuName={}", menu.getMenuName());
        return menuService.addMenu(menu);
    }

    /**
     * 更新菜单接口
     *
     * @param menu 菜单信息
     * @return 更新结果
     */
    @PutMapping
    public Result<Void> updateMenu(@RequestBody Menu menu) {
        log.info("收到更新菜单请求: id={}", menu.getId());
        return menuService.updateMenu(menu);
    }

    /**
     * 删除菜单接口
     *
     * @param id 菜单ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteMenu(@PathVariable Long id) {
        log.info("收到删除菜单请求: id={}", id);
        return menuService.deleteMenu(id);
    }
}
