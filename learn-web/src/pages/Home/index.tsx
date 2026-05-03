import { useState, useEffect, useRef } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  message,
  Typography,
  Space,
} from 'antd'
import {
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  FileTextOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  EditOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import * as echarts from 'echarts'
import { getDashboardStats, DashboardStatsDTO } from '@/api/dashboard'

const { Title } = Typography

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null)
  const pieChartRef = useRef<HTMLDivElement>(null)
  const barChartRef = useRef<HTMLDivElement>(null)
  const pieChartInstance = useRef<echarts.ECharts | null>(null)
  const barChartInstance = useRef<echarts.ECharts | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await getDashboardStats()
      if (res.code === 200 && res.data) {
        setStats(res.data)
      } else {
        message.error('获取统计数据失败')
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
      message.error('获取统计数据失败')
    } finally {
      setLoading(false)
    }
  }

  const initPieChart = () => {
    if (!pieChartRef.current || !stats) return

    if (!pieChartInstance.current) {
      pieChartInstance.current = echarts.init(pieChartRef.current)
    }

    const courseStats = stats.courseStats
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
      },
      series: [
        {
          name: '课程状态',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: courseStats.publishedCount,
              name: '已上架',
              itemStyle: { color: '#52c41a' },
            },
            {
              value: courseStats.draftCount,
              name: '草稿',
              itemStyle: { color: '#1890ff' },
            },
            {
              value: courseStats.offlineCount,
              name: '已下架',
              itemStyle: { color: '#ff4d4f' },
            },
          ],
        },
      ],
    }

    pieChartInstance.current.setOption(option)
  }

  const initBarChart = () => {
    if (!barChartRef.current || !stats) return

    if (!barChartInstance.current) {
      barChartInstance.current = echarts.init(barChartRef.current)
    }

    const userStats = stats.userStats
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['学生', '老师'],
        axisLabel: {
          fontSize: 14,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '人数',
          type: 'bar',
          barWidth: '50%',
          data: [
            {
              value: userStats.studentCount,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#1890ff' },
                  { offset: 1, color: '#40a9ff' },
                ]),
                borderRadius: [8, 8, 0, 0],
              },
            },
            {
              value: userStats.teacherCount,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#52c41a' },
                  { offset: 1, color: '#73d13d' },
                ]),
                borderRadius: [8, 8, 0, 0],
              },
            },
          ],
          label: {
            show: true,
            position: 'top',
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
      ],
    }

    barChartInstance.current.setOption(option)
  }

  useEffect(() => {
    fetchStats()

    const handleResize = () => {
      pieChartInstance.current?.resize()
      barChartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      pieChartInstance.current?.dispose()
      barChartInstance.current?.dispose()
    }
  }, [])

  useEffect(() => {
    if (stats) {
      initPieChart()
      initBarChart()
    }
  }, [stats])

  return (
    <div
      style={{
        padding: 24,
        height: '100%',
        overflowY: 'auto',
        background: '#f0f2f5',
      }}
    >
      <Title level={3} style={{ marginBottom: 24, color: '#1a1a1a' }}>
        <RiseOutlined style={{ marginRight: 12 }} />
        数据统计看板
      </Title>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 12,
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <Statistic
                title={
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
                    学生总数
                  </span>
                }
                value={stats?.userStats?.studentCount || 0}
                prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.85)' }} />}
                valueStyle={{ color: 'white', fontWeight: 'bold' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: 12,
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <Statistic
                title={
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
                    老师总数
                  </span>
                }
                value={stats?.userStats?.teacherCount || 0}
                prefix={<TeamOutlined style={{ color: 'rgba(255,255,255,0.85)' }} />}
                valueStyle={{ color: 'white', fontWeight: 'bold' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: 12,
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <Statistic
                title={
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
                    课程总数
                  </span>
                }
                value={stats?.courseStats?.totalCount || 0}
                prefix={<BookOutlined style={{ color: 'rgba(255,255,255,0.85)' }} />}
                valueStyle={{ color: 'white', fontWeight: 'bold' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                borderRadius: 12,
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <Statistic
                title={
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
                    章节总数
                  </span>
                }
                value={stats?.chapterStats?.publishedCount || 0}
                prefix={<FileTextOutlined style={{ color: 'rgba(255,255,255,0.85)' }} />}
                valueStyle={{ color: 'white', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card
              title={
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <span>已上架课程</span>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: 12 }}
            >
              <Statistic
                value={stats?.courseStats?.publishedCount || 0}
                valueStyle={{ color: '#52c41a', fontWeight: 'bold', fontSize: 32 }}
                suffix={
                  <span style={{ fontSize: 14, color: '#666' }}>
                    占比 {stats?.courseStats?.totalCount ? ((stats.courseStats.publishedCount / stats.courseStats.totalCount) * 100).toFixed(1) : 0}%
                  </span>
                }
              />
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card
              title={
                <Space>
                  <EditOutlined style={{ color: '#1890ff' }} />
                  <span>草稿课程</span>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: 12 }}
            >
              <Statistic
                value={stats?.courseStats?.draftCount || 0}
                valueStyle={{ color: '#1890ff', fontWeight: 'bold', fontSize: 32 }}
                suffix={
                  <span style={{ fontSize: 14, color: '#666' }}>
                    占比 {stats?.courseStats?.totalCount ? ((stats.courseStats.draftCount / stats.courseStats.totalCount) * 100).toFixed(1) : 0}%
                  </span>
                }
              />
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card
              title={
                <Space>
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                  <span>已下架课程</span>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: 12 }}
            >
              <Statistic
                value={stats?.courseStats?.offlineCount || 0}
                valueStyle={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 32 }}
                suffix={
                  <span style={{ fontSize: 14, color: '#666' }}>
                    占比 {stats?.courseStats?.totalCount ? ((stats.courseStats.offlineCount / stats.courseStats.totalCount) * 100).toFixed(1) : 0}%
                  </span>
                }
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={24} lg={12}>
            <Card
              title={
                <Space>
                  <RiseOutlined style={{ color: '#fa8c16' }} />
                  <span>本月新增课程</span>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: 12, height: '100%' }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px 0',
                }}
              >
                <Statistic
                  value={stats?.courseStats?.thisMonthNewCount || 0}
                  valueStyle={{
                    color: '#fa8c16',
                    fontWeight: 'bold',
                    fontSize: 48,
                  }}
                />
                <span style={{ color: '#666', marginTop: 8 }}>门课程</span>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={24} lg={12}>
            <Card
              title={
                <Space>
                  <BookOutlined style={{ color: '#1890ff' }} />
                  <span>课程状态分布</span>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: 12, height: '100%' }}
            >
              <div ref={pieChartRef} style={{ height: 280 }} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card
              title={
                <Space>
                  <TeamOutlined style={{ color: '#52c41a' }} />
                  <span>用户统计</span>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: 12 }}
            >
              <div ref={barChartRef} style={{ height: 300 }} />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  )
}

export default Home
