package com.learn.gateway.filter;

import com.alibaba.fastjson.JSON;
import com.learn.common.constant.CommonConstant;
import com.learn.common.result.Result;
import com.learn.common.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

/**
 * 网关全局认证过滤器
 * 实现请求的统一认证和授权：
 * 1. 白名单URL直接放行（登录、注册、验证码等）
 * 2. 其他请求需要验证JWT Token
 * 3. 验证通过后将用户信息传递到下游服务
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
@Component
public class AuthGlobalFilter implements GlobalFilter, Ordered {

    /**
     * 响应式Redis模板
     * 用于在网关层验证用户登录状态
     */
    private final ReactiveStringRedisTemplate reactiveStringRedisTemplate;

    /**
     * 白名单URL列表
     * 这些URL不需要认证即可访问
     * - /auth/login: 用户登录
     * - /auth/register: 用户注册
     * - /auth/captcha: 图形验证码
     * - /error: 错误页面
     */
    private static final List<String> EXCLUDE_URLS = Arrays.asList(
            "/auth/login",
            "/auth/register",
            "/auth/captcha",
            "/error"
    );

    /**
     * 路径匹配器
     * 用于匹配请求URL是否在白名单中
     */
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    /**
     * 构造函数
     *
     * @param reactiveStringRedisTemplate 响应式Redis模板
     */
    public AuthGlobalFilter(ReactiveStringRedisTemplate reactiveStringRedisTemplate) {
        this.reactiveStringRedisTemplate = reactiveStringRedisTemplate;
    }

    /**
     * 过滤器核心方法
     * 执行请求的认证逻辑
     *
     * @param exchange 服务网络交换对象，包含请求和响应信息
     * @param chain    过滤器链，用于传递请求到下一个过滤器
     * @return Mono<Void> 响应式处理结果
     */
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();
        String path = request.getPath().value();
        String method = request.getMethod().name();

        log.info("网关接收到请求: {} {}", method, path);

        // 1. 检查是否为白名单URL，如果是则直接放行
        if (isExcludeUrl(path)) {
            log.debug("白名单URL，直接放行: {}", path);
            return chain.filter(exchange);
        }

        // 2. 从请求中获取Token
        String token = getToken(request);
        if (!StringUtils.hasText(token)) {
            log.warn("请求未携带Token，拒绝访问: {}", path);
            return unauthorizedResponse(response, "未登录或登录已过期");
        }

        // 3. 验证Token有效性
        try {
            if (!JwtUtil.validateToken(token)) {
                log.warn("Token验证失败: {}", path);
                return unauthorizedResponse(response, "token无效");
            }

            // 4. 从Token中解析用户信息
            Long userId = JwtUtil.getUserId(token);
            String userName = JwtUtil.getUserName(token);
            log.debug("Token解析成功: userId={}, userName={}", userId, userName);

            // 5. 检查用户是否在Redis中有登录记录（防止Token被盗用）
            String redisKey = CommonConstant.LOGIN_USER_KEY + userId;

            return reactiveStringRedisTemplate.hasKey(redisKey)
                    .flatMap(exists -> {
                        if (!exists) {
                            log.warn("用户登录信息已过期: userId={}", userId);
                            return unauthorizedResponse(response, "登录已过期，请重新登录");
                        }

                        // 6. 将用户信息添加到请求头，传递给下游服务
                        ServerHttpRequest newRequest = request.mutate()
                                .header(CommonConstant.USER_ID, String.valueOf(userId))
                                .header(CommonConstant.USER_NAME, userName)
                                .build();

                        log.info("认证通过，转发请求到下游服务: userId={}, path={}", userId, path);
                        return chain.filter(exchange.mutate().request(newRequest).build());
                    })
                    .onErrorResume(e -> {
                        log.error("Token验证过程中发生错误: {}", e.getMessage());
                        return unauthorizedResponse(response, "token验证失败");
                    });
        } catch (Exception e) {
            log.error("Token解析失败: {}", e.getMessage());
            return unauthorizedResponse(response, "token解析失败");
        }
    }

    /**
     * 检查URL是否在白名单中
     *
     * @param path 请求路径
     * @return true-在白名单中，false-不在白名单中
     */
    private boolean isExcludeUrl(String path) {
        return EXCLUDE_URLS.stream()
                .anyMatch(url -> pathMatcher.match(url, path));
    }

    /**
     * 从请求中获取Token
     * 优先从Authorization请求头获取，其次从请求参数获取
     *
     * @param request HTTP请求对象
     * @return Token字符串，如果没有则返回null
     */
    private String getToken(ServerHttpRequest request) {
        // 1. 从Authorization请求头获取（Bearer token格式）
        String header = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(header) && header.startsWith(CommonConstant.TOKEN_PREFIX)) {
            return header.substring(CommonConstant.TOKEN_PREFIX.length());
        }

        // 2. 从请求参数获取（兼容某些场景）
        String param = request.getQueryParams().getFirst("token");
        if (StringUtils.hasText(param)) {
            return param;
        }

        return null;
    }

    /**
     * 构建未授权响应
     * 当认证失败时返回401状态码和错误信息
     *
     * @param response HTTP响应对象
     * @param message  错误消息
     * @return Mono<Void> 响应式处理结果
     */
    private Mono<Void> unauthorizedResponse(ServerHttpResponse response, String message) {
        // 设置响应状态码为401 Unauthorized
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        // 设置响应内容类型为JSON
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        // 构建统一的错误响应格式
        Result<Void> result = Result.error(401, message);
        String json = JSON.toJSONString(result);
        DataBuffer buffer = response.bufferFactory().wrap(json.getBytes(StandardCharsets.UTF_8));

        // 写入响应并返回
        return response.writeWith(Mono.just(buffer));
    }

    /**
     * 获取过滤器执行顺序
     * 数值越小，优先级越高
     * -100 表示在大多数过滤器之前执行
     *
     * @return 执行顺序值
     */
    @Override
    public int getOrder() {
        return -100;
    }
}
