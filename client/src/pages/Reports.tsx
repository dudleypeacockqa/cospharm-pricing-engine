import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Table,
  Tag,
  DatePicker,
  Select,
  Button,
  Divider,
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  DollarOutlined,
  UserOutlined,
  ShoppingOutlined,
  DownloadOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import AntNavigation from '@/components/AntNavigation';
import { trpc } from '@/lib/trpc';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface AuditLogEntry {
  id: string;
  productCode: string;
  customerCode: string;
  basePrice: number;
  productDiscount: number;
  logFeeDiscount: number;
  promotionDiscount: number;
  finalPrice: number;
  calculatedAt: string;
}

export default function Reports() {
  const { data: auditLog } = trpc.pricing.auditLog.useQuery();
  const { data: products } = trpc.products.list.useQuery();
  const { data: customers } = trpc.customers.list.useQuery();

  const totalCalculations = auditLog?.length || 0;
  const avgProductDiscount = auditLog && auditLog.length > 0
    ? auditLog.reduce((sum, log) => sum + parseFloat(log.productDiscount || '0'), 0) / auditLog.length
    : 0;
  
  const avgLogFeeDiscount = auditLog && auditLog.length > 0
    ? auditLog.reduce((sum, log) => sum + parseFloat(log.logFeeDiscount || '0'), 0) / auditLog.length
    : 0;

  const totalRevenue = auditLog && auditLog.length > 0
    ? auditLog.reduce((sum, log) => sum + parseFloat(log.finalPrice || '0'), 0)
    : 0;

  const auditColumns: ColumnsType<AuditLogEntry> = [
    {
      title: 'Timestamp',
      dataIndex: 'calculatedAt',
      key: 'calculatedAt',
      width: 180,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => new Date(a.calculatedAt).getTime() - new Date(b.calculatedAt).getTime(),
    },
    {
      title: 'Product',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 150,
    },
    {
      title: 'Customer',
      dataIndex: 'customerCode',
      key: 'customerCode',
      width: 150,
    },
    {
      title: 'Base Price',
      dataIndex: 'basePrice',
      key: 'basePrice',
      align: 'right',
      render: (price: number) => `N$${price.toFixed(2)}`,
    },
    {
      title: 'Disc 1 (%)',
      dataIndex: 'productDiscount',
      key: 'productDiscount',
      align: 'right',
      render: (val: number) => <Tag color="blue">{val.toFixed(2)}%</Tag>,
    },
    {
      title: 'Disc 2 (%)',
      dataIndex: 'logFeeDiscount',
      key: 'logFeeDiscount',
      align: 'right',
      render: (val: number) => <Tag color="orange">{val.toFixed(2)}%</Tag>,
    },
    {
      title: 'Disc 3 (%)',
      dataIndex: 'promotionDiscount',
      key: 'promotionDiscount',
      align: 'right',
      render: (val: number) => <Tag color="green">{val.toFixed(2)}%</Tag>,
    },
    {
      title: 'Final Price',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      align: 'right',
      render: (price: number) => <strong>N${price.toFixed(2)}</strong>,
    },
  ];

  const auditData: AuditLogEntry[] = (auditLog || []).map((log, index) => ({
    id: index.toString(),
    productCode: log.productId || 'N/A',
    customerCode: log.customerId || 'N/A',
    basePrice: parseFloat(log.basePrice || '0'),
    productDiscount: parseFloat(log.productDiscount || '0'),
    logFeeDiscount: parseFloat(log.logFeeDiscount || '0'),
    promotionDiscount: parseFloat(log.promotionDiscount || '0'),
    finalPrice: parseFloat(log.finalPrice || '0'),
    calculatedAt: log.createdAt || new Date().toISOString(),
  }));

  return (
    <AntNavigation>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2} style={{ marginBottom: 8 }}>
            <BarChartOutlined /> Reports & Analytics
          </Title>
          <Text type="secondary">
            Real-time insights into pricing calculations and discount allocation
          </Text>
        </div>

        {/* KPI Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Products"
                value={products?.length || 0}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>Active SKUs</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Customers"
                value={customers?.length || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>Active Accounts</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Calculations (30d)"
                value={totalCalculations}
                prefix={<LineChartOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>API Requests</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={totalRevenue}
                precision={2}
                prefix="N$"
                valueStyle={{ color: '#722ed1' }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>Calculated Value</Text>
            </Card>
          </Col>
        </Row>

        {/* Discount Analytics */}
        <Card title="Discount Analytics">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Statistic
                title="Avg. Product Discount (Column 1)"
                value={avgProductDiscount}
                precision={2}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title="Avg. Logistics Discount (Column 2)"
                value={avgLogFeeDiscount}
                precision={2}
                suffix="%"
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title="Avg. Total Discount"
                value={avgProductDiscount + avgLogFeeDiscount}
                precision={2}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
          </Row>
        </Card>

        {/* Filters */}
        <Card>
          <Space wrap>
            <RangePicker />
            <Select
              placeholder="Filter by Product"
              style={{ width: 200 }}
              allowClear
              options={products?.map(p => ({
                value: p.id,
                label: p.name,
              }))}
            />
            <Select
              placeholder="Filter by Customer"
              style={{ width: 200 }}
              allowClear
              options={customers?.map(c => ({
                value: c.id,
                label: c.name,
              }))}
            />
            <Button type="primary" icon={<FilterOutlined />}>
              Apply Filters
            </Button>
            <Button icon={<DownloadOutlined />}>
              Export CSV
            </Button>
          </Space>
        </Card>

        {/* Audit Log Table */}
        <Card title="Pricing Calculation Audit Log">
          <Table
            columns={auditColumns}
            dataSource={auditData}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} calculations`,
            }}
          />
        </Card>

        {/* Compliance Note */}
        <Card>
          <Space direction="vertical">
            <Title level={5}>Compliance & Audit Trail</Title>
            <Text>
              All pricing calculations are logged with immutable timestamps for regulatory compliance (POPIA, GDPR).
              Logs are retained for 7 years and can be exported for auditing purposes.
            </Text>
            <Divider />
            <Space>
              <Button type="primary" icon={<DownloadOutlined />}>
                Download Full Audit Report
              </Button>
              <Button>View Compliance Documentation</Button>
            </Space>
          </Space>
        </Card>
      </Space>
    </AntNavigation>
  );
}
