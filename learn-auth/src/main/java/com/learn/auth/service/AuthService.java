package com.learn.auth.service;

import com.learn.common.dto.LoginDTO;
import com.learn.common.dto.UserDTO;
import com.learn.common.result.Result;

import java.util.Map;

public interface AuthService {

    Result<Map<String, Object>> login(LoginDTO loginDTO);

    Result<Void> register(UserDTO userDTO);

    Result<Void> logout(Long userId);

    Result<Map<String, Object>> getUserInfo(Long userId);

    Result<String> getCaptcha(String uuid);
}
