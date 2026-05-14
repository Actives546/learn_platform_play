import { useState, useEffect, useRef } from 'react'
import {
  Card,
  List,
  Tree,
  Button,
  Space,
  message,
  Spin,
  Tag,
  Modal,
  Form,
  Input,
  Switch,
  Typography,
  Popconfirm,
} from 'antd'
import {
  ReloadOutlined,
  CheckOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SafetyOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import {
  getRoleList,
  getRoleMenuIds,
  grantMenus,
  Role,
  addRole,
  updateRole,
  deleteRole,
} from '@/api/role'
import {
  getMenuList,
  Menu,
} from '@/api/menu'

const { Title } = Typography
const { TextArea } = Input

const RoleManagementPage = () => {
  const [roleList, setRoleList] = useState<Role[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [treeData, setTreeData] = useState<any[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [roleLoading, setRoleLoading] = useState(false)
  const [menuLoading, setMenuLoading] = useState(false)
  const [grantLoading, setGrantLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增角色')
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [form] = Form.useForm()
  const hasInitRef = useRef(false)

  const buildTreeData = (menus: Menu[]) => {
    const nodeMap = new Map<number, any>()

    // 先创建所有节点
    menus.forEach(menu => {
      nodeMap.set(menu.id, {
        key: menu.id,
        title: (
          <span>
            <UnorderedListOutlined style={{ marginRight: 8 }} />
            {menu.menuName}
            {menu.menuType === 1 && <Tag color="blue" style={{ marginLeft: 8 }}>目录</Tag>}
            {menu.menuType === 2 && <Tag color="green" style={{ marginLeft: 8 }}>菜单</Tag>}
            {menu.menuType === 3 && <Tag color="orange" style={{ marginLeft: 8 }}>按钮</Tag>}
            {menu.status === 0 && <Tag color="red" style={{ marginLeft: 8 }}>禁用</Tag>}
          </span>
        ),
        disabled: menu.status === 0,
        children: [],
      })
    })

    // 再按 parentId 组装树
    const roots: any[] = []
    menus.forEach(menu => {
      const node = nodeMap.get(menu.id)!
      if (menu.parentId === 0) {
        roots.push(node)
      } else {
        const parent = nodeMap.get(menu.parentId)
        if (parent) {
          parent.children.push(node)
        } else {
          roots.push(node)
        }
      }
    })

    setTreeData(roots)
  }

  const fetchMenuList = async () => {
    setMenuLoading(true)
    try {
      const res = await getMenuList()
      if (res.code === 200 && res.data) {
        buildTreeData(res.data)
      }
    } catch (error) {
      console.error('获取菜单列表失败:', error)
      message.error('获取菜单列表失败')
    } finally {
      setMenuLoading(false)
    }
  }

  const fetchRoleMenuIds = async (roleId: number) => {
    try {
      const res = await getRoleMenuIds(roleId)
      if (res.code === 200 && res.data) {
        setCheckedKeys(res.data)
      } else {
        setCheckedKeys([])
      }
    } catch (error) {
      console.error('获取角色菜单ID失败:', error)
      setCheckedKeys([])
    }
  }

  const fetchRoleList = async () => {
    setRoleLoading(true)
    try {
      const res = await getRoleList()
      if (res.code === 200 && res.data) {
        setRoleList(res.data)
        // 数据加载完成后自动选中第一个角色
        if (res.data.length > 0) {
          setSelectedRole(res.data[0])
        }
      }
    } catch (error) {
      console.error('获取角色列表失败:', error)
      message.error('获取角色列表失败')
    } finally {
      setRoleLoading(false)
    }
  }

  // 只执行一次的初始化加载
  useEffect(() => {
    if (hasInitRef.current) return
    hasInitRef.current = true
    fetchMenuList()
    fetchRoleList()
  }, [])

  // selectedRole 变化时加载其关联的菜单权限
  const selectedRoleId = selectedRole?.id

  useEffect(() => {
    if (selectedRoleId) {
      fetchRoleMenuIds(selectedRoleId)
    }
  }, [selectedRoleId])

  const handleRoleSelect = (role: Role) => {
    if (selectedRole?.id !== role.id) {
      setSelectedRole(role)
    }
  }

  const handleCheck = (checkedKeysValue: any, _info: any) => {
    const keys = Array.isArray(checkedKeysValue) ? checkedKeysValue : checkedKeysValue.checked
    setCheckedKeys(keys || [])
  }

  const handleGrantMenus = async () => {
    if (!selectedRole) {
      message.warning('请先选择一个角色')
      return
    }
    setGrantLoading(true)
    try {
      const menuIds = checkedKeys.map(key => Number(key))
      const res = await grantMenus(selectedRole.id, menuIds)
      if (res.code === 200) {
        message.success('授权成功')
      }
    } catch (error) {
      console.error('授权失败:', error)
      message.error('授权失败')
    } finally {
      setGrantLoading(false)
    }
  }

  const handleAdd = () => {
    setModalTitle('新增角色')
    setEditingRole(null)
    form.resetFields()
    form.setFieldsValue({
      status: 1,
    })
    setModalVisible(true)
  }

  const handleEdit = (role: Role) => {
    setModalTitle('编辑角色')
    setEditingRole(role)
    form.setFieldsValue({
      id: role.id,
      roleName: role.roleName,
      roleCode: role.roleCode,
      description: role.description,
      status: role.status,
    })
    setModalVisible(true)
  }

  const handleDelete = async (role: Role) => {
    try {
      const res = await deleteRole(role.id)
      if (res.code === 200) {
        message.success('删除成功')
        if (selectedRole?.id === role.id) {
          setSelectedRole(null)
          setCheckedKeys([])
        }
        fetchRoleList()
      }
    } catch (error) {
      console.error('删除角色失败:', error)
      message.error('删除角色失败')
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      if (editingRole) {
        const res = await updateRole({
          id: editingRole.id,
          ...values,
        })
        if (res.code === 200) {
          message.success('更新成功')
          setModalVisible(false)
          fetchRoleList()
        }
      } else {
        const res = await addRole({
          ...values,
        })
        if (res.code === 200) {
          message.success('新增成功')
          setModalVisible(false)
          fetchRoleList()
        }
      }
    } catch (error) {
      console.error('保存角色失败:', error)
    }
  }

  const getStatusColor = (status: number) => {
    return status === 1 ? 'success' : 'default'
  }

  const getStatusText = (status: number) => {
    return status === 1 ? '启用' : '禁用'
  }

  return (
    <div className="role-management-page" style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        <SafetyOutlined style={{ marginRight: 12 }} />
        角色授权管理
      </Title>

      <div style={{ display: 'flex', gap: 16 }}>
        <Card
          title={
            <Space>
              <span>角色列表</span>
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={() => fetchRoleList()}
              />
            </Space>
          }
          style={{ width: 300, flexShrink: 0, maxHeight: 'calc(100vh - 160px)' }}
          bodyStyle={{ overflow: 'auto', padding: 0 }}
          extra={
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增
            </Button>
          }
        >
          <Spin spinning={roleLoading}>
            <div style={{ padding: 16 }}>
            <List
              dataSource={roleList}
              locale={{ emptyText: '暂无角色数据' }}
              renderItem={(role) => (
                <List.Item
                  style={{
                    padding: 12,
                    marginBottom: 8,
                    borderRadius: 6,
                    cursor: 'pointer',
                    backgroundColor: selectedRole?.id === role.id ? '#e6f7ff' : '#fff',
                    border: selectedRole?.id === role.id ? '1px solid #1890ff' : '1px solid #f0f0f0',
                  }}
                  onClick={() => handleRoleSelect(role)}
                  actions={[
                    <Button
                      key="edit"
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(role)
                      }}
                    >
                      编辑
                    </Button>,
                    <Popconfirm
                      key="delete"
                      title="确定要删除该角色吗？"
                      description="删除后无法恢复，请谨慎操作"
                      onConfirm={(e) => {
                        e?.stopPropagation()
                        handleDelete(role)
                      }}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => e.stopPropagation()}
                      >
                        删除
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <span style={{ fontWeight: 500 }}>{role.roleName}</span>
                        <Tag color={getStatusColor(role.status)}>{getStatusText(role.status)}</Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                          编码: {role.roleCode}
                        </div>
                        {role.description && (
                          <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                            {role.description}
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            </div>
          </Spin>
        </Card>

        <Card
          title={
            <Space>
              <span>菜单授权</span>
              {selectedRole && (
                <Tag color="blue">{selectedRole.roleName}</Tag>
              )}
            </Space>
          }
          style={{ flex: 1, maxHeight: 'calc(100vh - 160px)' }}
          bodyStyle={{ overflow: 'auto', padding: 0 }}
          extra={
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleGrantMenus}
              loading={grantLoading}
              disabled={!selectedRole}
            >
              保存授权
            </Button>
          }
        >
          <Spin spinning={menuLoading}>
            {selectedRole ? (
              <div style={{ padding: 16, maxHeight: 'calc(100vh - 260px)', overflow: 'auto' }}>
                <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#fafafa', borderRadius: 6 }}>
                  <Space>
                    <span style={{ color: '#666' }}>当前角色:</span>
                    <span style={{ fontWeight: 500 }}>{selectedRole.roleName}</span>
                    <span style={{ color: '#666' }}>|</span>
                    <span style={{ color: '#666' }}>已选择:</span>
                    <Tag color="green">{checkedKeys.length} 个菜单</Tag>
                  </Space>
                </div>
                {treeData.length > 0 ? (
                  <Tree
                    checkable
                    checkedKeys={checkedKeys}
                    defaultExpandAll
                    onCheck={handleCheck}
                    treeData={treeData}
                    className="menu-tree"
                    checkStrictly
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>
                    <div>菜单数据加载中...</div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 100, color: '#999' }}>
                <SafetyOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>请从左侧选择一个角色</div>
              </div>
            )}
          </Spin>
        </Card>
      </div>

      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={500}
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
            name="roleName"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称，如：管理员" />
          </Form.Item>

          <Form.Item
            name="roleCode"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input placeholder="请输入角色编码，如：admin" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea
              rows={3}
              placeholder="请输入角色描述"
              maxLength={200}
              showCount
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

export default RoleManagementPage
