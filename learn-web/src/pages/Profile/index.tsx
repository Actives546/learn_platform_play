import { Card, Descriptions, Avatar, Tag } from 'antd'
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons'
import { useUserStore } from '@/store/userStore'
import type { UserInfo } from '@/api/auth'

const ProfilePage = () => {
  const { userInfo } = useUserStore()

  return (
    <div className="profile-page">
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>个人信息</h2>
      
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Avatar
            size={120}
            icon={<UserOutlined />}
            src={userInfo?.avatar}
            style={{ marginBottom: 16 }}
          />
          <h3 style={{ marginBottom: 8 }}>
            {userInfo?.nickName || userInfo?.userName || '用户'}
          </h3>
          <Tag color="blue">普通用户</Tag>
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="用户名">
            {userInfo?.userName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="昵称">
            {userInfo?.nickName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="手机号" icon={<PhoneOutlined />}>
            {userInfo?.phone || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱" icon={<MailOutlined />}>
            {userInfo?.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="用户ID">
            {userInfo?.id || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="角色ID">
            {userInfo?.roleId || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}

export default ProfilePage