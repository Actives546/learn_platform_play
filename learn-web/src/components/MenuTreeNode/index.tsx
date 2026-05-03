import { Tag } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'

interface MenuTreeNodeProps {
  menuName: string
  menuType: number
  status: number
}

const MenuTreeNode = ({ menuName, menuType, status }: MenuTreeNodeProps) => {
  const getMenuTypeTag = () => {
    switch (menuType) {
      case 1:
        return <Tag color="blue" style={{ marginLeft: 8 }}>目录</Tag>
      case 2:
        return <Tag color="green" style={{ marginLeft: 8 }}>菜单</Tag>
      case 3:
        return <Tag color="orange" style={{ marginLeft: 8 }}>按钮</Tag>
      default:
        return null
    }
  }

  return (
    <span>
      <UnorderedListOutlined style={{ marginRight: 8 }} />
      {menuName}
      {getMenuTypeTag()}
      {status === 0 && <Tag color="red" style={{ marginLeft: 8 }}>禁用</Tag>}
    </span>
  )
}

export default MenuTreeNode
