package com.learn.user.mapper;

import com.learn.common.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户数据访问层接口
 * 提供用户相关的数据库操作方法
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Mapper
public interface UserMapper {

    /**
     * 根据ID查询用户
     *
     * @param id 用户ID
     * @return 用户实体对象
     */
    User selectById(@Param("id") Long id);

    /**
     * 根据用户名查询用户
     *
     * @param userName 用户名
     * @return 用户实体对象
     */
    User selectByUserName(@Param("userName") String userName);

    /**
     * 插入新用户
     *
     * @param user 用户实体对象
     * @return 受影响的行数
     */
    int insert(User user);

    /**
     * 根据ID更新用户
     *
     * @param user 用户实体对象
     * @return 受影响的行数
     */
    int updateById(User user);

    /**
     * 根据ID删除用户
     *
     * @param id 用户ID
     * @return 受影响的行数
     */
    int deleteById(@Param("id") Long id);

    /**
     * 分页查询用户列表
     * 支持按用户名、状态、角色ID筛选
     *
     * @param userName 用户名（模糊查询）
     * @param status   状态
     * @param roleId   角色ID
     * @param offset   偏移量
     * @param pageSize 每页大小
     * @return 用户列表
     */
    List<User> selectPage(
            @Param("userName") String userName,
            @Param("status") Integer status,
            @Param("roleId") Long roleId,
            @Param("offset") int offset,
            @Param("pageSize") int pageSize);

    /**
     * 查询用户总数
     * 支持按用户名、状态、角色ID筛选
     *
     * @param userName 用户名（模糊查询）
     * @param status   状态
     * @param roleId   角色ID
     * @return 用户总数
     */
    long countTotal(
            @Param("userName") String userName,
            @Param("status") Integer status,
            @Param("roleId") Long roleId);
}
