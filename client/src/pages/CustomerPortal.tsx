import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Table,
  Tag,
  Button,
  Descriptions,
  Tabs,
  Alert,
  Avatar,
  Divider,
} from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  HistoryOutlined,
  PercentageOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import AntNavigation from '@/components/AntNavigation';
import { trpc } from '@/lib/trpc';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface TransactionHistory {
  id: string;
  date: string;
  product: string;
  amount: number;
  status: string;
}

export default function CustomerView() {
  const params = useParams();
  const customerId = params.customerId || '1'; // Default for demo if not provided
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data since we don't have a specific single customer query yet
  const { data: customers } = trpc.customers.list.useQuery();
  const customer = customers?.find(c => c.id.toString() === customerId) || customers?.[0];

  const transactions: TransactionHistory[] = [
    { id: 'INV-001', date: '2025-12-10', product: 'Pharmaceutical Product A', amount: 1250.00, status: 'Paid' },
    { id: 'INV-002', date: '2025-12-08', product: 'Medical Supplies Bundle', amount: 3400.50, status: 'Pending' },
    { id: 'INV-003', date: '2025-11-25', product: 'Generic Antibiotics', amount: 890.00, status: 'Paid' },
  ];

  const columns: ColumnsType<TransactionHistory> = [
    {
      title: 'Invoice ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount) => `N$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Paid' ? 'success' : 'warning'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  if (!customer) {
    return (
      <AntNavigation>
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Title level={3}>Customer Not Found</Title>
          <Button type="primary" onClick={() => setLocation('/customers')}>
            Back to Directory
          </Button>
        </div>
      </AntNavigation>
    );
  }

  return (
    <AntNavigation>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => setLocation('/customers')}
            >
              Back
            </Button>
            <div>
              <Title level={2} style={{ margin: 0 }}>{customer.name}</Title>
              <Text type="secondary">Account ID: {customer.id}</Text>
            </div>
          </Space>
          <Space>
            <Button icon={<EditOutlined />}>Edit Details</Button>
            <Button type="primary">Create Quote</Button>
          </Space>
        </div>

        {/* Overview Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="Logistics Fee Discount"
                value={customer.logFeeDiscount}
                precision={2}
                suffix="%"
                prefix={<PercentageOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
              <Text type="secondary">Applied to all orders (Column 2)</Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="Total Orders (YTD)"
                value={124}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <Text type="secondary">Volume Tier: Gold</Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="Outstanding Balance"
                value={15420.50}
                precision={2}
                prefix="N$"
                valueStyle={{ color: '#faad14' }}
              />
              <Text type="secondary">Credit Limit: N$50,000</Text>
            </Card>
          </Col>
        </Row>

        {/* Main Content Tabs */}
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.TabPane tab={<span><UserOutlined />Profile</span>} key="overview">
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                  <Avatar size={120} icon={<UserOutlined />} style={{ backgroundColor: '#f0f2f5', color: '#1890ff', marginBottom: 16 }} />
                  <Title level={4}>{customer.name}</Title>
                  <Tag color="blue">{customer.customerType.toUpperCase()}</Tag>
                </Col>
                <Col xs={24} md={16}>
                  <Descriptions title="Contact Information" bordered column={1}>
                    <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
                      {customer.email || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><PhoneOutlined /> Phone</Space>}>
                      {customer.phone || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label={<Space><EnvironmentOutlined /> Address</Space>}>
                      123 Pharmaceutical Way, Windhoek, Namibia
                    </Descriptions.Item>
                    <Descriptions.Item label="Tax ID">
                      TAX-99887766
                    </Descriptions.Item>
                  </Descriptions>
                  
                  <Divider />
                  
                  <Alert
                    message="Pricing Rules"
                    description={`This customer receives a fixed ${parseFloat(customer.logFeeDiscount || '0').toFixed(2)}% logistics fee discount on all orders. This is applied sequentially after product discounts.`}
                    type="info"
                    showIcon
                  />
                </Col>
              </Row>
            </Tabs.TabPane>
            
            <Tabs.TabPane tab={<span><HistoryOutlined />Order History</span>} key="history">
              <Table 
                columns={columns} 
                dataSource={transactions} 
                rowKey="id"
                pagination={false}
              />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Space>
    </AntNavigation>
  );
}
