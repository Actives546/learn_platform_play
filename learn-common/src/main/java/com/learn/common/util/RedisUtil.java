package com.learn.common.util;

import lombok.RequiredArgsConstructor;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class RedisUtil {

    private final RedissonClient redissonClient;

    public <T> void set(String key, T value) {
        RBucket<T> bucket = redissonClient.getBucket(key);
        bucket.set(value);
    }

    public <T> void set(String key, T value, long timeout, TimeUnit unit) {
        RBucket<T> bucket = redissonClient.getBucket(key);
        bucket.set(value, timeout, unit);
    }

    @SuppressWarnings("unchecked")
    public <T> T get(String key) {
        RBucket<T> bucket = redissonClient.getBucket(key);
        return bucket.get();
    }

    public boolean exists(String key) {
        RBucket<Object> bucket = redissonClient.getBucket(key);
        return bucket.isExists();
    }

    public boolean delete(String key) {
        RBucket<Object> bucket = redissonClient.getBucket(key);
        return bucket.delete();
    }

    public boolean expire(String key, long timeout, TimeUnit unit) {
        RBucket<Object> bucket = redissonClient.getBucket(key);
        return bucket.expire(timeout, unit);
    }

    public long getExpire(String key) {
        RBucket<Object> bucket = redissonClient.getBucket(key);
        return bucket.remainTimeToLive();
    }

    public <T> boolean setIfAbsent(String key, T value) {
        @SuppressWarnings("unchecked")
        RBucket<T> bucket = (RBucket<T>) redissonClient.getBucket(key);
        return bucket.setIfAbsent(value);
    }

    public <T> boolean setIfAbsent(String key, T value, long timeout, TimeUnit unit) {
        @SuppressWarnings("unchecked")
        RBucket<T> bucket = (RBucket<T>) redissonClient.getBucket(key);
        return bucket.setIfAbsent(value, timeout, unit);
    }
}
