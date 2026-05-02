CREATE DATABASE IF NOT EXISTS learn_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE learn_platform;

CREATE TABLE IF NOT EXISTS user (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    user_name VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    nick_name VARCHAR(50) COMMENT '昵称',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    avatar VARCHAR(255) COMMENT '头像',
    role_id BIGINT DEFAULT 3 COMMENT '角色ID',
    status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    salt VARCHAR(64) COMMENT '盐值',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    create_by BIGINT COMMENT '创建人',
    update_by BIGINT COMMENT '更新人',
    INDEX idx_user_name (user_name),
    INDEX idx_phone (phone),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

CREATE TABLE IF NOT EXISTS role (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    role_name VARCHAR(50) NOT NULL COMMENT '角色名称',
    role_code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色编码',
    description VARCHAR(255) COMMENT '描述',
    status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

CREATE TABLE IF NOT EXISTS menu (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    parent_id BIGINT DEFAULT 0 COMMENT '父菜单ID',
    menu_name VARCHAR(50) NOT NULL COMMENT '菜单名称',
    path VARCHAR(255) COMMENT '路由路径',
    component VARCHAR(255) COMMENT '组件路径',
    icon VARCHAR(100) COMMENT '图标',
    menu_type TINYINT DEFAULT 1 COMMENT '菜单类型 1-目录 2-菜单 3-按钮',
    perms VARCHAR(255) COMMENT '权限标识',
    sort INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单表';

CREATE TABLE IF NOT EXISTS role_menu (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    menu_id BIGINT NOT NULL COMMENT '菜单ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_role_menu (role_id, menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色菜单关联表';

INSERT INTO role (id, role_name, role_code, description) VALUES
(1, '超级管理员', 'super_admin', '拥有所有权限'),
(2, '管理员', 'admin', '管理权限'),
(3, '普通用户', 'user', '普通用户权限');

INSERT INTO menu (id, parent_id, menu_name, path, component, icon, menu_type, perms, sort) VALUES
(1, 0, '首页', '/', 'pages/Home/index', 'HomeOutlined', 2, null, 1),
(2, 0, '教学管理', '/teaching', null, 'BookOutlined', 1, null, 2),
(3, 2, '课程列表', '/teaching/course', 'pages/Teaching/Course/index', 'UnorderedListOutlined', 2, 'teaching:course:list', 1),
(4, 2, '章节管理', '/teaching/chapter', 'pages/Teaching/Chapter/index', 'FileTextOutlined', 2, 'teaching:chapter:list', 2),
(5, 2, '题库管理', '/teaching/question', 'pages/Teaching/Question/index', 'QuestionCircleOutlined', 2, 'teaching:question:list', 3),
(6, 2, '教学计划', '/teaching/plan', 'pages/Teaching/Plan/index', 'ScheduleOutlined', 2, 'teaching:plan:list', 4),
(7, 0, '人员管理', '/personnel', null, 'TeamOutlined', 1, null, 3),
(8, 7, '学生管理', '/personnel/student', 'pages/Personnel/Student/index', 'UserOutlined', 2, 'personnel:student:list', 1),
(9, 7, '老师管理', '/personnel/teacher', 'pages/Personnel/Teacher/index', 'SolutionOutlined', 2, 'personnel:teacher:list', 2),
(10, 0, '学习进度', '/progress', null, 'LineChartOutlined', 1, null, 4),
(11, 10, '学习进度', '/progress/study', 'pages/Progress/Study/index', 'LineChartOutlined', 2, 'progress:study:list', 1),
(12, 10, '证书管理', '/progress/certificate', 'pages/Progress/Certificate/index', 'SafetyCertificateOutlined', 2, 'progress:certificate:list', 2),
(13, 10, '学习计划', '/progress/study-plan', 'pages/Progress/StudyPlan/index', 'ScheduleOutlined', 2, 'progress:study-plan:list', 3),
(14, 0, '数据分析', '/analysis', null, 'BarChartOutlined', 1, null, 5),
(15, 14, '学习统计', '/analysis/statistics', 'pages/Analysis/Statistics/index', 'PieChartOutlined', 2, 'analysis:statistics:list', 1),
(16, 14, '课程排行', '/analysis/ranking', 'pages/Analysis/Ranking/index', 'TrophyOutlined', 2, 'analysis:ranking:list', 2),
(17, 14, '成绩分析', '/analysis/score', 'pages/Analysis/Score/index', 'BarChartOutlined', 2, 'analysis:score:list', 3),
(18, 0, '菜单管理', '/menu', null, 'AppstoreOutlined', 1, null, 6),
(19, 18, '菜单管理', '/menu/management', 'pages/Menu/Management/index', 'UnorderedListOutlined', 2, 'menu:management:list', 1),
(20, 18, '角色授权管理', '/menu/role', 'pages/Menu/Role/index', 'SafetyOutlined', 2, 'menu:role:list', 2);

INSERT INTO role_menu (role_id, menu_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12), (1, 13), (1, 14), (1, 15), (1, 16), (1, 17), (1, 18), (1, 19), (1, 20),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11), (2, 12), (2, 13), (2, 14), (2, 15), (2, 16), (2, 17), (2, 18), (2, 19), (2, 20),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 10), (3, 11), (3, 12), (3, 13), (3, 14), (3, 15), (3, 16), (3, 17);
