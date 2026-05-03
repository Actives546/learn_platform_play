import { useState, useEffect } from 'react'
import { Card, Descriptions, Avatar, Tag, Spin } from 'antd'
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons'
import { useUserStore } from '@/store/userStore'
import { getUserInfo, UserInfo } from '@/api/auth'

const ProfilePage = () => {
  const { userInfo: storeUserInfo } = useUserStore()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true)
      try {
        const res = await getUserInfo()
        if (res.code === 200 && res.data) {
          setUserInfo(res.data)
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        setUserInfo(storeUserInfo)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [storeUserInfo])

  if (loading) {
    return (
      <div className="profile-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    )
  }

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
          <Descriptions.Item label={<span><PhoneOutlined style={{ marginRight: 4 }} />手机号</span>}>
            {userInfo?.phone || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={<span><MailOutlined style={{ marginRight: 4 }} />邮箱</span>}>
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