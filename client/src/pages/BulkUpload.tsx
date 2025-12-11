import { useState } from 'react';
import {
  Card,
  Upload,
  Button,
  Space,
  Typography,
  Table,
  Tag,
  Alert,
  Steps,
  Progress,
  message,
  Row,
  Col,
  Statistic,
  Divider,
} from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileExcelOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import AntNavigation from '@/components/AntNavigation';
import { trpc } from '@/lib/trpc';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

interface UploadHistoryRecord {
  id: string;
  filename: string;
  uploadedAt: string;
  recordsProcessed: number;
  recordsUpdated: number;
  recordsFailed: number;
  status: 'success' | 'partial' | 'failed';
}

export default function BulkUpload() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const { data: uploadHistory, isLoading } = trpc.bulkUpload.history.useQuery();

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx,.xls,.csv',
    fileList,
    beforeUpload: (file) => {
      const isValidType = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'text/csv';
      
      if (!isValidType) {
        message.error('You can only upload Excel or CSV files!');
        return Upload.LIST_IGNORE;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false; // Prevent auto upload
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Please select a file first');
      return;
    }

    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      message.success('File uploaded successfully!');
      setFileList([]);
      setUploading(false);
    }, 2000);
  };

  const historyColumns: ColumnsType<UploadHistoryRecord> = [
    {
      title: 'Upload Date',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      width: 180,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime(),
    },
    {
      title: 'Filename',
      dataIndex: 'filename',
      key: 'filename',
      render: (name: string) => (
        <Space>
          <FileExcelOutlined style={{ color: '#52c41a' }} />
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Records Processed',
      dataIndex: 'recordsProcessed',
      key: 'recordsProcessed',
      align: 'right',
      render: (val: number) => <Text strong>{val}</Text>,
    },
    {
      title: 'Updated',
      dataIndex: 'recordsUpdated',
      key: 'recordsUpdated',
      align: 'right',
      render: (val: number) => <Tag color="green">{val}</Tag>,
    },
    {
      title: 'Failed',
      dataIndex: 'recordsFailed',
      key: 'recordsFailed',
      align: 'right',
      render: (val: number) => val > 0 ? <Tag color="red">{val}</Tag> : <Tag color="default">0</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = {
          success: { color: 'success', icon: <CheckCircleOutlined />, text: 'Success' },
          partial: { color: 'warning', icon: <CheckCircleOutlined />, text: 'Partial' },
          failed: { color: 'error', icon: <CloseCircleOutlined />, text: 'Failed' },
        };
        const { color, icon, text } = config[status as keyof typeof config] || config.failed;
        return <Tag color={color} icon={icon}>{text}</Tag>;
      },
    },
  ];

  const historyData: UploadHistoryRecord[] = (uploadHistory || []).map((record, index) => ({
    id: index.toString(),
    filename: record.filename || 'upload.xlsx',
    uploadedAt: record.uploadedAt || new Date().toISOString(),
    recordsProcessed: record.recordsProcessed || 0,
    recordsUpdated: record.recordsUpdated || 0,
    recordsFailed: record.recordsFailed || 0,
    status: record.recordsFailed === 0 ? 'success' : record.recordsUpdated > 0 ? 'partial' : 'failed',
  }));

  return (
    <AntNavigation>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2} style={{ marginBottom: 8 }}>
            <CloudUploadOutlined /> Bulk Product Upload
          </Title>
          <Text type="secondary">
            Upload Excel or CSV files to update product pricing and discounts in bulk
          </Text>
        </div>

        <Alert
          message="Annual Pricing Update Process"
          description="CosPharm updates pricing for 50 products annually. Use this tool to import updated base prices and discount rules from your Excel spreadsheet."
          type="info"
          showIcon
        />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <Card title="Upload File">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Dragger {...uploadProps} style={{ padding: '40px 20px' }}>
                  <p className="ant-upload-drag-icon">
                    <FileExcelOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for Excel (.xlsx, .xls) and CSV files. Maximum file size: 10MB.
                  </p>
                </Dragger>

                {fileList.length > 0 && (
                  <Button
                    type="primary"
                    onClick={handleUpload}
                    loading={uploading}
                    icon={<UploadOutlined />}
                    size="large"
                    block
                  >
                    {uploading ? 'Uploading...' : 'Start Upload'}
                  </Button>
                )}
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Card title="File Format Requirements">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Title level={5}>Required Columns:</Title>
                  <ul style={{ paddingLeft: 20 }}>
                    <li><Text code>product_code</Text> - Unique product identifier</li>
                    <li><Text code>product_name</Text> - Product name</li>
                    <li><Text code>base_price</Text> - Base price (N$)</li>
                    <li><Text code>product_discount</Text> - Product discount (%)</li>
                    <li><Text code>category</Text> - Product category</li>
                  </ul>
                </div>

                <Divider />

                <Button
                  type="dashed"
                  icon={<DownloadOutlined />}
                  block
                  href="/templates/bulk_upload_template.xlsx"
                  download
                >
                  Download Template File
                </Button>

                <Alert
                  message="Validation Rules"
                  description={
                    <ul style={{ paddingLeft: 20, margin: 0 }}>
                      <li>Product codes must be unique</li>
                      <li>Base price must be positive</li>
                      <li>Discounts must be 0-100%</li>
                    </ul>
                  }
                  type="warning"
                  showIcon
                />
              </Space>
            </Card>
          </Col>
        </Row>

        <Card title="Upload Process">
          <Steps
            current={fileList.length > 0 ? (uploading ? 1 : 0) : -1}
            items={[
              {
                title: 'Select File',
                description: 'Choose Excel or CSV file',
                icon: <FileExcelOutlined />,
              },
              {
                title: 'Validate',
                description: 'Check data format',
                icon: <CheckCircleOutlined />,
              },
              {
                title: 'Process',
                description: 'Update database',
                icon: <CloudUploadOutlined />,
              },
              {
                title: 'Complete',
                description: 'Review results',
                icon: <CheckCircleOutlined />,
              },
            ]}
          />
        </Card>

        <Card title="Upload History">
          <Table
            columns={historyColumns}
            dataSource={historyData}
            loading={isLoading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total ${total} uploads`,
            }}
          />
        </Card>

        <Card>
          <Space direction="vertical">
            <Title level={5}>Best Practices</Title>
            <Paragraph>
              <ul style={{ paddingLeft: 20 }}>
                <li>Always download and use the latest template file</li>
                <li>Validate your data in Excel before uploading</li>
                <li>Test with a small batch (5-10 products) first</li>
                <li>Keep a backup of your original pricing data</li>
                <li>Upload during off-peak hours to minimize disruption</li>
              </ul>
            </Paragraph>
          </Space>
        </Card>
      </Space>
    </AntNavigation>
  );
}
