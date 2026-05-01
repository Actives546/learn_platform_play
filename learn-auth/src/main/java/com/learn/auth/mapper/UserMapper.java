package com.learn.auth.mapper;

import com.learn.common.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

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
     * 根据用户名查询用户信息
     * 用于登录时验证用户是否存在
     *
     * @param userName 用户名
     * @return 用户实体对象，如果不存在则返回null
     */
    @Select("SELECT * FROM user WHERE user_name = #{userName}")
    User selectByUserName(@Param("userName") String userName);

    /**
     * 根据用户ID查询用户信息
     * 用于获取当前登录用户的详细信息
     *
     * @param id 用户ID
     * @return 用户实体对象，如果不存在则返回null
     */
    @Select("SELECT * FROM user WHERE id = #{id}")
    User selectById(@Param("id") Long id);

    /**
     * 插入新用户
     * 用于用户注册功能
     *
     * @param user 用户实体对象
     * @return 受影响的行数
     */
    int insert(User user);

    /**
     * 根据ID更新用户信息
     * 用于修改用户信息
     *
     * @param user 用户实体对象
     * @return 受影响的行数
     */
    int updateById(User user);
}
