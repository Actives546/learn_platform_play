import { Card, Row, Col, Statistic } from 'antd'
import {
  UserOutlined,
  BookOutlined,
  SolutionOutlined,
  LikeOutlined,
} from '@ant-design/icons'

const Home = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>欢迎使用智能在线学习平台</h2>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={12893}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="课程总数"
              value={528}
              prefix={<BookOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="学习完成数"
              value={8942}
              prefix={<SolutionOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="好评数"
              value={15623}
              prefix={<LikeOutlined style={{ color: '#eb2f96' }} />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="最近活动" bordered={false}>
            <div style={{ padding: '20px 0' }}>
              <p style={{ color: '#666' }}>暂无活动数据</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="快捷操作" bordered={false}>
            <div style={{ padding: '20px 0' }}>
              <p style={{ color: '#666' }}>暂无快捷操作</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home
