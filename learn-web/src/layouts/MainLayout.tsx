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
import { getMenuTree, Menu as MenuType } from '@/api/menu'
import { message } from 'antd'

const iconMap: Record<string, React.ReactNode> = {
  HomeOutlined: <HomeOutlined />,
  BookOutlined: <BookOutlined />,
  TeamOutlined: <TeamOutlined />,
  ScheduleOutlined: <ScheduleOutlined />,
  BarChartOutlined: <BarChartOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
  UserOutlined: <UserOutlined />,
  SettingOutlined: <SettingOutlined />,
  LogoutOutlined: <LogoutOutlined />,
  SolutionOutlined: <SolutionOutlined />,
  QuestionCircleOutlined: <QuestionCircleOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  TrophyOutlined: <TrophyOutlined />,
  SafetyOutlined: <SafetyOutlined />,
  PieChartOutlined: <PieChartOutlined />,
  LineChartOutlined: <LineChartOutlined />,
  UnorderedListOutlined: <UnorderedListOutlined />,
  SafetyCertificateOutlined: <SafetyCertificateOutlined />,
}

const getIcon = (iconName?: string): React.ReactNode => {
  if (!iconName) return undefined
  return iconMap[iconName] || <AppstoreOutlined />
}

const convertMenuToAntd = (menus: MenuType[]): MenuProps['items'] => {
  return menus
    .filter(menu => menu.menuType !== 3)
    .map(menu => {
      const item: MenuProps['items'][number] = {
        key: menu.path || `menu-${menu.id}`,
        icon: getIcon(menu.icon),
        label: menu.menuName,
      }
      if (menu.children && menu.children.length > 0) {
        item.children = convertMenuToAntd(menu.children)
      }
      return item
    })
}

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
  const [menuItems, setMenuItems] = useState<MenuProps['items']>([])
  const [authLoading, setAuthLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { userInfo, clearAuth, initAuth, isLogin } = useUserStore()
  const [openKeys, setOpenKeys] = useState<string[]>(getOpenKeys(location.pathname))

  const fetchMenuTree = async () => {
    try {
      const res = await getMenuTree()
      if (res.code === 200 && res.data) {
        const antdMenuItems = convertMenuToAntd(res.data)
        setMenuItems(antdMenuItems)
      }
    } catch (error) {
      console.error('获取菜单树失败:', error)
      message.error('获取菜单失败，请刷新页面重试')
    }
  }

  useEffect(() => {
    initAuth()
    setAuthLoading(false)
  }, [initAuth])

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!isLogin && location.pathname !== '/login') {
      navigate('/login')
    } else if (isLogin) {
      fetchMenuTree()
    }
  }, [isLogin, location.pathname, navigate, authLoading])

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
