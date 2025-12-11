import { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
  Descriptions,
  Drawer,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
  PercentageOutlined,
} from '@ant-design/icons';
import AntNavigation from '@/components/AntNavigation';
import { trpc } from '@/lib/trpc';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerType: string;
  logFeeDiscount: string;
}

export default function Customers() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const { data: customers, isLoading } = trpc.customers.list.useQuery();

  const customersData: Customer[] = (customers || []).map((c) => ({
    id: c.id.toString(),
    name: c.name,
    email: c.email || '',
    phone: c.phone || '',
    customerType: c.customerType,
    logFeeDiscount: c.logFeeDiscount || '0',
  }));

  const columns: ColumnsType<Customer> = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (name: string, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div><strong>{name}</strong></div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.customerType}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <Space>
          <MailOutlined style={{ color: '#1890ff' }} />
          <Text>{email || 'N/A'}</Text>
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => (
        <Space>
          <PhoneOutlined style={{ color: '#52c41a' }} />
          <Text>{phone || 'N/A'}</Text>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'customerType',
      key: 'customerType',
      filters: [
        { text: 'Wholesaler', value: 'wholesaler' },
        { text: 'Retailer', value: 'retailer' },
        { text: 'Distributor', value: 'distributor' },
      ],
      onFilter: (value, record) => record.customerType === value,
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          wholesaler: 'blue',
          retailer: 'green',
          distributor: 'orange',
        };
        return <Tag color={colorMap[type] || 'default'}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Logistics Discount',
      dataIndex: 'logFeeDiscount',
      key: 'logFeeDiscount',
      align: 'right',
      sorter: (a, b) => parseFloat(a.logFeeDiscount) - parseFloat(b.logFeeDiscount),
      render: (discount: string) => (
        <Tag color="cyan" icon={<PercentageOutlined />}>
          {parseFloat(discount).toFixed(2)}%
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDrawerVisible(true);
  };

  const handleDelete = (customer: Customer) => {
    Modal.confirm({
      title: 'Delete Customer',
      content: `Are you sure you want to delete "${customer.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        message.success(`Customer "${customer.name}" deleted successfully`);
      },
    });
  };

  const wholesalerCount = customersData.filter(c => c.customerType === 'wholesaler').length;
  const retailerCount = customersData.filter(c => c.customerType === 'retailer').length;
  const avgDiscount = customersData.length > 0
    ? customersData.reduce((sum, c) => sum + parseFloat(c.logFeeDiscount), 0) / customersData.length
    : 0;

  return (
    <AntNavigation>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>Customer Directory</Title>
            <Text type="secondary">
              Manage customer accounts and logistics fee discount tiers
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setIsModalVisible(true)}
          >
            Add Customer
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Customers"
                value={customersData.length}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Wholesalers"
                value={wholesalerCount}
                prefix={<ShopOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Avg. Logistics Discount"
                value={avgDiscount}
                precision={2}
                suffix="%"
                prefix={<PercentageOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Table
            columns={columns}
            dataSource={customersData}
            loading={isLoading}
            rowKey="id"
            scroll={{ x: 1000 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} customers`,
            }}
          />
        </Card>

        <Modal
          title="Add New Customer"
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Customer Name"
              rules={[{ required: true, message: 'Please enter customer name' }]}
            >
              <Input placeholder="e.g., ABC Pharmaceuticals" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input placeholder="contact@example.com" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone"
            >
              <Input placeholder="+264 61 123 4567" />
            </Form.Item>

            <Form.Item
              name="customerType"
              label="Customer Type"
              rules={[{ required: true }]}
              initialValue="retailer"
            >
              <Select>
                <Select.Option value="wholesaler">Wholesaler</Select.Option>
                <Select.Option value="retailer">Retailer</Select.Option>
                <Select.Option value="distributor">Distributor</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="logFeeDiscount"
              label="Logistics Fee Discount (%)"
              rules={[{ required: true, message: 'Please enter discount percentage' }]}
            >
              <InputNumber
                min={0}
                max={100}
                precision={2}
                style={{ width: '100%' }}
                placeholder="e.g., 5.00"
              />
            </Form.Item>

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Add Customer
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Drawer
          title="Customer Details"
          placement="right"
          onClose={() => setIsDrawerVisible(false)}
          open={isDrawerVisible}
          width={500}
        >
          {selectedCustomer && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <Title level={4} style={{ marginTop: 16 }}>{selectedCustomer.name}</Title>
                <Tag color="blue">{selectedCustomer.customerType.toUpperCase()}</Tag>
              </div>

              <Descriptions column={1} bordered>
                <Descriptions.Item label="Email">
                  {selectedCustomer.email || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {selectedCustomer.phone || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Customer Type">
                  {selectedCustomer.customerType}
                </Descriptions.Item>
                <Descriptions.Item label="Logistics Discount">
                  <Tag color="cyan">{parseFloat(selectedCustomer.logFeeDiscount).toFixed(2)}%</Tag>
                </Descriptions.Item>
              </Descriptions>

              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button icon={<EditOutlined />}>Edit</Button>
                <Button danger icon={<DeleteOutlined />}>Delete</Button>
              </Space>
            </Space>
          )}
        </Drawer>
      </Space>
    </AntNavigation>
  );
}
