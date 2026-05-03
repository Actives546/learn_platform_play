USE learn_platform;

CREATE TABLE IF NOT EXISTS teaching_plan (
    id BIGINT PRIMARY KEY COMMENT '主键ID（雪花算法）',
    course_id BIGINT NOT NULL COMMENT '课程ID（关联course表）',
    plan_name VARCHAR(200) NOT NULL COMMENT '计划名称',
    description TEXT COMMENT '计划描述',
    start_time DATETIME COMMENT '开始时间',
    end_time DATETIME COMMENT '结束时间',
    weekly_schedule VARCHAR(500) COMMENT '每周课时安排（JSON格式）',
    progress INT DEFAULT 0 COMMENT '教学进度（百分比，0-100）',
    status TINYINT DEFAULT 0 COMMENT '状态（0-未开始 1-进行中 2-已完成 3-已暂停）',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '逻辑删除标志（0-未删除 1-已删除）',
    INDEX idx_course_id (course_id),
    INDEX idx_plan_name (plan_name),
    INDEX idx_status (status),
    INDEX idx_progress (progress)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='教学计划表';

INSERT INTO teaching_plan (id, course_id, plan_name, description, start_time, end_time, weekly_schedule, progress, status, create_time, update_time, is_deleted) VALUES
(2001, 1001, 'Java基础阶段教学计划', '本计划针对Java基础阶段的教学安排，包括Java语法基础、面向对象编程、集合框架等核心内容。', '2024-06-01 09:00:00', '2024-08-31 18:00:00', '{"周一": 2, "周三": 2, "周五": 2}', 65, 1, NOW(), NOW(), 0),
(2002, 1001, 'Java进阶阶段教学计划', '深入学习Java高级特性，包括多线程、IO流、网络编程、反射机制等内容。', '2024-09-01 09:00:00', '2024-12-31 18:00:00', '{"周二": 2, "周四": 2, "周六": 1}', 20, 0, NOW(), NOW(), 0),
(2003, 1002, 'Spring Boot核心教学计划', '系统学习Spring Boot框架，包括自动配置、Starter组件、数据访问等核心功能。', '2024-05-15 09:00:00', '2024-07-15 18:00:00', '{"周一": 3, "周三": 3}', 100, 2, NOW(), NOW(), 0),
(2004, 1002, 'Spring Boot微服务教学计划', '深入学习Spring Boot微服务开发，包括服务注册发现、配置中心、链路追踪等。', '2024-07-20 09:00:00', '2024-10-20 18:00:00', '{"周二": 2, "周四": 2, "周五": 2}', 45, 1, NOW(), NOW(), 0),
(2005, 1003, 'MySQL基础教学计划', 'MySQL数据库基础教学，包括SQL语法、表设计、数据操作等基础内容。', '2024-04-01 09:00:00', '2024-06-01 18:00:00', '{"周一": 2, "周四": 2}', 100, 2, NOW(), NOW(), 0),
(2006, 1003, 'MySQL高级教学计划', 'MySQL高级特性学习，包括索引优化、事务处理、存储过程、主从复制等。', '2024-06-10 09:00:00', '2024-09-10 18:00:00', '{"周三": 3, "周六": 2}', 70, 1, NOW(), NOW(), 0),
(2007, 1004, 'Vue.js基础教学计划', 'Vue.js框架基础教学，包括Vue实例、组件化开发、Vue Router等核心内容。', '2024-05-01 09:00:00', '2024-07-01 18:00:00', '{"周二": 2, "周四": 2}', 100, 2, NOW(), NOW(), 0),
(2008, 1004, 'Vue.js进阶教学计划', 'Vue.js高级特性学习，包括Vuex状态管理、组件设计模式、性能优化等。', '2024-07-15 09:00:00', '2024-10-15 18:00:00', '{"周一": 2, "周三": 2, "周五": 1}', 35, 1, NOW(), NOW(), 0),
(2009, 1006, '微服务架构设计教学计划', '微服务架构设计原则与实践，包括服务拆分策略、API网关、服务治理等。', '2024-06-15 09:00:00', '2024-09-15 18:00:00', '{"周一": 2, "周三": 2, "周五": 2}', 55, 1, NOW(), NOW(), 0),
(2010, 1018, 'React基础教学计划', 'React框架基础教学，包括JSX语法、组件生命周期、Hooks等核心概念。', '2024-08-01 09:00:00', '2024-11-01 18:00:00', '{"周二": 2, "周四": 2, "周六": 1}', 10, 0, NOW(), NOW(), 0);
