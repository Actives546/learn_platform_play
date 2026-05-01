package com.learn.common.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserDTO {

    private Long id;

    @NotBlank(message = "用户名不能为空")
    private String userName;

    private String nickName;

    @NotBlank(message = "密码不能为空")
    private String password;

    private String phone;

    private String email;

    private String avatar;

    private Long roleId;

    private Integer status;
}
