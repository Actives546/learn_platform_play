import { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  TreeSelect,
  Space,
  message,
  Popconfirm,
  Tag,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import {
  getMenuList,
  getMenuById,
  addMenu,
  updateMenu,
  deleteMenu,
  Menu,
  MenuForm,
  MenuType,
  MenuStatus,
} from '@/api/menu'

const { TextArea } = Input
const { Option } = Select

const iconOptions = [
  { label: '首页', value: 'HomeOutlined' },
  { label: '书籍', value: 'BookOutlined' },
  { label: '团队', value: 'TeamOutlined' },
  { label: '日程', value: 'ScheduleOutlined' },
  { label: '柱状图', value: 'BarChartOutlined' },
  { label: '应用', value: 'AppstoreOutlined' },
  { label: '用户', value: 'UserOutlined' },
  { label: '设置', value: 'SettingOutlined' },
  { label: '解决方案', value: 'SolutionOutlined' },
  { label: '问题', value: 'QuestionCircleOutlined' },
  { label: '文件', value: 'FileTextOutlined' },
  { label: '奖杯', value: 'TrophyOutlined' },
  { label: '安全', value: 'SafetyOutlined' },
  { label: '饼图', value: 'PieChartOutlined' },
  { label: '折线图', value: 'LineChartOutlined' },
  { label: '列表', value: 'UnorderedListOutlined' },
  { label: '证书', value: 'SafetyCertificateOutlined' },
]

const menuTypeOptions = [
  { label: '目录', value: 1 },
  { label: '菜单', value: 2 },
  { label: '按钮', value: 3 },
]

const MenuManagementPage = () => {
  const [menuList, setMenuList] = useState<Menu[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增菜单')
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
  const [form] = Form.useForm<MenuForm>()
  const [treeData, setTreeData] = useState<any[]>([])

  const fetchMenuList = async () => {
    setLoading(true)
    try {
      const res = await getMenuList()
      if (res.code === 200 && res.data) {
        setMenuList(res.data)
        buildTreeData(res.data)
      }
    } catch (error) {
      console.error('获取菜单列表失败:', error)
      message.error('获取菜单列表失败')
    } finally {
      setLoading(false)
    }
  }

  const buildTreeData = (menus: Menu[]) => {
    const menuMap = new Map<number, Menu>()
    menus.forEach(menu => menuMap.set(menu.id, menu))

    const result: any[] = [
      {
        id: 0,
        title: '顶级菜单',
        value: 0,
        children: [],
      },
    ]

    const childrenMap = new Map<number, any[]>()
    menus.forEach(menu => {
      const node = {
        id: menu.id,
        title: menu.menuName,
        value: menu.id,
        children: [],
      }
      if (!childrenMap.has(menu.parentId)) {
        childrenMap.set(menu.parentId, [])
      }
      childrenMap.get(menu.parentId)!.push(node)
    })

    const buildTree = (parentId: number, nodes: any[]) => {
      const children = childrenMap.get(parentId) || []
      children.forEach(child => {
        buildTree(child.id, child.children)
        nodes.push(child)
      })
    }

    buildTree(0, result[0].children)
    setTreeData(result)
  }

  useEffect(() => {
    fetchMenuList()
  }, [])

  const handleAdd = () => {
    setModalTitle('新增菜单')
    setEditingMenu(null)
    form.resetFields()
    form.setFieldsValue({
      parentId: 0,
      menuType: 2,
      sort: 0,
      status: 1,
    })
    setModalVisible(true)
  }

  const handleEdit = async (record: Menu) => {
    setModalTitle('编辑菜单')
    setEditingMenu(record)
    try {
      const res = await getMenuById(record.id)
      if (res.code === 200 && res.data) {
        form.setFieldsValue({
          id: res.data.id,
          parentId: res.data.parentId,
          menuName: res.data.menuName,
          path: res.data.path,
          component: res.data.component,
          icon: res.data.icon,
          menuType: res.data.menuType,
          perms: res.data.perms,
          sort: res.data.sort,
          status: res.data.status,
        })
        setModalVisible(true)
      }
    } catch (error) {
      console.error('获取菜单详情失败:', error)
      message.error('获取菜单详情失败')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteMenu(id)
      if (res.code === 200) {
        message.success('删除成功')
        fetchMenuList()
      }
    } catch (error) {
      console.error('删除菜单失败:', error)
      message.error('删除菜单失败')
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      if (editingMenu) {
        const res = await updateMenu(values as MenuForm)
        if (res.code === 200) {
          message.success('更新成功')
          setModalVisible(false)
          fetchMenuList()
        }
      } else {
        const res = await addMenu(values as MenuForm)
        if (res.code === 200) {
          message.success('新增成功')
          setModalVisible(false)
          fetchMenuList()
        }
      }
    } catch (error) {
      console.error('保存菜单失败:', error)
    }
  }

  const getMenuTypeName = (type: MenuType) => {
    const option = menuTypeOptions.find(o => o.value === type)
    return option ? option.label : '未知'
  }

  const getMenuTypeColor = (type: MenuType) => {
    switch (type) {
      case 1:
        return 'blue'
      case 2:
        return 'green'
      case 3:
        return 'orange'
      default:
        return 'default'
    }
  }

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      key: 'menuName',
      width: 200,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 150,
      render: (icon: string) => icon || '-',
    },
    {
      title: '路由路径',
      dataIndex: 'path',
      key: 'path',
      width: 200,
      render: (path: string) => path || '-',
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      key: 'component',
      width: 200,
      render: (component: string) => component || '-',
    },
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      key: 'menuType',
      width: 100,
      render: (type: MenuType) => (
        <Tag color={getMenuTypeColor(type)}>{getMenuTypeName(type)}</Tag>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: MenuStatus) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: Menu) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该菜单吗？"
            description="删除后无法恢复，请谨慎操作"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="menu-management-page">
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        菜单管理
      </h2>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增菜单
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchMenuList}
            >
              刷新
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={menuList}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="parentId"
            label="上级菜单"
          >
            <TreeSelect
              treeData={treeData}
              placeholder="请选择上级菜单"
              treeDefaultExpandAll
              allowClear
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="menuName"
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>

          <Form.Item
            name="icon"
            label="图标"
          >
            <Select
              placeholder="请选择图标"
              allowClear
              showSearch
              optionFilterProp="label"
              options={iconOptions}
            />
          </Form.Item>

          <Form.Item
            name="menuType"
            label="菜单类型"
            rules={[{ required: true, message: '请选择菜单类型' }]}
          >
            <Select
              placeholder="请选择菜单类型"
              options={menuTypeOptions}
            />
          </Form.Item>

          <Form.Item
            name="path"
            label="路由路径"
            dependencies={['menuType']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const menuType = getFieldValue('menuType')
                  if (menuType === 2 && !value) {
                    return Promise.reject(new Error('菜单类型为"菜单"时，路由路径必填'))
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input placeholder="请输入路由路径，如 /menu/management" />
          </Form.Item>

          <Form.Item
            name="component"
            label="组件路径"
          >
            <Input placeholder="请输入组件路径，如 pages/Menu/Management/index" />
          </Form.Item>

          <Form.Item
            name="perms"
            label="权限标识"
          >
            <Input placeholder="请输入权限标识，如 menu:list" />
          </Form.Item>

          <Form.Item
            name="sort"
            label="排序"
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <InputNumber
              min={0}
              placeholder="请输入排序"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default MenuManagementPage
