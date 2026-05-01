package com.learn.gateway.filter;

import com.alibaba.fastjson.JSON;
import com.learn.common.constant.CommonConstant;
import com.learn.common.result.Result;
import com.learn.common.util.JwtUtil;
import com.learn.common.util.RedisUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
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

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthGlobalFilter implements GlobalFilter, Ordered {

    private final RedisUtil redisUtil;

    private static final List<String> EXCLUDE_URLS = Arrays.asList(
            "/auth/login",
            "/auth/register",
            "/auth/captcha",
            "/error"
    );

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();
        String path = request.getPath().value();
        String method = request.getMethod().name();

        log.info("网关接收到请求: {} {}", method, path);

        if (isExcludeUrl(path)) {
            return chain.filter(exchange);
        }

        String token = getToken(request);
        if (!StringUtils.hasText(token)) {
            return unauthorizedResponse(response, "未登录或登录已过期");
        }

        try {
            if (!JwtUtil.validateToken(token)) {
                return unauthorizedResponse(response, "token无效");
            }

            Long userId = JwtUtil.getUserId(token);
            String redisKey = CommonConstant.LOGIN_USER_KEY + userId;

            if (!redisUtil.exists(redisKey)) {
                return unauthorizedResponse(response, "登录已过期，请重新登录");
            }

            ServerHttpRequest newRequest = request.mutate()
                    .header(CommonConstant.USER_ID, String.valueOf(userId))
                    .header(CommonConstant.USER_NAME, JwtUtil.getUserName(token))
                    .build();

            return chain.filter(exchange.mutate().request(newRequest).build());
        } catch (Exception e) {
            log.error("token解析失败: {}", e.getMessage());
            return unauthorizedResponse(response, "token解析失败");
        }
    }

    private boolean isExcludeUrl(String path) {
        return EXCLUDE_URLS.stream().anyMatch(url -> pathMatcher.match(url, path));
    }

    private String getToken(ServerHttpRequest request) {
        String header = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(header) && header.startsWith(CommonConstant.TOKEN_PREFIX)) {
            return header.substring(CommonConstant.TOKEN_PREFIX.length());
        }
        String param = request.getQueryParams().getFirst("token");
        if (StringUtils.hasText(param)) {
            return param;
        }
        return null;
    }

    private Mono<Void> unauthorizedResponse(ServerHttpResponse response, String message) {
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        Result<Void> result = Result.error(401, message);
        String json = JSON.toJSONString(result);
        DataBuffer buffer = response.bufferFactory().wrap(json.getBytes(StandardCharsets.UTF_8));

        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
