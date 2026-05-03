package com.learn.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperFactoryBean;

/**
 * Jackson配置类
 * 解决Long类型ID在JavaScript中精度丢失的问题
 * 将Long类型序列化为String类型
 *
 * @author learn-platform
 * @version 1.0.0
 */
@Configuration
public class JacksonConfig {

    /**
     * 配置ObjectMapper
     * 将Long类型序列化为String，避免JavaScript中精度丢失
     *
     * @return ObjectMapper
     */
    @Bean
    @Primary
    @ConditionalOnMissingBean(ObjectMapper.class)
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        
        // 注册JavaTimeModule以支持Java 8时间类型
        objectMapper.registerModule(new JavaTimeModule());
        
        // 禁用将日期写为时间戳的功能
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        // 创建一个模块，用于序列化Long类型为String
        SimpleModule simpleModule = new SimpleModule();
        
        // 将Long类型序列化为String
        simpleModule.addSerializer(Long.class, ToStringSerializer.instance);
        simpleModule.addSerializer(Long.TYPE, ToStringSerializer.instance);
        
        // 注册模块
        objectMapper.registerModule(simpleModule);
        
        return objectMapper;
    }
}
