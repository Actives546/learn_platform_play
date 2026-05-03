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
  Descriptions,
} from 'antd'
import {
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
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
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)
  const [deletingUserName, setDeletingUserName] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [form] = Form.useForm()
  const hasInitRef = useRef(false)

  const fetchUserList = async (
    userNameParam?: string,
    statusParam?: number,
    pageNumParam?: number,
    pageSizeParam?: number
  ) => {
    setLoading(true)
    try {
      const params: {
        roleId: number
        pageNum: number
        pageSize: number
        userName?: string
        status?: number
      } = {
        roleId: 3,
        pageNum: pageNumParam !== undefined ? pageNumParam : pageNum,
        pageSize: pageSizeParam !== undefined ? pageSizeParam : pageSize,
      }

      const finalUserName = userNameParam !== undefined ? userNameParam : searchUserName
      if (finalUserName && finalUserName.trim() !== '') {
        params.userName = finalUserName.trim()
      }

      const finalStatus = statusParam !== undefined ? statusParam : searchStatus
      if (finalStatus !== undefined) {
        params.status = finalStatus
      }

      console.log('请求参数:', params)
      
      const res = await getUserPage(params)
      if (res.code === 200 && res.data) {
        const pageResult = res.data as PageResult<User>
        console.log('返回结果:', pageResult)
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
    if (hasInitRef.current) {
      fetchUserList()
    }
  }, [pageNum, pageSize])

  const handleSearch = () => {
    setPageNum(1)
    fetchUserList(searchUserName, searchStatus, 1, pageSize)
  }

  const handleReset = () => {
    setSearchUserName('')
    setSearchStatus(undefined)
    setPageNum(1)
    fetchUserList('', undefined, 1, pageSize)
  }

  const handleAdd = () => {
    setModalTitle('新增学生')
    setEditingUser(null)
    form.resetFields()
    form.setFieldsValue({
      userName: '',
      nickName: '',
      password: '',
      phone: '',
      email: '',
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
          id: res.data.id,
          userName: res.data.userName,
          nickName: res.data.nickName || '',
          password: '',
          phone: res.data.phone || '',
          email: res.data.email || '',
          status: res.data.status,
          roleId: res.data.roleId,
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

  const handleDeleteClick = (record: User) => {
    setDeletingUserId(record.id)
    setDeletingUserName(record.userName)
    setDeleteVisible(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingUserId) return
    
    setDeleteLoading(true)
    try {
      const res = await deleteUser(deletingUserId)
      if (res.code === 200) {
        message.success('删除成功')
        setDeleteVisible(false)
        fetchUserList()
      }
    } catch (error) {
      console.error('删除学生失败:', error)
      message.error('删除学生失败')
    } finally {
      setDeleteLoading(false)
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
        if (!userData.password || userData.password.trim() === '') {
          delete userData.password
        }
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
      width: 120,
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      width: 100,
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 160,
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
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
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClick(record)}
          >
            删除
          </Button>
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
              style={{ width: 180 }}
              value={searchUserName}
              onChange={(e) => setSearchUserName(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#666' }}>状态：</span>
            <Select
              placeholder="全部状态"
              style={{ width: 130 }}
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
            scroll={{ x: 920 }}
            locale={{ emptyText: '暂无学生数据' }}
          />
        </Spin>
      </Card>

      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={580}
        destroyOnClose
        okText="确定"
        cancelText="取消"
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
            <Input />
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
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={500}
      >
        {detailUser && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  backgroundColor: '#1890ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 28,
                }}
              >
                <UserOutlined />
              </div>
            </div>

            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="用户名">{detailUser.userName}</Descriptions.Item>
              <Descriptions.Item label="昵称">{detailUser.nickName || '-'}</Descriptions.Item>
              <Descriptions.Item label="手机号">{detailUser.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{detailUser.email || '-'}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getStatusColor(detailUser.status)}>
                  {getStatusText(detailUser.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{detailUser.createTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{detailUser.updateTime || '-'}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
            <span>删除确认</span>
          </Space>
        }
        open={deleteVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteVisible(false)}
        confirmLoading={deleteLoading}
        okText="确定删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        width={420}
        centered
      >
        <div style={{ padding: '8px 0' }}>
          <div style={{ marginBottom: 16, fontSize: 15, color: '#333' }}>
            确定要删除学生 <span style={{ color: '#ff4d4f', fontWeight: 600 }}>"{deletingUserName}"</span> 吗？
          </div>
          <div style={{ fontSize: 13, color: '#999', padding: 12, backgroundColor: '#fff2f0', borderRadius: 6, border: '1px solid #ffccc7' }}>
            <div style={{ fontWeight: 500, color: '#666', marginBottom: 4 }}>⚠️ 警告</div>
            <div>删除后数据将无法恢复，请谨慎操作！</div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default StudentPage
