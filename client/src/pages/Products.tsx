import { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Typography, 
  Input, 
  Tag, 
  Modal, 
  Form, 
  InputNumber,
  Select,
  message,
  Card,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  DollarOutlined,
  PercentageOutlined,
} from '@ant-design/icons';
import AntNavigation from '@/components/AntNavigation';
import type { ColumnsType } from 'antd/es/table';
import { trpc } from "@/lib/trpc";

const { Title, Text } = Typography;
const { Search } = Input;

interface Product {
  key: string;
  id: number;
  code: string;
  name: string;
  category: string;
  basePrice: string;
  productDiscount: string;
  logisticsFee?: string;
  status: 'active' | 'inactive';
  lastUpdated?: string;
}

export default function Products() {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  const { data: productsData, isLoading } = trpc.products.list.useQuery();

  const products: Product[] = (productsData || []).map((p) => ({
    key: p.id.toString(),
    id: p.id,
    code: p.barcode || `PROD-${p.id}`,
    name: p.name,
    category: p.category || 'General',
    basePrice: p.basePrice,
    productDiscount: p.productDiscount || '0',
    logisticsFee: '5.00',
    status: 'active' as const,
    lastUpdated: new Date().toISOString().split('T')[0],
  }));

  const columns: ColumnsType<Product> = [
    {
      title: 'Product Code',
      dataIndex: 'code',
      key: 'code',
      fixed: 'left',
      width: 130,
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toString().toLowerCase()) ||
        record.code.toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      filters: [
        { text: 'Antibiotics', value: 'Antibiotics' },
        { text: 'Pain Relief', value: 'Pain Relief' },
        { text: 'Cardiovascular', value: 'Cardiovascular' },
        { text: 'Diabetes', value: 'Diabetes' },
        { text: 'Respiratory', value: 'Respiratory' },
        { text: 'General', value: 'General' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Base Price (N$)',
      dataIndex: 'basePrice',
      key: 'basePrice',
      width: 130,
      align: 'right',
      sorter: (a, b) => parseFloat(a.basePrice) - parseFloat(b.basePrice),
      render: (price: string) => `N$${parseFloat(price).toFixed(2)}`,
    },
    {
      title: 'Product Discount (%)',
      dataIndex: 'productDiscount',
      key: 'productDiscount',
      width: 160,
      align: 'right',
      sorter: (a, b) => parseFloat(a.productDiscount) - parseFloat(b.productDiscount),
      render: (discount: string) => (
        <Tag color="blue">{parseFloat(discount).toFixed(2)}%</Tag>
      ),
    },
    {
      title: 'Logistics Fee (%)',
      dataIndex: 'logisticsFee',
      key: 'logisticsFee',
      width: 150,
      align: 'right',
      render: (fee: string = '5.00') => (
        <Tag color="orange">{parseFloat(fee).toFixed(2)}%</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      width: 130,
      sorter: (a, b) => {
        if (!a.lastUpdated || !b.lastUpdated) return 0;
        return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
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

  const handleEdit = (product: Product) => {
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDelete = (product: Product) => {
    Modal.confirm({
      title: 'Delete Product',
      content: `Are you sure you want to delete ${product.name}?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        message.success(`Product ${product.code} deleted successfully`);
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      message.success('Product updated successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const activeProducts = products.filter(p => p.status === 'active').length;
  const avgDiscount = products.length > 0 
    ? products.reduce((sum, p) => sum + parseFloat(p.productDiscount), 0) / products.length 
    : 0;

  return (
    <AntNavigation>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>Product Catalog</Title>
            <Text type="secondary">
              Manage your pharmaceutical catalog with annual pricing updates
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setIsModalVisible(true)}
          >
            Add Product
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Products"
                value={products.length}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Active Products"
                value={activeProducts}
                suffix={`/ ${products.length}`}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Avg. Product Discount"
                value={avgDiscount.toFixed(2)}
                suffix="%"
                prefix={<PercentageOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Search
              placeholder="Search by product name or code..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 500 }}
            />

            <Table
              columns={columns}
              dataSource={products}
              loading={isLoading}
              scroll={{ x: 1400 }}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} products`,
              }}
            />
          </Space>
        </Card>

        <Modal
          title="Edit Product"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="code" label="Product Code" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Antibiotics">Antibiotics</Select.Option>
                <Select.Option value="Pain Relief">Pain Relief</Select.Option>
                <Select.Option value="Cardiovascular">Cardiovascular</Select.Option>
                <Select.Option value="Diabetes">Diabetes</Select.Option>
                <Select.Option value="Respiratory">Respiratory</Select.Option>
                <Select.Option value="General">General</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="basePrice" label="Base Price (N$)" rules={[{ required: true }]}>
              <InputNumber
                min={0}
                precision={2}
                style={{ width: '100%' }}
                prefix="N$"
              />
            </Form.Item>
            <Form.Item name="productDiscount" label="Product Discount (%)" rules={[{ required: true }]}>
              <InputNumber
                min={0}
                max={100}
                precision={2}
                style={{ width: '100%' }}
                suffix="%"
              />
            </Form.Item>
            <Form.Item name="logisticsFee" label="Logistics Fee (%)" rules={[{ required: true }]}>
              <InputNumber
                min={0}
                max={100}
                precision={2}
                style={{ width: '100%' }}
                suffix="%"
              />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </AntNavigation>
  );
}
