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
  DatePicker,
  message,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
  CalendarOutlined,
  PercentageOutlined,
} from '@ant-design/icons';
import AntNavigation from '@/components/AntNavigation';
import { trpc } from '@/lib/trpc';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Promotion {
  id: string;
  name: string;
  description: string;
  promotionType: string;
  discountValue: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'expired';
}

export default function Promotions() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { data: promotions, isLoading } = trpc.promotions.list.useQuery();
  const { data: products } = trpc.products.list.useQuery();

  const createPromotion = trpc.promotions.create.useMutation({
    onSuccess: () => {
      message.success('Promotion created successfully');
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const deletePromotion = trpc.promotions.delete.useMutation({
    onSuccess: () => {
      message.success('Promotion deleted successfully');
    },
  });

  const getPromotionStatus = (startDate: string, endDate: string): 'active' | 'scheduled' | 'expired' => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'scheduled';
    if (now > end) return 'expired';
    return 'active';
  };

  const promotionsData: Promotion[] = (promotions || []).map((p) => ({
    id: p.id.toString(),
    name: p.name,
    description: p.description || '',
    promotionType: p.promotionType,
    discountValue: p.discountValue || '0',
    startDate: p.startDate,
    endDate: p.endDate,
    status: getPromotionStatus(p.startDate, p.endDate),
  }));

  const columns: ColumnsType<Promotion> = [
    {
      title: 'Promotion Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'promotionType',
      key: 'promotionType',
      width: 120,
      render: (type: string) => (
        <Tag color="blue">{type.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Discount',
      dataIndex: 'discountValue',
      key: 'discountValue',
      width: 120,
      align: 'right',
      render: (value: string, record) => (
        <Tag color="green">
          {record.promotionType === 'percentage' ? `${value}%` : `N$${value}`}
        </Tag>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Scheduled', value: 'scheduled' },
        { text: 'Expired', value: 'expired' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        const colorMap = {
          active: 'green',
          scheduled: 'blue',
          expired: 'red',
        };
        return (
          <Tag color={colorMap[status as keyof typeof colorMap]}>
            {status.toUpperCase()}
          </Tag>
        );
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

  const handleEdit = (promotion: Promotion) => {
    form.setFieldsValue({
      ...promotion,
      dateRange: [dayjs(promotion.startDate), dayjs(promotion.endDate)],
    });
    setIsModalVisible(true);
  };

  const handleDelete = (promotion: Promotion) => {
    Modal.confirm({
      title: 'Delete Promotion',
      content: `Are you sure you want to delete "${promotion.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        deletePromotion.mutate({ id: parseInt(promotion.id) });
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const [startDate, endDate] = values.dateRange;
      createPromotion.mutate({
        name: values.name,
        description: values.description,
        promotionType: values.promotionType,
        discountValue: values.discountValue.toString(),
        bonusPattern: values.bonusPattern || '',
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        productIds: values.productIds || [],
      });
    });
  };

  const activePromotions = promotionsData.filter(p => p.status === 'active').length;
  const scheduledPromotions = promotionsData.filter(p => p.status === 'scheduled').length;
  const expiredPromotions = promotionsData.filter(p => p.status === 'expired').length;

  return (
    <AntNavigation>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>Promotions Management</Title>
            <Text type="secondary">
              Manage time-bound promotional discounts applied as the 3rd column in pricing
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setIsModalVisible(true)}
          >
            Create Promotion
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Active Promotions"
                value={activePromotions}
                prefix={<GiftOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Scheduled"
                value={scheduledPromotions}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Expired"
                value={expiredPromotions}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Table
            columns={columns}
            dataSource={promotionsData}
            loading={isLoading}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} promotions`,
            }}
          />
        </Card>

        <Modal
          title="Create Promotion"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          width={600}
          confirmLoading={createPromotion.isPending}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Promotion Name"
              rules={[{ required: true, message: 'Please enter promotion name' }]}
            >
              <Input placeholder="e.g., Summer Sale 2025" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
            >
              <TextArea
                rows={3}
                placeholder="Describe the promotion details..."
              />
            </Form.Item>

            <Form.Item
              name="promotionType"
              label="Discount Type"
              rules={[{ required: true }]}
              initialValue="percentage"
            >
              <Select>
                <Select.Option value="percentage">Percentage (%)</Select.Option>
                <Select.Option value="fixed">Fixed Amount (N$)</Select.Option>
                <Select.Option value="bonus">Bonus Pattern</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="discountValue"
              label="Discount Value"
              rules={[{ required: true, message: 'Please enter discount value' }]}
            >
              <InputNumber
                min={0}
                precision={2}
                style={{ width: '100%' }}
                placeholder="e.g., 10 for 10%"
              />
            </Form.Item>

            <Form.Item
              name="bonusPattern"
              label="Bonus Pattern (Optional)"
            >
              <Input placeholder="e.g., 10+2 (Buy 10, Get 2 Free)" />
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="Promotion Period"
              rules={[{ required: true, message: 'Please select date range' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="productIds"
              label="Apply to Products (Optional)"
            >
              <Select
                mode="multiple"
                placeholder="Select products (leave empty for all)"
                options={products?.map(p => ({
                  value: p.id.toString(),
                  label: p.name,
                }))}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </AntNavigation>
  );
}
