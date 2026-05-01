package com.learn.auth.interceptor;

import com.learn.common.constant.CommonConstant;
import com.learn.common.util.UserContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
public class UserContextInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String userIdStr = request.getHeader(CommonConstant.USER_ID);
        String userName = request.getHeader(CommonConstant.USER_NAME);
        String roleIdStr = request.getHeader(CommonConstant.ROLE_ID);

        if (StringUtils.hasText(userIdStr)) {
            try {
                Long userId = Long.parseLong(userIdStr);
                Long roleId = null;
                if (StringUtils.hasText(roleIdStr)) {
                    roleId = Long.parseLong(roleIdStr);
                }
                UserContext.setUserInfo(new UserContext.UserInfo(userId, userName, roleId));
            } catch (NumberFormatException e) {
                log.warn("解析用户ID失败: {}", userIdStr);
            }
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        UserContext.clear();
    }
}
