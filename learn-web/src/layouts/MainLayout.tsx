import { useState, useEffect } from 'react'
import { Layout, Menu, Dropdown, Avatar, Button } from 'antd'
import type { MenuProps } from 'antd'
import {
  HomeOutlined,
  BookOutlined,
  TeamOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SolutionOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
  SafetyOutlined,
  PieChartOutlined,
  LineChartOutlined,
  UnorderedListOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { logout } from '@/api/auth'
import { message } from 'antd'

const { Header, Sider, Content } = Layout

const getOpenKeys = (pathname: string): string[] => {
  const paths = pathname.split('/').filter(Boolean)
  if (paths.length > 1) {
    return [`/${paths[0]}`]
  }
  return []
}

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { userInfo, clearAuth, initAuth, isLogin } = useUserStore()
  const [openKeys, setOpenKeys] = useState<string[]>(getOpenKeys(location.pathname))

  useEffect(() => {
    initAuth()
  }, [initAuth])

  useEffect(() => {
    if (!isLogin && location.pathname !== '/login') {
      navigate('/login')
    }
  }, [isLogin, location.pathname, navigate])

  useEffect(() => {
    setOpenKeys(getOpenKeys(location.pathname))
  }, [location.pathname])

  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    if (keys.length > 0) {
      setOpenKeys([keys[keys.length - 1]])
    } else {
      setOpenKeys([])
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      clearAuth()
      message.success('退出成功')
      navigate('/login')
    } catch (error) {
      console.error('退出失败:', error)
    }
  }

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/teaching',
      icon: <BookOutlined />,
      label: '教学管理',
      children: [
        {
          key: '/teaching/course',
          icon: <UnorderedListOutlined />,
          label: '课程列表',
        },
        {
          key: '/teaching/chapter',
          icon: <FileTextOutlined />,
          label: '章节管理',
        },
        {
          key: '/teaching/question',
          icon: <QuestionCircleOutlined />,
          label: '题库管理',
        },
        {
          key: '/teaching/plan',
          icon: <ScheduleOutlined />,
          label: '教学计划',
        },
      ],
    },
    {
      key: '/personnel',
      icon: <TeamOutlined />,
      label: '人员管理',
      children: [
        {
          key: '/personnel/student',
          icon: <UserOutlined />,
          label: '学生管理',
        },
        {
          key: '/personnel/teacher',
          icon: <SolutionOutlined />,
          label: '老师管理',
        },
      ],
    },
    {
      key: '/progress',
      icon: <LineChartOutlined />,
      label: '学习进度',
      children: [
        {
          key: '/progress/study',
          icon: <LineChartOutlined />,
          label: '学习进度',
        },
        {
          key: '/progress/certificate',
          icon: <SafetyCertificateOutlined />,
          label: '证书管理',
        },
        {
          key: '/progress/study-plan',
          icon: <ScheduleOutlined />,
          label: '学习计划',
        },
      ],
    },
    {
      key: '/analysis',
      icon: <BarChartOutlined />,
      label: '数据分析',
      children: [
        {
          key: '/analysis/statistics',
          icon: <PieChartOutlined />,
          label: '学习统计',
        },
        {
          key: '/analysis/ranking',
          icon: <TrophyOutlined />,
          label: '课程排行',
        },
        {
          key: '/analysis/score',
          icon: <BarChartOutlined />,
          label: '成绩分析',
        },
      ],
    },
    {
      key: '/menu',
      icon: <AppstoreOutlined />,
      label: '菜单管理',
      children: [
        {
          key: '/menu/management',
          icon: <UnorderedListOutlined />,
          label: '菜单管理',
        },
        {
          key: '/menu/role',
          icon: <SafetyOutlined />,
          label: '角色授权管理',
        },
      ],
    },
  ]

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'setting',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ]

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      handleLogout()
    } else if (key === 'profile') {
      navigate('/profile')
    } else if (key === 'setting') {
      navigate('/setting')
    }
  }

  return (
    <Layout className="layout-main">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="layout-sider"
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? 14 : 18,
          fontWeight: 600,
          background: 'rgba(255, 255, 255, 0.1)',
        }}>
          {collapsed ? '学习' : '智能学习平台'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="layout-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 16,
              width: 64,
              height: 64,
              color: 'white',
            }}
          />
          <div className="header-title">智能在线学习平台</div>
          <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
            <div className="header-user">
              <Avatar icon={<UserOutlined />} />
              <span>{userInfo?.nickName || userInfo?.userName || '用户'}</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
