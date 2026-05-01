package com.learn.common.result;

import lombok.Data;

import java.io.Serializable;

/**
 * 统一响应结果类
 * 用于封装所有HTTP接口的响应数据，实现前后端数据交互的统一格式
 * 包含响应状态码、响应消息和响应数据三个核心字段
 *
 * @param <T> 响应数据的泛型类型
 * @author learn-platform
 * @version 1.0.0
 */
@Data
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 响应状态码
     * 200 - 成功
     * 401 - 未授权/未登录
     * 403 - 无权限访问
     * 500 - 服务器内部错误
     * 其他 - 业务自定义错误码
     */
    private Integer code;

    /**
     * 响应消息
     * 用于描述请求处理的结果信息
     */
    private String message;

    /**
     * 响应数据
     * 存储接口返回的具体业务数据
     */
    private T data;

    /**
     * 构建成功响应（无数据）
     *
     * @param <T> 数据类型
     * @return 成功响应结果
     */
    public static <T> Result<T> success() {
        return success(null);
    }

    /**
     * 构建成功响应（带数据）
     * 默认消息为"操作成功"
     *
     * @param data 响应数据
     * @param <T>  数据类型
     * @return 成功响应结果
     */
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage("操作成功");
        result.setData(data);
        return result;
    }

    /**
     * 构建成功响应（自定义消息和数据）
     *
     * @param message 自定义成功消息
     * @param data    响应数据
     * @param <T>     数据类型
     * @return 成功响应结果
     */
    public static <T> Result<T> success(String message, T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage(message);
        result.setData(data);
        return result;
    }

    /**
     * 构建错误响应（默认错误码500）
     *
     * @param message 错误消息
     * @param <T>     数据类型
     * @return 错误响应结果
     */
    public static <T> Result<T> error(String message) {
        return error(500, message);
    }

    /**
     * 构建错误响应（自定义错误码和消息）
     *
     * @param code    自定义错误码
     * @param message 错误消息
     * @param <T>     数据类型
     * @return 错误响应结果
     */
    public static <T> Result<T> error(Integer code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        return result;
    }
}
