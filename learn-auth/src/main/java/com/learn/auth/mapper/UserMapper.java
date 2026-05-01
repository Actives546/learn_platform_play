package com.learn.auth.mapper;

import com.learn.common.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user WHERE user_name = #{userName}")
    User selectByUserName(@Param("userName") String userName);

    @Select("SELECT * FROM user WHERE id = #{id}")
    User selectById(@Param("id") Long id);

    int insert(User user);

    int updateById(User user);
}
