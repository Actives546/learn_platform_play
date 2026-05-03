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
  InputNumber,
  Image,
  Tooltip,
} from 'antd'
import {
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  BookOutlined,
  SearchOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import {
  getCoursePage,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse,
  Course,
  CourseForm,
  PageResult,
} from '@/api/course'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

const CoursePage = () => {
  const [loading, setLoading] = useState(false)
  const [courseList, setCourseList] = useState<Course[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchCourseName, setSearchCourseName] = useState('')
  const [searchStatus, setSearchStatus] = useState<number | undefined>(undefined)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增课程')
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailCourse, setDetailCourse] = useState<Course | null>(null)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null)
  const [deletingCourseName, setDeletingCourseName] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [form] = Form.useForm()
  const hasInitRef = useRef(false)

  const fetchCourseList = async (
    courseNameParam?: string,
    statusParam?: number,
    pageNumParam?: number,
    pageSizeParam?: number
  ) => {
    setLoading(true)
    try {
      const params: {
        pageNum: number
        pageSize: number
        courseName?: string
        status?: number
      } = {
        pageNum: pageNumParam !== undefined ? pageNumParam : pageNum,
        pageSize: pageSizeParam !== undefined ? pageSizeParam : pageSize,
      }

      const finalCourseName = courseNameParam !== undefined ? courseNameParam : searchCourseName
      if (finalCourseName && finalCourseName.trim() !== '') {
        params.courseName = finalCourseName.trim()
      }

      const finalStatus = statusParam !== undefined ? statusParam : searchStatus
      if (finalStatus !== undefined) {
        params.status = finalStatus
      }

      console.log('请求参数:', params)
      
      const res = await getCoursePage(params)
      if (res.code === 200 && res.data) {
        const pageResult = res.data as PageResult<Course>
        console.log('返回结果:', pageResult)
        setCourseList(pageResult.records || [])
        setTotal(pageResult.total || 0)
      }
    } catch (error) {
      console.error('获取课程列表失败:', error)
      message.error('获取课程列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasInitRef.current) return
    hasInitRef.current = true
    fetchCourseList()
  }, [])

  useEffect(() => {
    if (hasInitRef.current) {
      fetchCourseList()
    }
  }, [pageNum, pageSize])

  const handleSearch = () => {
    setPageNum(1)
    fetchCourseList(searchCourseName, searchStatus, 1, pageSize)
  }

  const handleReset = () => {
    setSearchCourseName('')
    setSearchStatus(undefined)
    setPageNum(1)
    fetchCourseList('', undefined, 1, pageSize)
  }

  const handleAdd = () => {
    setModalTitle('新增课程')
    setEditingCourse(null)
    form.resetFields()
    form.setFieldsValue({
      courseName: '',
      cover: '',
      description: '',
      lessonCount: 0,
      status: 0,
      sort: 0,
    })
    setModalVisible(true)
  }

  const handleEdit = async (record: Course) => {
    setModalTitle('编辑课程')
    setEditingCourse(record)
    try {
      const res = await getCourseById(record.id)
      if (res.code === 200 && res.data) {
        form.setFieldsValue({
          id: res.data.id,
          courseName: res.data.courseName,
          cover: res.data.cover || '',
          description: res.data.description || '',
          teacherId: res.data.teacherId,
          lessonCount: res.data.lessonCount || 0,
          status: res.data.status,
          sort: res.data.sort || 0,
        })
        setModalVisible(true)
      }
    } catch (error) {
      console.error('获取课程详情失败:', error)
      message.error('获取课程详情失败')
    }
  }

  const handleView = async (record: Course) => {
    try {
      const res = await getCourseById(record.id)
      if (res.code === 200 && res.data) {
        setDetailCourse(res.data)
        setDetailVisible(true)
      }
    } catch (error) {
      console.error('获取课程详情失败:', error)
      message.error('获取课程详情失败')
    }
  }

  const handleDeleteClick = (record: Course) => {
    setDeletingCourseId(record.id)
    setDeletingCourseName(record.courseName)
    setDeleteVisible(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingCourseId) return
    
    setDeleteLoading(true)
    try {
      const res = await deleteCourse(deletingCourseId)
      if (res.code === 200) {
        message.success('删除成功')
        setDeleteVisible(false)
        fetchCourseList()
      }
    } catch (error) {
      console.error('删除课程失败:', error)
      message.error('删除课程失败')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      const courseData: CourseForm = {
        ...values,
      }
      
      if (editingCourse) {
        courseData.id = editingCourse.id
        const res = await updateCourse(courseData)
        if (res.code === 200) {
          message.success('更新成功')
          setModalVisible(false)
          fetchCourseList()
        }
      } else {
        const res = await addCourse(courseData)
        if (res.code === 200) {
          message.success('新增成功')
          setModalVisible(false)
          fetchCourseList()
        }
      }
    } catch (error) {
      console.error('保存课程失败:', error)
    }
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return 'default'
      case 1:
        return 'success'
      case 2:
        return 'warning'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return '草稿'
      case 1:
        return '已上架'
      case 2:
        return '已下架'
      default:
        return '未知'
    }
  }

  const columns = [
    {
      title: '课程封面',
      dataIndex: 'cover',
      key: 'cover',
      width: 120,
      render: (cover: string) => (
        <div style={{ width: 80, height: 60, borderRadius: 4, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
          {cover ? (
            <Image
              width={80}
              height={60}
              src={cover}
              alt="课程封面"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              preview={false}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOutlined style={{ fontSize: 24, color: '#ccc' }} />
            </div>
          )}
        </div>
      ),
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: '课时数',
      dataIndex: 'lessonCount',
      key: 'lessonCount',
      width: 100,
      render: (count: number) => count ?? 0,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      render: (sort: number) => sort ?? 0,
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
      width: 160,
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 160,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: unknown, record: Course) => (
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
    <div
      className="course-management-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 24,
        overflow: 'hidden',
      }}
    >
      <Title level={4} style={{ marginBottom: 24, flexShrink: 0 }}>
        <BookOutlined style={{ marginRight: 12 }} />
        课程管理
      </Title>

      <Card
        style={{ marginBottom: 16, flexShrink: 0 }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Space wrap size="middle">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#666' }}>课程名称：</span>
            <Input
              placeholder="请输入课程名称"
              style={{ width: 180 }}
              value={searchCourseName}
              onChange={(e) => setSearchCourseName(e.target.value)}
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
              <Option value={0}>草稿</Option>
              <Option value={1}>已上架</Option>
              <Option value={2}>已下架</Option>
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
        style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        bodyStyle={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增课程
          </Button>
        }
      >
        <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px 24px' }}>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={courseList}
              rowKey="id"
              pagination={paginationConfig}
              scroll={{ x: 1150 }}
              locale={{ emptyText: '暂无课程数据' }}
            />
          </Spin>
        </div>
      </Card>

      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
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
            name="courseName"
            label="课程名称"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input placeholder="请输入课程名称" maxLength={200} />
          </Form.Item>

          <Form.Item
            name="cover"
            label="课程封面"
          >
            <Input placeholder="请输入封面图片URL" />
          </Form.Item>

          <Form.Item
            name="description"
            label="课程描述"
          >
            <TextArea
              placeholder="请输入课程描述"
              rows={3}
              maxLength={500}
              showCount
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="lessonCount"
              label="课时数"
              style={{ flex: 1 }}
            >
              <InputNumber
                placeholder="请输入课时数"
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="sort"
              label="排序"
              style={{ flex: 1 }}
            >
              <InputNumber
                placeholder="数字越小越靠前"
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={0}>草稿</Option>
              <Option value={1}>已上架</Option>
              <Option value={2}>已下架</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="课程详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={550}
      >
        {detailCourse && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div
                style={{
                  width: 80,
                  height: 60,
                  borderRadius: 4,
                  overflow: 'hidden',
                  backgroundColor: '#f5f5f5',
                }}
              >
                {detailCourse.cover ? (
                  <Image
                    width={80}
                    height={60}
                    src={detailCourse.cover}
                    alt="课程封面"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    preview={false}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOutlined style={{ fontSize: 24, color: '#ccc' }} />
                  </div>
                )}
              </div>
            </div>

            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="课程名称">{detailCourse.courseName}</Descriptions.Item>
              <Descriptions.Item label="课时数">{detailCourse.lessonCount || 0}</Descriptions.Item>
              <Descriptions.Item label="排序">{detailCourse.sort || 0}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getStatusColor(detailCourse.status)}>
                  {getStatusText(detailCourse.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="课程描述">
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {detailCourse.description || (
                    <span style={{ color: '#999' }}>
                      <FileTextOutlined style={{ marginRight: 4 }} />
                      暂无描述
                    </span>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{detailCourse.createTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{detailCourse.updateTime || '-'}</Descriptions.Item>
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
            确定要删除课程 <span style={{ color: '#ff4d4f', fontWeight: 600 }}>"{deletingCourseName}"</span> 吗？
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

export default CoursePage
