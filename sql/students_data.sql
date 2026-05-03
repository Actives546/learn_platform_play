-- 学生数据初始化脚本
-- 插入10个模拟学生用户数据
-- 密码: 123456 (BCrypt加密)

USE learn_platform;

-- 先清理旧的学生数据（可选）
-- DELETE FROM user WHERE role_id = 3;

-- 插入10个模拟学生用户
INSERT INTO user (id, user_name, password, nick_name, phone, email, avatar, role_id, status, create_time, update_time) VALUES
-- 学生1
(1000001, 'student001', '$2a$10$EqvwviiplU8B.TUd2tMk7OR3d5N.BB4kGj7XJ1kP0tN5xQaH3s2u', '张三', '13800138001', 'student001@example.com', NULL, 3, 1, NOW(), NOW()),
-- 学生2
(1000002, 'student002', '$2a$10$EqvwviiplU8B.TUd2tMk7OR3d5N.BB4kGj7XJ1kP0tN5xQaH3s2u', '李四', '13800138002', 'student002@example.com', NULL, 3, 1, NOW(), NOW()),
-- 学生3
(1000003, 'student003', '$2a$10$EqvwviiplU8B.TUd2tMk7OR3d5N.BB4kGj7XJ1kP0tN5xQaH3s2u', '王五', '13800138003', 'student003@example.com', NULL, 3, 1, NOW(), NOW()),
-- 学生4
(1000004, 'student004', '$2a$10$EqvwviiplU8B.TUd2tMk7OR3d5N.BB4kGj7XJ1kP0tN5xQaH3s2u', '赵六', '13800138004', 'student004@example.com', NULL, 3, 1, NOW(), NOW()),
-- 学生5
(1000005, 'student005', '$2a$10$EqvwviiplU8B.TUd2tMk7OR3d5N.BB4kGj7XJ1kP0tN5xQaH3s2u', '孙七', '13800138005', 'student005@example.com', NULL, 3, 1, NOW(), NOW()),
-- 学生6
(1000006, 'student006', '$2a$10$EqvwviiplU8B.TUd2tMk7OR3d5N.BB4kGj7XJ1kP0tN5xQaH3s2u', '周八', '13800138006', 'student006@example.com', NULL, 3, 0, NOW(), NOW()),
-- 学生7
(1000007, 'student007', '$2a$10$EqvwviiplU8B.TUd2tMk7OR3d5N.BB4kGj7XJ1kP0tN5xQaH3s2u', '吴九', '13800138007', 'student007@example.com', NULL, 3, 1, NOW(), NOW()),
-- 学生8
(1000008, 'student008', '$2a$10$EqvwviiplU8B.TUd2tMk7OR3d5N.BB4kGj7XJ1kP0tN5xQaH3s2u', '郑十', '13800138008', 'student008@example.com', NULL, 3, 1, NOW(), NOW()),
-- 学生9
(1000009, 'student009', '$2a$10$EqvwviiplU8B.TUd2tMk7OR3d5N.BB4kGj7XJ1kP0tN5xQaH3s2u', '陈十一', '13800138009', 'student009@example.com', NULL, 3, 1, NOW(), NOW()),
-- 学生10
(1000010, 'student010', '$2a$10$EqvwviiplU8B.TUd2tMk7OR3d5N.BB4kGj7XJ1kP0tN5xQaH3s2u', '林十二', '13800138010', 'student010@example.com', NULL, 3, 0, NOW(), NOW());

-- 注意: 以上密码为BCrypt加密后的"123456"
-- 如果数据库中BCrypt版本不同，可能需要重新生成密码哈希
-- 使用Java代码生成: BCrypt.hashpw("123456")
