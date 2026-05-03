USE learn_platform;

CREATE TABLE IF NOT EXISTS chapter (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    course_id BIGINT NOT NULL COMMENT '课程ID，关联course表的主键ID',
    chapter_name VARCHAR(200) NOT NULL COMMENT '章节名称',
    description TEXT COMMENT '章节描述',
    sort INT DEFAULT 0 COMMENT '排序，数值越小越靠前',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除标志 0-未删除 1-已删除',
    INDEX idx_course_id (course_id),
    INDEX idx_create_time (create_time),
    INDEX idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='章节表';

INSERT INTO chapter (id, course_id, chapter_name, description, sort, create_time, update_time, is_deleted) VALUES
(2001, 1001, 'Java基础入门', '介绍Java语言的起源、特点、环境搭建与第一个Java程序', 1, NOW(), NOW(), 0),
(2002, 1001, '变量与数据类型', '详解Java中的基本数据类型、变量声明与使用规范', 2, NOW(), NOW(), 0),
(2003, 1001, '运算符与表达式', '介绍Java中的各种运算符、优先级与表达式运算', 3, NOW(), NOW(), 0),
(2004, 1001, '流程控制语句', '详解if-else、switch、for、while、do-while等流程控制语句', 4, NOW(), NOW(), 0),
(2005, 1001, '数组的定义与使用', '介绍一维数组、二维数组的声明、初始化与遍历', 5, NOW(), NOW(), 0),
(2006, 1001, '面向对象编程基础', '理解类与对象、成员变量与方法的概念', 6, NOW(), NOW(), 0),
(2007, 1001, '封装与继承', '详解访问修饰符、this关键字、super关键字、继承特性', 7, NOW(), NOW(), 0),
(2008, 1001, '多态与抽象类', '介绍方法重写、向上转型、抽象类与接口的概念', 8, NOW(), NOW(), 0),

(2009, 1002, 'Spring Boot快速入门', '介绍Spring Boot的优势、环境搭建与第一个Spring Boot应用', 1, NOW(), NOW(), 0),
(2010, 1002, '自动配置原理', '深入理解Spring Boot的自动配置机制与starter组件', 2, NOW(), NOW(), 0),
(2011, 1002, 'Web开发基础', '介绍Spring MVC、RESTful API设计与参数绑定', 3, NOW(), NOW(), 0),
(2012, 1002, '数据访问层', '详解Spring Data JPA、MyBatis集成与事务管理', 4, NOW(), NOW(), 0),

(2013, 1003, 'MySQL基础入门', '介绍MySQL数据库的安装、配置与基本概念', 1, NOW(), NOW(), 0),
(2014, 1003, 'SQL基础语法', '详解SELECT、INSERT、UPDATE、DELETE语句的使用', 2, NOW(), NOW(), 0),
(2015, 1003, '条件查询与排序', '介绍WHERE子句、ORDER BY、LIMIT等查询技巧', 3, NOW(), NOW(), 0),
(2016, 1003, '聚合函数与分组', '详解COUNT、SUM、AVG等聚合函数与GROUP BY分组', 4, NOW(), NOW(), 0),

(2017, 1004, 'Vue.js基础入门', '介绍Vue.js的核心概念、安装方式与第一个Vue应用', 1, NOW(), NOW(), 0),
(2018, 1004, '模板语法', '详解插值、指令、事件处理等模板语法', 2, NOW(), NOW(), 0),
(2019, 1004, '组件化开发', '介绍组件的注册、通信、插槽等核心概念', 3, NOW(), NOW(), 0),
(2020, 1004, 'Vue Router路由管理', '详解路由配置、导航守卫、动态路由等', 4, NOW(), NOW(), 0),

(2021, 1005, 'Python基础入门', '介绍Python环境搭建、变量与数据类型', 1, NOW(), NOW(), 0),
(2022, 1005, 'NumPy数值计算', '详解NumPy数组、矩阵运算、广播机制', 2, NOW(), NOW(), 0),
(2023, 1005, 'Pandas数据处理', '介绍Series、DataFrame、数据清洗与转换', 3, NOW(), NOW(), 0),
(2024, 1005, 'Matplotlib数据可视化', '详解折线图、柱状图、散点图、热力图等', 4, NOW(), NOW(), 0),

(2025, 1006, '微服务架构概述', '介绍微服务架构的概念、优势与设计原则', 1, NOW(), NOW(), 0),
(2026, 1006, '服务拆分策略', '详解服务拆分的方法论与最佳实践', 2, NOW(), NOW(), 0),
(2027, 1006, 'API网关设计', '介绍API网关的作用、选型与实现方案', 3, NOW(), NOW(), 0),
(2028, 1006, '服务发现与注册', '详解服务注册中心的原理与实现', 4, NOW(), NOW(), 0),

(2029, 1007, 'Redis基础入门', '介绍Redis的安装配置与基本数据结构', 1, NOW(), NOW(), 0),
(2030, 1007, 'Redis数据结构详解', '详解String、List、Set、Hash、ZSet等数据结构', 2, NOW(), NOW(), 0),
(2031, 1007, 'Redis持久化机制', '介绍RDB与AOF持久化策略', 3, NOW(), NOW(), 0),
(2032, 1007, 'Redis集群部署', '详解主从复制、哨兵模式与Cluster集群', 4, NOW(), NOW(), 0),

(2033, 1008, 'Docker基础入门', '介绍Docker的概念、安装与核心组件', 1, NOW(), NOW(), 0),
(2034, 1008, 'Docker镜像与容器', '详解镜像构建、容器操作与数据管理', 2, NOW(), NOW(), 0),
(2035, 1008, 'Dockerfile编写', '介绍Dockerfile的语法与最佳实践', 3, NOW(), NOW(), 0),
(2036, 1008, 'Docker Compose编排', '详解多容器应用的编排与管理', 4, NOW(), NOW(), 0);
