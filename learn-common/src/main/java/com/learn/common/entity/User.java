package com.learn.common.entity;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class User implements Serializable {

    private Long id;

    private String userName;

    private String password;

    private String nickName;

    private String phone;

    private String email;

    private String avatar;

    private Long roleId;

    private Integer status;

    private String salt;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    private Long createBy;

    private Long updateBy;
}
