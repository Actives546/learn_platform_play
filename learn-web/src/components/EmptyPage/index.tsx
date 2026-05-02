import { Card, Empty, Typography } from 'antd'

const { Title, Text } = Typography

interface EmptyPageProps {
  title: string
  description?: string
}

const EmptyPage = ({ title, description }: EmptyPageProps) => {
  return (
    <div className="empty-page">
      <Title level={4} style={{ marginBottom: 24 }}>{title}</Title>
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary">
              {description || '该功能正在开发中，敬请期待...'}
            </Text>
          }
        />
      </Card>
    </div>
  )
}

export default EmptyPage