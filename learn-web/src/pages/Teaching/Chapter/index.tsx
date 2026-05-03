import { useState, useEffect, useRef } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  message,
  Spin,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Descriptions,
  InputNumber,
  Tooltip,
  Popconfirm,
} from 'antd'
import {
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  OrderedListOutlined,
} from '@ant-design/icons'
import {
  getChapterPage,
  getChapterById,
  addChapter,
  updateChapter,
  deleteChapter,
  getCoursePage,
  Chapter,
  ChapterForm,
  PageResult,
  Course,
} from '@/api/course'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

const ChapterPage = () => {
  const [loading, setLoading] = useState(false)
  const [chapterList, setChapterList] = useState<Chapter[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchChapterName, setSearchChapterName] = useState('')
  const [searchCourseId, setSearchCourseId] = useState<string | undefined>(undefined)
  const [courseList, setCourseList] = useState<Course[]>([])
  const [courseLoading, setCourseLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增章节')
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailChapter, setDetailChapter] = useState<Chapter | null>(null)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deletingChapterId, setDeletingChapterId] = useState<string | null>(null)
  const [deletingChapterName, setDeletingChapterName] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [form] = Form.useForm()
  const hasInitRef = useRef(false)

  const fetchCourseList = async () => {
    setCourseLoading(true)
    try {
      const res = await getCoursePage({ pageNum: 1, pageSize: 1000 })
      if (res.code === 200 && res.data) {
        setCourseList(res.data.records || [])
      }
    } catch (error) {
      console.error('获取课程列表失败:', error)
    } finally {
      setCourseLoading(false)
    }
  }

  const fetchChapterList = async (
    chapterNameParam?: string,
    courseIdParam?: string,
    pageNumParam?: number,
    pageSizeParam?: number
  ) => {
    setLoading(true)
    try {
      const params: {
        pageNum: number
        pageSize: number
        chapterName?: string
        courseId?: string
      } = {
        pageNum: pageNumParam !== undefined ? pageNumParam : pageNum,
        pageSize: pageSizeParam !== undefined ? pageSizeParam : pageSize,
      }

      const finalChapterName = chapterNameParam !== undefined ? chapterNameParam : searchChapterName
      if (finalChapterName && finalChapterName.trim() !== '') {
        params.chapterName = finalChapterName.trim()
      }

      const finalCourseId = courseIdParam !== undefined ? courseIdParam : searchCourseId
      if (finalCourseId && finalCourseId.trim() !== '') {
        params.courseId = finalCourseId
      }

      const res = await getChapterPage(params)
      if (res.code === 200 && res.data) {
        const pageResult = res.data as PageResult<Chapter>
        setChapterList(pageResult.records || [])
        setTotal(pageResult.total || 0)
      }
    } catch (error) {
      console.error('获取章节列表失败:', error)
      message.error('获取章节列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasInitRef.current) return
    hasInitRef.current = true
    fetchCourseList()
    fetchChapterList()
  }, [])

  useEffect(() => {
    if (hasInitRef.current) {
      fetchChapterList()
    }
  }, [pageNum, pageSize])

  const handleSearch = () => {
    setPageNum(1)
    fetchChapterList(searchChapterName, searchCourseId, 1, pageSize)
  }

  const handleReset = () => {
    setSearchChapterName('')
    setSearchCourseId(undefined)
    setPageNum(1)
    fetchChapterList('', undefined, 1, pageSize)
  }

  const getCourseName = (courseId: string) => {
    const course = courseList.find(c => c.id === courseId)
    return course ? course.courseName : '-'
  }

  const handleAdd = () => {
    setModalTitle('新增章节')
    setEditingChapter(null)
    form.resetFields()
    form.setFieldsValue({
      chapterName: '',
      description: '',
      sort: 0,
    })
    setModalVisible(true)
  }

  const handleEdit = async (record: Chapter) => {
    setModalTitle('编辑章节')
    setEditingChapter(record)
    try {
      const res = await getChapterById(record.id)
      if (res.code === 200 && res.data) {
        form.setFieldsValue({
          id: res.data.id,
          courseId: res.data.courseId,
          chapterName: res.data.chapterName,
          description: res.data.description || '',
          sort: res.data.sort || 0,
        })
        setModalVisible(true)
      }
    } catch (error) {
      console.error('获取章节详情失败:', error)
      message.error('获取章节详情失败')
    }
  }

  const handleView = async (record: Chapter) => {
    try {
      const res = await getChapterById(record.id)
      if (res.code === 200 && res.data) {
        setDetailChapter(res.data)
        setDetailVisible(true)
      }
    } catch (error) {
      console.error('获取章节详情失败:', error)
      message.error('获取章节详情失败')
    }
  }

  const handleDeleteClick = (record: Chapter) => {
    setDeletingChapterId(record.id)
    setDeletingChapterName(record.chapterName)
    setDeleteVisible(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingChapterId) return
    
    setDeleteLoading(true)
    try {
      const res = await deleteChapter(deletingChapterId)
      if (res.code === 200) {
        message.success('删除成功')
        setDeleteVisible(false)
        fetchChapterList()
      }
    } catch (error) {
      console.error('删除章节失败:', error)
      message.error('删除章节失败')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      const chapterData: ChapterForm = {
        ...values,
      }
      
      if (editingChapter) {
        chapterData.id = editingChapter.id
        const res = await updateChapter(chapterData)
        if (res.code === 200) {
          message.success('更新成功')
          setModalVisible(false)
          fetchChapterList()
        }
      } else {
        const res = await addChapter(chapterData)
        if (res.code === 200) {
          message.success('新增成功')
          setModalVisible(false)
          fetchChapterList()
        }
      }
    } catch (error) {
      console.error('保存章节失败:', error)
    }
  }

  const columns = [
    {
      title: '章节名称',
      dataIndex: 'chapterName',
      key: 'chapterName',
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: '所属课程',
      dataIndex: 'courseId',
      key: 'courseId',
      width: 200,
      ellipsis: true,
      render: (courseId: string) => (
        <Tooltip title={getCourseName(courseId)}>
          <span>{getCourseName(courseId)}</span>
        </Tooltip>
      ),
    },
    {
      title: '章节描述',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      render: (sort: number) => sort ?? 0,
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
      render: (_: unknown, record: Chapter) => (
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
            title="确定要删除该章节吗？"
            description="删除后无法恢复，请谨慎操作"
            onConfirm={() => handleDeleteClick(record)}
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
    <div
      className="chapter-management-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 24,
        overflow: 'hidden',
      }}
    >
      <Title level={4} style={{ marginBottom: 24, flexShrink: 0 }}>
        <OrderedListOutlined style={{ marginRight: 12 }} />
        章节管理
      </Title>

      <Card
        style={{ marginBottom: 16, flexShrink: 0 }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Space wrap size="middle">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#666' }}>章节名称：</span>
            <Input
              placeholder="请输入章节名称"
              style={{ width: 180 }}
              value={searchChapterName}
              onChange={(e) => setSearchChapterName(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#666' }}>所属课程：</span>
            <Select
              placeholder="全部课程"
              style={{ width: 200 }}
              allowClear
              value={searchCourseId}
              onChange={(value) => setSearchCourseId(value)}
              loading={courseLoading}
            >
              {courseList.map(course => (
                <Option key={course.id} value={course.id}>
                  {course.courseName}
                </Option>
              ))}
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
            新增章节
          </Button>
        }
      >
        <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px 24px' }}>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={chapterList}
              rowKey="id"
              pagination={paginationConfig}
              scroll={{ x: 1250 }}
              locale={{ emptyText: '暂无章节数据' }}
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
            name="courseId"
            label="所属课程"
            rules={[{ required: true, message: '请选择所属课程' }]}
          >
            <Select
              placeholder="请选择所属课程"
              loading={courseLoading}
            >
              {courseList.map(course => (
                <Option key={course.id} value={course.id}>
                  {course.courseName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="chapterName"
            label="章节名称"
            rules={[{ required: true, message: '请输入章节名称' }]}
          >
            <Input placeholder="请输入章节名称" maxLength={200} />
          </Form.Item>

          <Form.Item
            name="description"
            label="章节描述"
          >
            <TextArea
              placeholder="请输入章节描述"
              rows={3}
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="sort"
            label="排序"
          >
            <InputNumber
              placeholder="数字越小越靠前"
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="章节详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={550}
      >
        {detailChapter && (
          <div style={{ marginTop: 16 }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="章节名称">{detailChapter.chapterName}</Descriptions.Item>
              <Descriptions.Item label="所属课程">{getCourseName(detailChapter.courseId)}</Descriptions.Item>
              <Descriptions.Item label="排序">{detailChapter.sort || 0}</Descriptions.Item>
              <Descriptions.Item label="章节描述">
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {detailChapter.description || (
                    <span style={{ color: '#999' }}>
                      <FileTextOutlined style={{ marginRight: 4 }} />
                      暂无描述
                    </span>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{detailChapter.createTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{detailChapter.updateTime || '-'}</Descriptions.Item>
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
            确定要删除章节 <span style={{ color: '#ff4d4f', fontWeight: 600 }}>"{deletingChapterName}"</span> 吗？
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

export default ChapterPage
