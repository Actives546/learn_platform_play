import { useState, useEffect, useRef } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  message,
  Spin,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Popconfirm,
  InputNumber,
} from 'antd'
import {
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import {
  getUserPage,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  User,
  UserForm,
  PageResult,
} from '@/api/user'

const { Title } = Typography
const { Option } = Select

const StudentPage = () => {
  const [loading, setLoading] = useState(false)
  const [userList, setUserList] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchUserName, setSearchUserName] = useState('')
  const [searchStatus, setSearchStatus] = useState<number | undefined>(undefined)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增学生')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailUser, setDetailUser] = useState<User | null>(null)
  const [form] = Form.useForm()
  const hasInitRef = useRef(false)

  const fetchUserList = async () => {
    setLoading(true)
    try {
      const res = await getUserPage({
        userName: searchUserName || undefined,
        status: searchStatus,
        roleId: 3,
        pageNum,
        pageSize,
      })
      if (res.code === 200 && res.data) {
        const pageResult = res.data as PageResult<User>
        setUserList(pageResult.records || [])
        setTotal(pageResult.total || 0)
      }
    } catch (error) {
      console.error('获取学生列表失败:', error)
      message.error('获取学生列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasInitRef.current) return
    hasInitRef.current = true
    fetchUserList()
  }, [])

  useEffect(() => {
    fetchUserList()
  }, [pageNum, pageSize])

  const handleSearch = () => {
    setPageNum(1)
    fetchUserList()
  }

  const handleReset = () => {
    setSearchUserName('')
    setSearchStatus(undefined)
    setPageNum(1)
    fetchUserList()
  }

  const handleAdd = () => {
    setModalTitle('新增学生')
    setEditingUser(null)
    form.resetFields()
    form.setFieldsValue({
      status: 1,
      roleId: 3,
    })
    setModalVisible(true)
  }

  const handleEdit = async (record: User) => {
    setModalTitle('编辑学生')
    setEditingUser(record)
    try {
      const res = await getUserById(record.id)
      if (res.code === 200 && res.data) {
        form.setFieldsValue({
          ...res.data,
          password: '',
        })
        setModalVisible(true)
      }
    } catch (error) {
      console.error('获取学生详情失败:', error)
      message.error('获取学生详情失败')
    }
  }

  const handleView = async (record: User) => {
    try {
      const res = await getUserById(record.id)
      if (res.code === 200 && res.data) {
        setDetailUser(res.data)
        setDetailVisible(true)
      }
    } catch (error) {
      console.error('获取学生详情失败:', error)
      message.error('获取学生详情失败')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteUser(id)
      if (res.code === 200) {
        message.success('删除成功')
        fetchUserList()
      }
    } catch (error) {
      console.error('删除学生失败:', error)
      message.error('删除学生失败')
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      const userData: UserForm = {
        ...values,
        roleId: 3,
      }
      
      if (editingUser) {
        userData.id = editingUser.id
        const res = await updateUser(userData)
        if (res.code === 200) {
          message.success('更新成功')
          setModalVisible(false)
          fetchUserList()
        }
      } else {
        const res = await addUser(userData)
        if (res.code === 200) {
          message.success('新增成功')
          setModalVisible(false)
          fetchUserList()
        }
      }
    } catch (error) {
      console.error('保存学生失败:', error)
    }
  }

  const getStatusColor = (status: number) => {
    return status === 1 ? 'success' : 'default'
  }

  const getStatusText = (status: number) => {
    return status === 1 ? '启用' : '禁用'
  }

  const columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right' as const,
      render: (_: unknown, record: User) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该学生吗？"
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

  const paginationConfig = {
    current: pageNum,
    pageSize: pageSize,
    total: total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条记录`,
    pageSizeOptions: ['10', '20', '50', '100'],
    onChange: (page: number, size: number) => {
      setPageNum(page)
      setPageSize(size)
    },
  }

  return (
    <div className="student-management-page" style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        <UserOutlined style={{ marginRight: 12 }} />
        学生管理
      </Title>

      <Card
        style={{ marginBottom: 16 }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Space wrap size="middle">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#666' }}>用户名：</span>
            <Input
              placeholder="请输入用户名"
              style={{ width: 200 }}
              value={searchUserName}
              onChange={(e) => setSearchUserName(e.target.value)}
              onPressEnter={handleSearch}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#666' }}>状态：</span>
            <Select
              placeholder="全部状态"
              style={{ width: 150 }}
              allowClear
              value={searchStatus}
              onChange={(value) => setSearchStatus(value)}
            >
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </div>
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              搜索
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              重置
            </Button>
          </Space>
        </Space>
      </Card>

      <Card
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增学生
          </Button>
        }
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={userList}
            rowKey="id"
            pagination={paginationConfig}
            scroll={{ x: 1100 }}
            locale={{ emptyText: '暂无学生数据' }}
          />
        </Spin>
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
          style={{ marginTop: 16 }}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="roleId"
            hidden
          >
            <InputNumber />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="userName"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入用户名" disabled={!!editingUser} />
            </Form.Item>

            <Form.Item
              name="nickName"
              label="昵称"
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入昵称" />
            </Form.Item>
          </div>

          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}

          {editingUser && (
            <Form.Item
              name="password"
              label="密码"
              extra="留空则不修改密码"
            >
              <Input.Password placeholder="留空则不修改密码" />
            </Form.Item>
          )}

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="phone"
              label="手机号"
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱"
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </div>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="学生详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={500}
      >
        {detailUser && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#1890ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 32,
                }}
              >
                <UserOutlined />
              </div>
            </div>

            <Table
              dataSource={[
                { key: '1', label: '用户名', value: detailUser.userName },
                { key: '2', label: '昵称', value: detailUser.nickName || '-' },
                { key: '3', label: '手机号', value: detailUser.phone || '-' },
                { key: '4', label: '邮箱', value: detailUser.email || '-' },
                {
                  key: '5',
                  label: '状态',
                  value: (
                    <Tag color={getStatusColor(detailUser.status)}>
                      {getStatusText(detailUser.status)}
                    </Tag>
                  ),
                },
                { key: '6', label: '创建时间', value: detailUser.createTime || '-' },
                { key: '7', label: '更新时间', value: detailUser.updateTime || '-' },
              ]}
              columns={[
                {
                  title: '属性',
                  dataIndex: 'label',
                  key: 'label',
                  width: 120,
                  render: (text: string) => <span style={{ fontWeight: 500, color: '#666' }}>{text}</span>,
                },
                {
                  title: '值',
                  dataIndex: 'value',
                  key: 'value',
                },
              ]}
              pagination={false}
              showHeader={false}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default StudentPage
