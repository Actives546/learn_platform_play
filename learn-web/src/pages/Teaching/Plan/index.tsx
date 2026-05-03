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
  Progress,
  DatePicker,
  Tag,
} from 'antd'
import {
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  ScheduleOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  getTeachingPlanPage,
  getTeachingPlanById,
  addTeachingPlan,
  updateTeachingPlan,
  deleteTeachingPlan,
  getCoursePage,
  TeachingPlan,
  TeachingPlanForm,
  PageResult,
  Course,
} from '@/api/course'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input
const { RangePicker } = DatePicker

const statusMap = {
  0: { text: '未开始', color: 'default' },
  1: { text: '进行中', color: 'processing' },
  2: { text: '已完成', color: 'success' },
  3: { text: '已暂停', color: 'warning' },
}

const TeachingPlanPage = () => {
  const [loading, setLoading] = useState(false)
  const [teachingPlanList, setTeachingPlanList] = useState<TeachingPlan[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchPlanName, setSearchPlanName] = useState('')
  const [searchCourseId, setSearchCourseId] = useState<string | undefined>(undefined)
  const [searchStatus, setSearchStatus] = useState<number | undefined>(undefined)
  const [courseList, setCourseList] = useState<Course[]>([])
  const [courseLoading, setCourseLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增教学计划')
  const [editingTeachingPlan, setEditingTeachingPlan] = useState<TeachingPlan | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailTeachingPlan, setDetailTeachingPlan] = useState<TeachingPlan | null>(null)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deletingTeachingPlanId, setDeletingTeachingPlanId] = useState<string | null>(null)
  const [deletingTeachingPlanName, setDeletingTeachingPlanName] = useState('')
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

  const fetchTeachingPlanList = async (
    planNameParam?: string,
    courseIdParam?: string,
    statusParam?: number,
    pageNumParam?: number,
    pageSizeParam?: number
  ) => {
    setLoading(true)
    try {
      const params: {
        pageNum: number
        pageSize: number
        planName?: string
        courseId?: string
        status?: number
      } = {
        pageNum: pageNumParam !== undefined ? pageNumParam : pageNum,
        pageSize: pageSizeParam !== undefined ? pageSizeParam : pageSize,
      }

      const finalPlanName = planNameParam !== undefined ? planNameParam : searchPlanName
      if (finalPlanName && finalPlanName.trim() !== '') {
        params.planName = finalPlanName.trim()
      }

      const finalCourseId = courseIdParam !== undefined ? courseIdParam : searchCourseId
      if (finalCourseId && finalCourseId.trim() !== '') {
        params.courseId = finalCourseId
      }

      const finalStatus = statusParam !== undefined ? statusParam : searchStatus
      if (finalStatus !== undefined) {
        params.status = finalStatus
      }

      const res = await getTeachingPlanPage(params)
      if (res.code === 200 && res.data) {
        const pageResult = res.data as PageResult<TeachingPlan>
        setTeachingPlanList(pageResult.records || [])
        setTotal(pageResult.total || 0)
      }
    } catch (error) {
      console.error('获取教学计划列表失败:', error)
      message.error('获取教学计划列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasInitRef.current) return
    hasInitRef.current = true
    fetchCourseList()
    fetchTeachingPlanList()
  }, [])

  useEffect(() => {
    if (hasInitRef.current) {
      fetchTeachingPlanList()
    }
  }, [pageNum, pageSize])

  const handleSearch = () => {
    setPageNum(1)
    fetchTeachingPlanList(searchPlanName, searchCourseId, searchStatus, 1, pageSize)
  }

  const handleReset = () => {
    setSearchPlanName('')
    setSearchCourseId(undefined)
    setSearchStatus(undefined)
    setPageNum(1)
    fetchTeachingPlanList('', undefined, undefined, 1, pageSize)
  }

  const getCourseName = (courseId: string) => {
    const course = courseList.find(c => c.id === courseId)
    return course ? course.courseName : '-'
  }

  const getStatusTag = (status: number) => {
    const config = statusMap[status as keyof typeof statusMap] || statusMap[0]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const handleAdd = () => {
    setModalTitle('新增教学计划')
    setEditingTeachingPlan(null)
    form.resetFields()
    form.setFieldsValue({
      planName: '',
      description: '',
      progress: 0,
      status: 0,
    })
    setModalVisible(true)
  }

  const handleEdit = async (record: TeachingPlan) => {
    setModalTitle('编辑教学计划')
    setEditingTeachingPlan(record)
    try {
      const res = await getTeachingPlanById(record.id)
      if (res.code === 200 && res.data) {
        const data = res.data
        form.setFieldsValue({
          id: data.id,
          courseId: data.courseId,
          planName: data.planName,
          description: data.description || '',
          progress: data.progress || 0,
          status: data.status,
          weeklySchedule: data.weeklySchedule || '',
        })
        
        if (data.startTime && data.endTime) {
          form.setFieldsValue({
            dateRange: [dayjs(data.startTime), dayjs(data.endTime)]
          })
        }
        
        setModalVisible(true)
      }
    } catch (error) {
      console.error('获取教学计划详情失败:', error)
      message.error('获取教学计划详情失败')
    }
  }

  const handleView = async (record: TeachingPlan) => {
    try {
      const res = await getTeachingPlanById(record.id)
      if (res.code === 200 && res.data) {
        setDetailTeachingPlan(res.data)
        setDetailVisible(true)
      }
    } catch (error) {
      console.error('获取教学计划详情失败:', error)
      message.error('获取教学计划详情失败')
    }
  }

  const handleDeleteClick = (record: TeachingPlan) => {
    setDeletingTeachingPlanId(record.id)
    setDeletingTeachingPlanName(record.planName)
    setDeleteVisible(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingTeachingPlanId) return
    
    setDeleteLoading(true)
    try {
      const res = await deleteTeachingPlan(deletingTeachingPlanId)
      if (res.code === 200) {
        message.success('删除成功')
        setDeleteVisible(false)
        fetchTeachingPlanList()
      }
    } catch (error) {
      console.error('删除教学计划失败:', error)
      message.error('删除教学计划失败')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      const teachingPlanData: TeachingPlanForm = {
        courseId: values.courseId,
        planName: values.planName,
        description: values.description,
        progress: values.progress,
        status: values.status,
        weeklySchedule: values.weeklySchedule,
      }
      
      if (values.dateRange && values.dateRange.length === 2) {
        teachingPlanData.startTime = values.dateRange[0].toISOString()
        teachingPlanData.endTime = values.dateRange[1].toISOString()
      }
      
      if (editingTeachingPlan) {
        teachingPlanData.id = editingTeachingPlan.id
        const res = await updateTeachingPlan(teachingPlanData)
        if (res.code === 200) {
          message.success('更新成功')
          setModalVisible(false)
          fetchTeachingPlanList()
        }
      } else {
        const res = await addTeachingPlan(teachingPlanData)
        if (res.code === 200) {
          message.success('新增成功')
          setModalVisible(false)
          fetchTeachingPlanList()
        }
      }
    } catch (error) {
      console.error('保存教学计划失败:', error)
    }
  }

  const columns = [
    {
      title: '计划名称',
      dataIndex: 'planName',
      key: 'planName',
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
      title: '教学进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (progress: number) => (
        <Progress percent={progress || 0} size="small" />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => getStatusTag(status),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 160,
      ellipsis: true,
      render: (text: string) => text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 160,
      ellipsis: true,
      render: (text: string) => text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-',
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
      render: (_: unknown, record: TeachingPlan) => (
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
      className="teaching-plan-management-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 24,
        overflow: 'hidden',
      }}
    >
      <Title level={4} style={{ marginBottom: 24, flexShrink: 0 }}>
        <ScheduleOutlined style={{ marginRight: 12 }} />
        教学计划管理
      </Title>

      <Card
        style={{ marginBottom: 16, flexShrink: 0 }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Space wrap size="middle">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#666' }}>计划名称：</span>
            <Input
              placeholder="请输入计划名称"
              style={{ width: 180 }}
              value={searchPlanName}
              onChange={(e) => setSearchPlanName(e.target.value)}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#666' }}>状态：</span>
            <Select
              placeholder="全部状态"
              style={{ width: 120 }}
              allowClear
              value={searchStatus}
              onChange={(value) => setSearchStatus(value)}
            >
              <Option value={0}>未开始</Option>
              <Option value={1}>进行中</Option>
              <Option value={2}>已完成</Option>
              <Option value={3}>已暂停</Option>
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
            新增教学计划
          </Button>
        }
      >
        <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px 24px' }}>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={teachingPlanList}
              rowKey="id"
              pagination={paginationConfig}
              scroll={{ x: 1400, y: 500 }}
              locale={{ emptyText: '暂无教学计划数据' }}
            />
          </Spin>
        </div>
      </Card>

      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={700}
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
            name="planName"
            label="计划名称"
            rules={[{ required: true, message: '请输入计划名称' }]}
          >
            <Input placeholder="请输入计划名称" maxLength={200} />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="时间范围"
          >
            <RangePicker
              showTime
              style={{ width: '100%' }}
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>

          <Form.Item
            name="weeklySchedule"
            label="每周课时安排"
            extra="例如：周一:2, 周三:1, 周五:2"
          >
            <Input placeholder="请输入每周课时安排" maxLength={500} />
          </Form.Item>

          <Form.Item
            name="progress"
            label="教学进度"
          >
            <InputNumber
              placeholder="请输入教学进度（0-100）"
              min={0}
              max={100}
              style={{ width: '100%' }}
              formatter={value => `${value}%`}
              parser={value => value ? value.replace('%', '') : '0'}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={0}>未开始</Option>
              <Option value={1}>进行中</Option>
              <Option value={2}>已完成</Option>
              <Option value={3}>已暂停</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="计划描述"
          >
            <TextArea
              placeholder="请输入计划描述"
              rows={3}
              maxLength={1000}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="教学计划详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {detailTeachingPlan && (
          <div style={{ marginTop: 16 }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="计划名称">{detailTeachingPlan.planName}</Descriptions.Item>
              <Descriptions.Item label="所属课程">{getCourseName(detailTeachingPlan.courseId)}</Descriptions.Item>
              <Descriptions.Item label="教学进度">
                <Progress percent={detailTeachingPlan.progress || 0} />
              </Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(detailTeachingPlan.status)}</Descriptions.Item>
              <Descriptions.Item label="开始时间">
                {detailTeachingPlan.startTime ? dayjs(detailTeachingPlan.startTime).format('YYYY-MM-DD HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="结束时间">
                {detailTeachingPlan.endTime ? dayjs(detailTeachingPlan.endTime).format('YYYY-MM-DD HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="每周课时安排">
                {detailTeachingPlan.weeklySchedule || (
                  <span style={{ color: '#999' }}>
                    <FileTextOutlined style={{ marginRight: 4 }} />
                    暂无安排
                  </span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="计划描述">
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {detailTeachingPlan.description || (
                    <span style={{ color: '#999' }}>
                      <FileTextOutlined style={{ marginRight: 4 }} />
                      暂无描述
                    </span>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{detailTeachingPlan.createTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{detailTeachingPlan.updateTime || '-'}</Descriptions.Item>
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
            确定要删除教学计划 <span style={{ color: '#ff4d4f', fontWeight: 600 }}>"{deletingTeachingPlanName}"</span> 吗？
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

export default TeachingPlanPage
