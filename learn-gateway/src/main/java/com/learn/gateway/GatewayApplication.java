package com.learn.gateway;

import com.learn.common.config.RedissonConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;

@SpringBootApplication(excludeName = {
        "org.redisson.spring.starter.RedissonAutoConfigurationV2"
})
@EnableDiscoveryClient
@ComponentScan(
        basePackages = {"com.learn.gateway", "com.learn.common"},
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = {com.learn.common.exception.GlobalExceptionHandler.class}
        )
)
@Import(RedissonConfig.class)
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
