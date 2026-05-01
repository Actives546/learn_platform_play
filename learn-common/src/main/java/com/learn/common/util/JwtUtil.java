package com.learn.common.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

/**
 * JWT工具类
 * 提供JWT Token的生成、解析、验证等核心功能
 * 使用JJWT库实现，采用HS256签名算法
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Slf4j
public class JwtUtil {

    /**
     * JWT签名密钥
     * 必须至少256位（32个字符）以满足HS256算法要求
     * 生产环境建议配置在环境变量或配置中心，不要硬编码
     */
    private static final String SECRET = "learn-platform-jwt-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm";

    /**
     * JWT签名密钥对象
     * 使用HMAC SHA-256算法
     */
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    /**
     * 生成JWT Token
     *
     * @param claims    Token载荷信息，包含用户ID、用户名、角色ID等
     * @param ttlMillis Token过期时间（毫秒）
     * @return 生成的JWT Token字符串
     */
    public static String createToken(Map<String, Object> claims, long ttlMillis) {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        // 计算过期时间
        Date exp = new Date(nowMillis + ttlMillis);

        return Jwts.builder()
                .claims(claims)           // 设置载荷信息
                .issuedAt(now)             // 设置签发时间
                .expiration(exp)           // 设置过期时间
                .signWith(SECRET_KEY)      // 设置签名密钥
                .compact();                // 生成Token字符串
    }

    /**
     * 解析JWT Token
     * 验证Token的签名和有效性，并返回载荷信息
     *
     * @param token JWT Token字符串
     * @return Token载荷Claims对象
     * @throws RuntimeException 如果Token无效、过期或格式错误
     */
    public static Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(SECRET_KEY)    // 设置验证密钥
                    .build()
                    .parseSignedClaims(token)   // 解析并验证Token
                    .getPayload();              // 获取载荷信息
        } catch (ExpiredJwtException e) {
            log.error("Token已过期: {}", e.getMessage());
            throw new RuntimeException("token已过期");
        } catch (UnsupportedJwtException e) {
            log.error("不支持的Token格式: {}", e.getMessage());
            throw new RuntimeException("不支持的token格式");
        } catch (MalformedJwtException e) {
            log.error("Token格式错误: {}", e.getMessage());
            throw new RuntimeException("token格式错误");
        } catch (SecurityException e) {
            log.error("Token签名验证失败: {}", e.getMessage());
            throw new RuntimeException("token签名验证失败");
        } catch (IllegalArgumentException e) {
            log.error("Token不能为空: {}", e.getMessage());
            throw new RuntimeException("token不能为空");
        }
    }

    /**
     * 验证JWT Token是否有效
     *
     * @param token JWT Token字符串
     * @return true-有效，false-无效
     */
    public static boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            log.warn("Token验证失败: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 从Token中获取用户ID
     *
     * @param token JWT Token字符串
     * @return 用户ID
     */
    public static Long getUserId(String token) {
        Claims claims = parseToken(token);
        return claims.get("userId", Long.class);
    }

    /**
     * 从Token中获取用户名
     *
     * @param token JWT Token字符串
     * @return 用户名
     */
    public static String getUserName(String token) {
        Claims claims = parseToken(token);
        return claims.get("userName", String.class);
    }

    /**
     * 从Token中获取角色ID
     *
     * @param token JWT Token字符串
     * @return 角色ID
     */
    public static Long getRoleId(String token) {
        Claims claims = parseToken(token);
        return claims.get("roleId", Long.class);
    }
}
