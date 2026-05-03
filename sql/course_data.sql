USE learn_platform;

CREATE TABLE IF NOT EXISTS course (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    course_name VARCHAR(200) NOT NULL COMMENT '课程名称',
    cover VARCHAR(500) COMMENT '课程封面',
    description TEXT COMMENT '课程描述',
    teacher_id BIGINT COMMENT '讲师ID',
    lesson_count INT DEFAULT 0 COMMENT '课时数',
    status TINYINT DEFAULT 0 COMMENT '课程状态 0-草稿 1-已上架 2-已下架',
    sort INT DEFAULT 0 COMMENT '排序',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_course_name (course_name),
    INDEX idx_status (status),
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程表';

INSERT INTO course (id, course_name, cover, description, teacher_id, lesson_count, status, sort, create_time, update_time) VALUES
(1001, 'Java编程入门到精通', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Java%E7%BC%96%E7%A8%8B%E5%85%A5%E9%97%A8%E8%AF%BE%E7%A8%8B%E5%B0%81%E9%9D%A2&image_size=square', '本课程从Java基础开始，循序渐进地带领学员掌握Java核心技术，包括面向对象、集合框架、IO流、多线程等核心知识点。', 1, 48, 1, 1, NOW(), NOW()),
(1002, 'Spring Boot企业级应用开发', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Spring%20Boot%E4%BC%81%E4%B8%9A%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E8%AF%BE%E7%A8%8B&image_size=square', '深入讲解Spring Boot框架，包括自动配置原理、Starter组件、数据访问、Web开发、安全控制等企业级开发技术。', 1, 36, 1, 2, NOW(), NOW()),
(1003, 'MySQL数据库实战教程', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=MySQL%E6%95%B0%E6%8D%AE%E5%BA%93%E5%AE%9E%E6%88%98%E6%95%99%E7%A8%8B&image_size=square', '从SQL基础到高级查询，全面讲解MySQL数据库的使用与优化，包括索引原理、事务处理、存储过程等核心内容。', 2, 24, 1, 3, NOW(), NOW()),
(1004, 'Vue.js前端开发实战', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Vue.js%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98&image_size=square', '从零开始学习Vue.js框架，掌握组件化开发、Vue Router、Vuex状态管理等核心技术，打造高性能前端应用。', 2, 32, 1, 4, NOW(), NOW()),
(1005, 'Python数据分析与可视化', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E4%B8%8E%E5%8F%AF%E8%A7%86%E5%8C%96&image_size=square', '使用Python进行数据分析，学习NumPy、Pandas、Matplotlib等库的使用，掌握数据清洗、分析和可视化技能。', 3, 28, 1, 5, NOW(), NOW()),
(1006, '微服务架构设计与实践', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E8%B7%B5&image_size=square', '深入讲解微服务架构设计原则，包括服务拆分、API网关、服务发现、配置中心、链路追踪等核心技术。', 1, 40, 1, 6, NOW(), NOW()),
(1007, 'Redis高性能缓存实战', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Redis%E9%AB%98%E6%80%A7%E8%83%BD%E7%BC%93%E5%AD%98%E5%AE%9E%E6%88%98&image_size=square', '全面讲解Redis的使用与原理，包括数据结构、持久化、集群部署、缓存设计与优化等实战技巧。', 2, 20, 0, 7, NOW(), NOW()),
(1008, 'Docker容器化部署实战', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Docker%E5%AE%B9%E5%99%A8%E5%8C%96%E9%83%A8%E7%BD%B2%E5%AE%9E%E6%88%98&image_size=square', '从Docker基础到Kubernetes编排，全面掌握容器化部署技术，实现应用的快速交付与自动化运维。', 3, 30, 1, 8, NOW(), NOW()),
(1009, 'Git版本控制与团队协作', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Git%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6%E4%B8%8E%E5%9B%A2%E9%98%9F%E5%8D%8F%E4%BD%9C&image_size=square', '学习Git的核心概念与命令，掌握分支管理、代码合并、冲突解决等技能，提升团队协作效率。', 2, 16, 2, 9, NOW(), NOW()),
(1010, 'JavaScript高级编程', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=JavaScript%E9%AB%98%E7%BA%A7%E7%BC%96%E7%A8%8B&image_size=square', '深入理解JavaScript核心机制，包括闭包、原型链、异步编程、ES6+新特性等高级内容。', 2, 35, 1, 10, NOW(), NOW()),
(1011, 'Node.js后端开发', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Node.js%E5%90%8E%E7%AB%AF%E5%BC%80%E5%8F%91&image_size=square', '使用Node.js构建高性能后端服务，学习Express框架、数据库操作、RESTful API设计等核心技能。', 3, 25, 1, 11, NOW(), NOW()),
(1012, 'TypeScript从入门到精通', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=TypeScript%E4%BB%8E%E5%85%A5%E9%97%A8%E5%88%B0%E7%B2%BE%E9%80%9A&image_size=square', '学习TypeScript的类型系统、接口、泛型等特性，掌握在大型项目中使用TypeScript的最佳实践。', 2, 22, 0, 12, NOW(), NOW()),
(1013, 'Linux系统运维实战', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Linux%E7%B3%BB%E7%BB%9F%E8%BF%90%E7%BB%B4%E5%AE%9E%E6%88%98&image_size=square', '掌握Linux系统的基本操作、Shell脚本编写、服务配置、性能监控等运维技能。', 3, 28, 1, 13, NOW(), NOW()),
(1014, 'Nginx高性能Web服务器', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Nginx%E9%AB%98%E6%80%A7%E8%83%BDWeb%E6%9C%8D%E5%8A%A1%E5%99%A8&image_size=square', '深入学习Nginx的配置、反向代理、负载均衡、动静分离等核心功能，构建高性能Web服务。', 3, 18, 1, 14, NOW(), NOW()),
(1015, 'MongoDB非关系型数据库', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=MongoDB%E9%9D%9E%E5%85%B3%E7%B3%BB%E5%9E%8B%E6%95%B0%E6%8D%AE%E5%BA%93&image_size=square', '学习MongoDB文档数据库的使用，包括CRUD操作、聚合管道、索引优化、集群部署等内容。', 2, 20, 0, 15, NOW(), NOW()),
(1016, 'Elasticsearch搜索引擎', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Elasticsearch%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E&image_size=square', '掌握Elasticsearch的核心概念与使用，包括文档操作、查询DSL、聚合分析、集群管理等。', 1, 24, 1, 16, NOW(), NOW()),
(1017, 'RabbitMQ消息中间件', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=RabbitMQ%E6%B6%88%E6%81%AF%E4%B8%AD%E9%97%B4%E4%BB%B6&image_size=square', '学习消息队列的核心概念，掌握RabbitMQ的安装配置、消息模式、高级特性与实战应用。', 1, 16, 2, 17, NOW(), NOW()),
(1018, 'React前端框架开发', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=React%E5%89%8D%E7%AB%AF%E6%A1%86%E6%9E%B6%E5%BC%80%E5%8F%91&image_size=square', '从零开始学习React框架，掌握组件设计、Hooks、Redux状态管理、React Router等核心技术。', 2, 36, 1, 18, NOW(), NOW()),
(1019, 'Kubernetes容器编排', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Kubernetes%E5%AE%B9%E5%99%A8%E7%BC%96%E6%8E%92&image_size=square', '深入学习Kubernetes的核心概念与实践，包括Pod、Service、Deployment、ConfigMap等资源对象。', 3, 32, 1, 19, NOW(), NOW()),
(1020, 'Web安全攻防实战', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Web%E5%AE%89%E5%85%A8%E6%94%BB%E9%98%B2%E5%AE%9E%E6%88%98&image_size=square', '学习常见Web安全漏洞的原理与防护措施，包括SQL注入、XSS、CSRF、文件上传等安全问题。', 1, 24, 1, 20, NOW(), NOW());
