import { Typography, Card, Space, Tabs, Alert, Divider, Table, Tag } from 'antd';
import {
  ApiOutlined,
  CheckCircleOutlined,
  CodeOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import AntNavigation from '@/components/AntNavigation';

const { Title, Paragraph, Text } = Typography;

export default function ApiDocs() {
  const endpointsColumns = [
    {
      title: 'Endpoint',
      dataIndex: 'endpoint',
      key: 'endpoint',
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: (method: string) => {
        const colors: Record<string, string> = {
          GET: 'blue',
          POST: 'green',
          PUT: 'orange',
          DELETE: 'red',
        };
        return <Tag color={colors[method]}>{method}</Tag>;
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const endpoints = [
    {
      key: '1',
      endpoint: '/api/pricing/calculate',
      method: 'POST',
      description: 'Calculate 3-column sequential discount pricing',
    },
    {
      key: '2',
      endpoint: '/api/products/{id}',
      method: 'GET',
      description: 'Get product base price and discount 1 (product discount)',
    },
    {
      key: '3',
      endpoint: '/api/customers/{id}',
      method: 'GET',
      description: 'Get customer logistics fee discount (discount 2)',
    },
    {
      key: '4',
      endpoint: '/api/promotions/active',
      method: 'GET',
      description: 'Get active promotional discounts (discount 3)',
    },
  ];

  const requestExample = `POST /api/pricing/calculate
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "productId": "PROD-001",
  "customerId": "CUST-123",
  "quantity": 10,
  "requestDate": "2025-01-15"
}`;

  const responseExample = `{
  "success": true,
  "calculation": {
    "productCode": "PROD-001",
    "productName": "Pharmaceutical Product 1",
    "quantity": 10,
    
    "basePrice": 100.00,
    
    "discount1": {
      "type": "product_discount",
      "percentage": 10.00,
      "amount": 10.00,
      "priceAfter": 90.00
    },
    
    "discount2": {
      "type": "logistics_fee",
      "percentage": 5.00,
      "amount": 4.50,
      "priceAfter": 85.50
    },
    
    "discount3": {
      "type": "promotional",
      "percentage": 3.00,
      "amount": 2.57,
      "priceAfter": 82.93,
      "promotionName": "Summer Sale 2025"
    },
    
    "finalUnitPrice": 82.93,
    "lineTotal": 829.30,
    "totalSavings": 170.70,
    "totalSavingsPercentage": 17.07
  },
  
  "sageIntegration": {
    "discountColumn1": "10.00",
    "discountColumn2": "5.00",
    "discountColumn3": "3.00",
    "lineTotal": "829.30"
  }
}`;

  const sageIntegrationCode = `// Sage 200 Evolution Web Services API Integration
// This code runs when a sales staff member adds a line item

async function onLineItemAdded(itemCode, customerId, quantity) {
  // Step 1: Call CosPharm Pricing Engine API
  const response = await fetch('https://cospharm.financeflo.ai/api/pricing/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      productId: itemCode,
      customerId: customerId,
      quantity: quantity,
      requestDate: new Date().toISOString()
    })
  });
  
  const data = await response.json();
  
  // Step 2: Populate Sage 200 Custom Fields
  // These 3 custom columns must be added to Sales Documents
  sageAPI.setCustomField('Discount_1', data.sageIntegration.discountColumn1);
  sageAPI.setCustomField('Discount_2', data.sageIntegration.discountColumn2);
  sageAPI.setCustomField('Discount_3', data.sageIntegration.discountColumn3);
  
  // Step 3: Set Line Total
  sageAPI.setLineTotal(data.sageIntegration.lineTotal);
  
  // Sales staff sees all 3 discount columns populated automatically
  // No manual calculation required!
}`;

  return (
    <AntNavigation>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>
            <ApiOutlined /> API Documentation
          </Title>
          <Paragraph type="secondary">
            Integration guide for Sage 200 Evolution Web Services API
          </Paragraph>
        </div>

        <Alert
          message="Seamless Sage Integration"
          description="Sales staff never leave Sage 200 Evolution. The pricing engine works silently in the background via API calls, automatically populating the 3 discount columns when line items are added to quotes, sales orders, or invoices."
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
        />

        <Card title="Overview">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Paragraph>
              The CosPharm Pricing Engine provides a RESTful API that integrates with Sage 200 Evolution's Web Services API. 
              When a sales staff member adds a product to a sales document, Sage makes an API call to calculate the final price 
              using the 3-column sequential discount logic.
            </Paragraph>
            
            <Title level={4}>Key Features</Title>
            <ul>
              <li><CheckCircleOutlined style={{ color: '#52c41a' }} /> <strong>Real-time Calculation:</strong> Sub-500ms response time</li>
              <li><CheckCircleOutlined style={{ color: '#52c41a' }} /> <strong>3-Column Discount Visibility:</strong> All discounts shown separately in Sage</li>
              <li><CheckCircleOutlined style={{ color: '#52c41a' }} /> <strong>Automatic Population:</strong> No manual entry required</li>
              <li><CheckCircleOutlined style={{ color: '#52c41a' }} /> <strong>Audit Trail:</strong> Every calculation logged for compliance</li>
            </ul>
          </Space>
        </Card>

        <Card title="Sequential Discount Logic">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Alert
              message="Important: Discounts are Applied Sequentially, NOT Additively"
              description="Each discount is applied to the result of the previous calculation, not to the original base price."
              type="warning"
              showIcon
            />
            
            <div>
              <Title level={5}>Step 1: Product Discount (Column 1)</Title>
              <Paragraph>
                <Text code>Price After Discount 1 = Base Price × (1 - Product Discount %)</Text>
              </Paragraph>
              <Paragraph type="secondary">
                Set annually by admin. Typically 5-15% based on product category.
              </Paragraph>
            </div>

            <Divider />

            <div>
              <Title level={5}>Step 2: Logistics Fee Discount (Column 2)</Title>
              <Paragraph>
                <Text code>Price After Discount 2 = Price After Discount 1 × (1 - Logistics Fee %)</Text>
              </Paragraph>
              <Paragraph type="secondary">
                Customer-specific logistics discount. Typically 3-10% based on volume tier.
              </Paragraph>
            </div>

            <Divider />

            <div>
              <Title level={5}>Step 3: Promotional Discount (Column 3)</Title>
              <Paragraph>
                <Text code>Final Price = Price After Discount 2 × (1 - Promotional Discount %)</Text>
              </Paragraph>
              <Paragraph type="secondary">
                Time-bound promotional campaigns. Typically 2-5% for limited periods.
              </Paragraph>
            </div>

            <Divider />

            <div>
              <Title level={5}>Final Calculation</Title>
              <Paragraph>
                <Text code>Line Total = Final Price × Quantity</Text>
              </Paragraph>
            </div>
          </Space>
        </Card>

        <Card>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: (
                  <span>
                    <DatabaseOutlined />
                    API Endpoints
                  </span>
                ),
                children: (
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Paragraph>
                      Base URL: <Text code>https://cospharm.financeflo.ai</Text>
                    </Paragraph>
                    <Table
                      columns={endpointsColumns}
                      dataSource={endpoints}
                      pagination={false}
                    />
                  </Space>
                ),
              },
              {
                key: '2',
                label: (
                  <span>
                    <CodeOutlined />
                    Request Example
                  </span>
                ),
                children: (
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Paragraph>
                      Example API request to calculate pricing for a line item:
                    </Paragraph>
                    <pre style={{
                      background: '#f5f5f5',
                      padding: 16,
                      borderRadius: 4,
                      overflow: 'auto',
                    }}>
                      <code>{requestExample}</code>
                    </pre>
                  </Space>
                ),
              },
              {
                key: '3',
                label: (
                  <span>
                    <ThunderboltOutlined />
                    Response Example
                  </span>
                ),
                children: (
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Paragraph>
                      The API returns a detailed breakdown including values for all 3 discount columns:
                    </Paragraph>
                    <pre style={{
                      background: '#f5f5f5',
                      padding: 16,
                      borderRadius: 4,
                      overflow: 'auto',
                      maxHeight: 500,
                    }}>
                      <code>{responseExample}</code>
                    </pre>
                  </Space>
                ),
              },
              {
                key: '4',
                label: (
                  <span>
                    <ApiOutlined />
                    Sage Integration Code
                  </span>
                ),
                children: (
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Alert
                      message="Implementation Note"
                      description="This integration code is added to Sage 200 Evolution's customization layer. Sales staff interaction remains unchanged - they simply add products to documents as usual."
                      type="info"
                      showIcon
                    />
                    <pre style={{
                      background: '#f5f5f5',
                      padding: 16,
                      borderRadius: 4,
                      overflow: 'auto',
                      maxHeight: 500,
                    }}>
                      <code>{sageIntegrationCode}</code>
                    </pre>
                  </Space>
                ),
              },
            ]}
          />
        </Card>

        <Card title="Sage 200 Evolution Custom Fields Setup">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Paragraph>
              To display the 3 discount columns in Sage 200 Evolution sales documents, the following custom fields must be added:
            </Paragraph>
            
            <Table
              columns={[
                { title: 'Field Name', dataIndex: 'field', key: 'field' },
                { title: 'Type', dataIndex: 'type', key: 'type' },
                { title: 'Description', dataIndex: 'description', key: 'description' },
              ]}
              dataSource={[
                {
                  key: '1',
                  field: 'Discount_1',
                  type: 'Decimal (2)',
                  description: 'Product Discount Percentage',
                },
                {
                  key: '2',
                  field: 'Discount_2',
                  type: 'Decimal (2)',
                  description: 'Logistics Fee Discount Percentage',
                },
                {
                  key: '3',
                  field: 'Discount_3',
                  type: 'Decimal (2)',
                  description: 'Promotional Discount Percentage',
                },
              ]}
              pagination={false}
            />

            <Alert
              message="Uriel Patsanza (Sage Consultant) will configure these custom fields during implementation."
              type="info"
              showIcon
            />
          </Space>
        </Card>

        <Card title="Authentication">
          <Paragraph>
            All API requests require a Bearer token in the Authorization header:
          </Paragraph>
          <pre style={{
            background: '#f5f5f5',
            padding: 16,
            borderRadius: 4,
          }}>
            <code>Authorization: Bearer YOUR_API_KEY</code>
          </pre>
          <Paragraph type="secondary" style={{ marginTop: 16 }}>
            API keys are generated in the admin portal and should be stored securely in Sage's configuration.
          </Paragraph>
        </Card>
      </Space>
    </AntNavigation>
  );
}
