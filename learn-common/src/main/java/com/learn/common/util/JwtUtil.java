package com.learn.common.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Slf4j
public class JwtUtil {

    private static final String SECRET = "learn-platform-jwt-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm";

    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    public static String createToken(Map<String, Object> claims, long ttlMillis) {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        Date exp = new Date(nowMillis + ttlMillis);

        return Jwts.builder()
                .claims(claims)
                .issuedAt(now)
                .expiration(exp)
                .signWith(SECRET_KEY)
                .compact();
    }

    public static Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            log.error("token已过期: {}", e.getMessage());
            throw new RuntimeException("token已过期");
        } catch (UnsupportedJwtException e) {
            log.error("不支持的token格式: {}", e.getMessage());
            throw new RuntimeException("不支持的token格式");
        } catch (MalformedJwtException e) {
            log.error("token格式错误: {}", e.getMessage());
            throw new RuntimeException("token格式错误");
        } catch (SecurityException e) {
            log.error("token签名验证失败: {}", e.getMessage());
            throw new RuntimeException("token签名验证失败");
        } catch (IllegalArgumentException e) {
            log.error("token不能为空: {}", e.getMessage());
            throw new RuntimeException("token不能为空");
        }
    }

    public static boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            log.warn("token验证失败: {}", e.getMessage());
            return false;
        }
    }

    public static Long getUserId(String token) {
        Claims claims = parseToken(token);
        return claims.get("userId", Long.class);
    }

    public static String getUserName(String token) {
        Claims claims = parseToken(token);
        return claims.get("userName", String.class);
    }

    public static Long getRoleId(String token) {
        Claims claims = parseToken(token);
        return claims.get("roleId", Long.class);
    }
}
