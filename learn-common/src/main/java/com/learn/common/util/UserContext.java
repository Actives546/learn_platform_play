package com.learn.common.util;

import com.alibaba.ttl.TransmittableThreadLocal;

public class UserContext {

    private static final TransmittableThreadLocal<UserInfo> USER_CONTEXT = new TransmittableThreadLocal<>();

    public static void setUserInfo(UserInfo userInfo) {
        USER_CONTEXT.set(userInfo);
    }

    public static UserInfo getUserInfo() {
        return USER_CONTEXT.get();
    }

    public static Long getUserId() {
        UserInfo userInfo = getUserInfo();
        return userInfo != null ? userInfo.getUserId() : null;
    }

    public static String getUserName() {
        UserInfo userInfo = getUserInfo();
        return userInfo != null ? userInfo.getUserName() : null;
    }

    public static Long getRoleId() {
        UserInfo userInfo = getUserInfo();
        return userInfo != null ? userInfo.getRoleId() : null;
    }

    public static void clear() {
        USER_CONTEXT.remove();
    }

    public static class UserInfo {
        private Long userId;
        private String userName;
        private Long roleId;

        public UserInfo() {
        }

        public UserInfo(Long userId, String userName, Long roleId) {
            this.userId = userId;
            this.userName = userName;
            this.roleId = roleId;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public Long getRoleId() {
            return roleId;
        }

        public void setRoleId(Long roleId) {
            this.roleId = roleId;
        }
    }
}
