package com.learn.course;

import com.learn.common.config.RedissonConfig;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@MapperScan("com.learn.course.mapper")
@ComponentScan(basePackages = {"com.learn.course", "com.learn.common"})
@Import(RedissonConfig.class)
public class CourseApplication {

    public static void main(String[] args) {
        SpringApplication.run(CourseApplication.class, args);
    }
}
