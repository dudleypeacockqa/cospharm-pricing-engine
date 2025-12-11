import { Typography, Row, Col, Card, Statistic, Space, Tag, Divider, Button } from 'antd';
import {
  CalculatorOutlined,
  RiseOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import AntNavigation from '@/components/AntNavigation';
import { useLocation } from 'wouter';

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: <CalculatorOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      title: "3-Column Sequential Discount Engine",
      description: "Product Discount → Logistics Fee → Promotional Discount applied sequentially with mathematical precision in under 500ms",
      color: "#e6f7ff"
    },
    {
      icon: <RiseOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      title: "Real-Time Analytics",
      description: "Comprehensive dashboards showing discount allocation and pricing performance across your 50-product catalog",
      color: "#f6ffed"
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 32, color: '#faad14' }} />,
      title: "Complete Audit Trail",
      description: "Immutable logs capturing every calculation for 7-year compliance retention and full transparency",
      color: "#fffbe6"
    },
    {
      icon: <ApiOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      title: "Sage 200 Evolution Integration",
      description: "Sales staff never leave Sage - pricing is automatically calculated via API and populates 3 custom discount columns",
      color: "#f9f0ff"
    }
  ];

  const stats = [
    { title: 'Products Managed', value: 50, suffix: '', prefix: '' },
    { title: 'Calculation Speed', value: 500, suffix: 'ms', prefix: '<' },
    { title: 'Accuracy Rate', value: 99.9, suffix: '%', prefix: '' },
    { title: 'Admin Users', value: 3, suffix: '', prefix: '2-' },
  ];

  return (
    <AntNavigation>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Tag color="blue" style={{ marginBottom: 16 }}>ADMIN CONTROL CENTER</Tag>
          <Title level={1} style={{ marginBottom: 16 }}>
            CosPharm Pricing Engine
          </Title>
          <Paragraph style={{ fontSize: 18, color: '#595959', maxWidth: 800, margin: '0 auto' }}>
            Enterprise-grade pricing automation for pharmaceutical distribution. 
            Manage 50 products with annual pricing updates through a streamlined admin interface.
          </Paragraph>
          <Space style={{ marginTop: 24 }}>
            <Button 
              type="primary" 
              size="large" 
              icon={<CalculatorOutlined />}
              onClick={() => setLocation('/calculator')}
            >
              Open Calculator
            </Button>
            <Button 
              size="large" 
              icon={<ApiOutlined />}
              onClick={() => setLocation('/api-docs')}
            >
              View API Docs
            </Button>
          </Space>
        </div>

        <Divider />

        {/* Stats Section */}
        <Row gutter={[16, 16]}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Features Section */}
        <div>
          <Title level={2} style={{ marginBottom: 24 }}>
            Key Features
          </Title>
          <Row gutter={[16, 16]}>
            {features.map((feature, index) => (
              <Col xs={24} md={12} key={index}>
                <Card 
                  hoverable
                  style={{ height: '100%', background: feature.color }}
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {feature.icon}
                    <Title level={4} style={{ marginBottom: 8 }}>
                      {feature.title}
                    </Title>
                    <Paragraph style={{ marginBottom: 0, color: '#595959' }}>
                      {feature.description}
                    </Paragraph>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Problem/Solution Section */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card 
              title={<Text strong>❌ Without CosPharm Engine</Text>}
              bordered={false}
              style={{ background: '#fff1f0' }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text>• 20+ hours/week on manual Excel calculations</Text>
                <Text>• Zero visibility into 3-tier discount breakdown</Text>
                <Text>• High risk of calculation errors (~5% error rate)</Text>
                <Text>• Cannot scale with catalog growth</Text>
                <Text>• No audit trail for compliance</Text>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card 
              title={<Text strong>✅ With CosPharm Engine</Text>}
              bordered={false}
              style={{ background: '#f6ffed' }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Automated calculations in under 500ms</Text>
                <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Complete 3-column discount transparency</Text>
                <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> 99.9% accuracy guarantee</Text>
                <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Scales effortlessly to any catalog size</Text>
                <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Immutable audit trail (7-year retention)</Text>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* CTA Section */}
        <Card style={{ background: '#001529', textAlign: 'center' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Title level={3} style={{ color: 'white', marginBottom: 0 }}>
              Ready to Transform Your Pricing Operations?
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 16, marginBottom: 0 }}>
              Join the future of pharmaceutical pricing automation with Sage 200 Evolution integration.
            </Paragraph>
            <Button 
              type="primary" 
              size="large" 
              icon={<ArrowRightOutlined />}
              onClick={() => setLocation('/products')}
            >
              Manage Products
            </Button>
          </Space>
        </Card>
      </Space>
    </AntNavigation>
  );
}
