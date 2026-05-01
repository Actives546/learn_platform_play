package com.learn.common.util;

import com.alibaba.ttl.TransmittableThreadLocal;

/**
 * 用户上下文工具类
 * 基于TransmittableThreadLocal实现用户信息的线程本地存储
 * 支持父子线程间的数据传递，适用于异步线程池场景
 *
 * @author learn-platform
 * @version 1.0.0
 */
public class UserContext {

    /**
     * 用户信息线程本地存储
     * 使用TransmittableThreadLocal确保在使用线程池时也能正确传递用户上下文
     */
    private static final TransmittableThreadLocal<UserInfo> USER_CONTEXT = new TransmittableThreadLocal<>();

    /**
     * 设置用户信息到当前线程上下文
     *
     * @param userInfo 用户信息对象
     */
    public static void setUserInfo(UserInfo userInfo) {
        USER_CONTEXT.set(userInfo);
    }

    /**
     * 从当前线程上下文获取用户信息
     *
     * @return 用户信息对象，如果没有设置则返回null
     */
    public static UserInfo getUserInfo() {
        return USER_CONTEXT.get();
    }

    /**
     * 获取当前登录用户ID
     *
     * @return 用户ID，如果用户信息不存在则返回null
     */
    public static Long getUserId() {
        UserInfo userInfo = getUserInfo();
        return userInfo != null ? userInfo.getUserId() : null;
    }

    /**
     * 获取当前登录用户名
     *
     * @return 用户名，如果用户信息不存在则返回null
     */
    public static String getUserName() {
        UserInfo userInfo = getUserInfo();
        return userInfo != null ? userInfo.getUserName() : null;
    }

    /**
     * 获取当前登录用户角色ID
     *
     * @return 角色ID，如果用户信息不存在则返回null
     */
    public static Long getRoleId() {
        UserInfo userInfo = getUserInfo();
        return userInfo != null ? userInfo.getRoleId() : null;
    }

    /**
     * 清除当前线程的用户上下文
     * 建议在请求处理完成后调用，防止内存泄漏
     */
    public static void clear() {
        USER_CONTEXT.remove();
    }

    /**
     * 用户信息内部类
     * 封装用户的核心身份信息
     */
    public static class UserInfo {
        /**
         * 用户ID
         */
        private Long userId;

        /**
         * 用户名
         */
        private String userName;

        /**
         * 角色ID
         */
        private Long roleId;

        public UserInfo() {
        }

        /**
         * 构造函数
         *
         * @param userId   用户ID
         * @param userName 用户名
         * @param roleId   角色ID
         */
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
