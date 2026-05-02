import { useEffect, useState } from 'react'
import { Card, Descriptions, Avatar, Spin, message, Tag } from 'antd'
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons'
import { getUserInfo } from '@/api/auth'
import type { UserInfo } from '@/api/auth'

const ProfilePage = () => {
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    setLoading(true)
    try {
      const res = await getUserInfo()
      setUserInfo(res.data)
      message.success('获取个人信息成功')
    } catch (error) {
      console.error('获取个人信息失败:', error)
      message.error('获取个人信息失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-page">
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>个人信息</h2>
      
      <Spin spinning={loading}>
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
      </Spin>
    </div>
  )
}

export default ProfilePage