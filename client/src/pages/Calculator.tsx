import { useState } from 'react';
import {
  Card,
  Form,
  Select,
  InputNumber,
  Button,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Statistic,
  Steps,
  Alert,
  Tag,
  Table,
} from 'antd';
import {
  CalculatorOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import AntNavigation from '@/components/AntNavigation';
import { trpc } from '@/lib/trpc';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;

interface CalculationResult {
  basePrice: number;
  productDiscount: number;
  priceAfterProductDiscount: number;
  logisticsFee: number;
  priceAfterLogistics: number;
  promotionalDiscount: number;
  finalPrice: number;
  totalSavings: number;
  quantity: number;
  lineTotal: number;
}

interface QuoteItem extends CalculationResult {
  key: string;
  productName: string;
}

export default function Calculator() {
  const [form] = Form.useForm();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  
  const { data: products } = trpc.products.list.useQuery();
  const { data: customers } = trpc.customers.list.useQuery();

  const calculatePrice = (values: any) => {
    const basePrice = parseFloat(values.basePrice) || 0;
    const productDiscount = parseFloat(values.productDiscount) || 0;
    const logisticsFee = parseFloat(values.logisticsFee) || 0;
    const promotionalDiscount = parseFloat(values.promotionalDiscount) || 0;
    const quantity = parseInt(values.quantity) || 1;

    // Step 1: Apply Product Discount
    const priceAfterProductDiscount = basePrice * (1 - productDiscount / 100);

    // Step 2: Apply Logistics Fee (as a discount)
    const priceAfterLogistics = priceAfterProductDiscount * (1 - logisticsFee / 100);

    // Step 3: Apply Promotional Discount
    const finalPrice = priceAfterLogistics * (1 - promotionalDiscount / 100);

    const totalSavings = basePrice - finalPrice;
    const lineTotal = finalPrice * quantity;

    setResult({
      basePrice,
      productDiscount,
      priceAfterProductDiscount,
      logisticsFee,
      priceAfterLogistics,
      promotionalDiscount,
      finalPrice,
      totalSavings,
      quantity,
      lineTotal,
    });
  };

  const handleAddToQuote = () => {
    if (!result) return;
    
    const selectedProduct = products?.find(p => p.id === form.getFieldValue('product'));
    const productName = selectedProduct?.name || 'Unknown Product';

    const newItem: QuoteItem = {
      ...result,
      key: Date.now().toString(),
      productName,
    };

    setQuoteItems([...quoteItems, newItem]);
  };

  const handleRemoveItem = (key: string) => {
    setQuoteItems(quoteItems.filter(item => item.key !== key));
  };

  const quoteColumns: ColumnsType<QuoteItem> = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
    },
    {
      title: 'Base Price',
      dataIndex: 'basePrice',
      key: 'basePrice',
      align: 'right',
      render: (val: number) => `N$${val.toFixed(2)}`,
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
      dataIndex: 'logisticsFee',
      key: 'logisticsFee',
      align: 'right',
      render: (val: number) => <Tag color="orange">{val.toFixed(2)}%</Tag>,
    },
    {
      title: 'Disc 3 (%)',
      dataIndex: 'promotionalDiscount',
      key: 'promotionalDiscount',
      align: 'right',
      render: (val: number) => <Tag color="green">{val.toFixed(2)}%</Tag>,
    },
    {
      title: 'Unit Price',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      align: 'right',
      render: (val: number) => `N$${val.toFixed(2)}`,
    },
    {
      title: 'Line Total',
      dataIndex: 'lineTotal',
      key: 'lineTotal',
      align: 'right',
      render: (val: number) => <strong>N${val.toFixed(2)}</strong>,
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.key)}
        />
      ),
    },
  ];

  const quoteTotal = quoteItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const quoteSavings = quoteItems.reduce((sum, item) => sum + (item.totalSavings * item.quantity), 0);

  return (
    <AntNavigation>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>
            <CalculatorOutlined /> 3-Column Sequential Discount Calculator
          </Title>
          <Paragraph type="secondary">
            Calculate final pricing with sequential discount application: Product Discount → Logistics Fee → Promotional Discount
          </Paragraph>
        </div>

        <Alert
          message="Sage 200 Evolution Integration"
          description="This calculation logic is automatically applied when sales staff add line items in Sage. The 3 discount columns are populated via API, and the final price appears in the line total."
          type="info"
          showIcon
          icon={<CheckCircleOutlined />}
        />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Input Parameters" bordered={false}>
              <Form
                form={form}
                layout="vertical"
                onFinish={calculatePrice}
                initialValues={{
                  quantity: 1,
                  basePrice: 100,
                  productDiscount: 10,
                  logisticsFee: 5,
                  promotionalDiscount: 3,
                }}
              >
                <Form.Item
                  name="product"
                  label="Select Product (Optional)"
                >
                  <Select
                    placeholder="Choose a product"
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={products?.map(p => ({
                      value: p.id,
                      label: p.name,
                    }))}
                    onChange={(value) => {
                      const product = products?.find(p => p.id === value);
                      if (product) {
                        form.setFieldsValue({
                          basePrice: parseFloat(product.basePrice),
                          productDiscount: parseFloat(product.productDiscount || '0'),
                        });
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="customer"
                  label="Select Customer (Optional)"
                >
                  <Select
                    placeholder="Choose a customer"
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={customers?.map(c => ({
                      value: c.id,
                      label: c.name,
                    }))}
                    onChange={(value) => {
                      const customer = customers?.find(c => c.id === value);
                      if (customer) {
                        form.setFieldsValue({
                          logisticsFee: parseFloat(customer.logFeeDiscount || '0'),
                        });
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="quantity"
                  label="Quantity"
                  rules={[{ required: true, message: 'Please enter quantity' }]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: '100%' }}
                    size="large"
                  />
                </Form.Item>

                <Divider />

                <Form.Item
                  name="basePrice"
                  label="Base Price (N$)"
                  rules={[{ required: true, message: 'Please enter base price' }]}
                >
                  <InputNumber
                    min={0}
                    precision={2}
                    style={{ width: '100%' }}
                    prefix="N$"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="productDiscount"
                  label={
                    <Space>
                      <Text>Column 1: Product Discount (%)</Text>
                      <Tag color="blue">Applied First</Tag>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Please enter product discount' }]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    precision={2}
                    style={{ width: '100%' }}
                    suffix="%"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="logisticsFee"
                  label={
                    <Space>
                      <Text>Column 2: Logistics Fee Discount (%)</Text>
                      <Tag color="orange">Applied Second</Tag>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Please enter logistics fee' }]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    precision={2}
                    style={{ width: '100%' }}
                    suffix="%"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="promotionalDiscount"
                  label={
                    <Space>
                      <Text>Column 3: Promotional Discount (%)</Text>
                      <Tag color="green">Applied Last</Tag>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Please enter promotional discount' }]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    precision={2}
                    style={{ width: '100%' }}
                    suffix="%"
                    size="large"
                  />
                </Form.Item>

                <Space style={{ width: '100%' }} direction="vertical">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    icon={<CalculatorOutlined />}
                  >
                    Calculate Final Price
                  </Button>
                  {result && (
                    <Button
                      type="default"
                      size="large"
                      block
                      icon={<PlusOutlined />}
                      onClick={handleAddToQuote}
                    >
                      Add to Quote
                    </Button>
                  )}
                </Space>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Calculation Breakdown" bordered={false}>
              {result ? (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Steps
                    direction="vertical"
                    current={3}
                    items={[
                      {
                        title: 'Base Price',
                        description: (
                          <Statistic
                            value={result.basePrice}
                            precision={2}
                            prefix="N$"
                            valueStyle={{ fontSize: 20 }}
                          />
                        ),
                      },
                      {
                        title: `Product Discount (${result.productDiscount}%)`,
                        description: (
                          <Space direction="vertical">
                            <Text type="secondary">
                              N${result.basePrice.toFixed(2)} × (1 - {result.productDiscount}%)
                            </Text>
                            <Statistic
                              value={result.priceAfterProductDiscount}
                              precision={2}
                              prefix="N$"
                              valueStyle={{ fontSize: 18, color: '#1890ff' }}
                            />
                          </Space>
                        ),
                        icon: <ArrowRightOutlined />,
                      },
                      {
                        title: `Logistics Fee Discount (${result.logisticsFee}%)`,
                        description: (
                          <Space direction="vertical">
                            <Text type="secondary">
                              N${result.priceAfterProductDiscount.toFixed(2)} × (1 - {result.logisticsFee}%)
                            </Text>
                            <Statistic
                              value={result.priceAfterLogistics}
                              precision={2}
                              prefix="N$"
                              valueStyle={{ fontSize: 18, color: '#faad14' }}
                            />
                          </Space>
                        ),
                        icon: <ArrowRightOutlined />,
                      },
                      {
                        title: `Promotional Discount (${result.promotionalDiscount}%)`,
                        description: (
                          <Space direction="vertical">
                            <Text type="secondary">
                              N${result.priceAfterLogistics.toFixed(2)} × (1 - {result.promotionalDiscount}%)
                            </Text>
                            <Statistic
                              value={result.finalPrice}
                              precision={2}
                              prefix="N$"
                              valueStyle={{ fontSize: 24, color: '#52c41a', fontWeight: 'bold' }}
                            />
                          </Space>
                        ),
                        icon: <CheckCircleOutlined />,
                      },
                    ]}
                  />

                  <Divider />

                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Card style={{ background: '#f0f2f5' }}>
                        <Statistic
                          title="Unit Price"
                          value={result.finalPrice}
                          precision={2}
                          prefix="N$"
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card style={{ background: '#e6f7ff' }}>
                        <Statistic
                          title={`Line Total (×${result.quantity})`}
                          value={result.lineTotal}
                          precision={2}
                          prefix="N$"
                          valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                        />
                      </Card>
                    </Col>
                  </Row>

                  <Alert
                    message="Sage Integration Note"
                    description={
                      <Space direction="vertical">
                        <Text>These 3 discount values will appear in separate columns in Sage 200 Evolution:</Text>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          <li><strong>Discount 1:</strong> {result.productDiscount}%</li>
                          <li><strong>Discount 2:</strong> {result.logisticsFee}%</li>
                          <li><strong>Discount 3:</strong> {result.promotionalDiscount}%</li>
                        </ul>
                        <Text>The <strong>Line Total</strong> in Sage will show: <strong>N${result.lineTotal.toFixed(2)}</strong></Text>
                      </Space>
                    }
                    type="success"
                    showIcon
                  />
                </Space>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <CalculatorOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
                  <Paragraph type="secondary" style={{ marginTop: 16 }}>
                    Enter values and click "Calculate Final Price" to see the breakdown
                  </Paragraph>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Quote Builder Section */}
        {quoteItems.length > 0 && (
          <Card 
            title={
              <Space>
                <Text strong>Quote Builder</Text>
                <Tag color="blue">{quoteItems.length} items</Tag>
              </Space>
            }
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Table
                columns={quoteColumns}
                dataSource={quoteItems}
                pagination={false}
                scroll={{ x: 1000 }}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={7} align="right">
                        <strong>Quote Total:</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <strong style={{ fontSize: 16, color: '#52c41a' }}>
                          N${quoteTotal.toFixed(2)}
                        </strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} />
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={7} align="right">
                        <Text type="secondary">Total Savings:</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <Text type="success">N${quoteSavings.toFixed(2)}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} />
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </Space>
          </Card>
        )}
      </Space>
    </AntNavigation>
  );
}
