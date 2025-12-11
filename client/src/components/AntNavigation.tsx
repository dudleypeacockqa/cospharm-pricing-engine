import { Layout, Menu, Typography, Space, Button } from 'antd';
import {
  HomeOutlined,
  CalculatorOutlined,
  ShoppingOutlined,
  TeamOutlined,
  GiftOutlined,
  UploadOutlined,
  BarChartOutlined,
  ApiOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useLocation } from 'wouter';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

interface AntNavigationProps {
  children: React.ReactNode;
}

export default function AntNavigation({ children }: AntNavigationProps) {
  const [location, setLocation] = useLocation();

  const menuItems: MenuItem[] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/calculator',
      icon: <CalculatorOutlined />,
      label: 'Pricing Calculator',
    },
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: 'Products',
    },
    {
      key: '/customers',
      icon: <TeamOutlined />,
      label: 'Customers',
    },
    {
      key: '/promotions',
      icon: <GiftOutlined />,
      label: 'Promotions',
    },
    {
      key: '/bulk-upload',
      icon: <UploadOutlined />,
      label: 'Bulk Upload',
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
    },
    {
      key: '/api-docs',
      icon: <ApiOutlined />,
      label: 'API Documentation',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setLocation(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 24px',
        background: '#001529'
      }}>
        <Space>
          <img 
            src="/sage-logo.svg" 
            alt="Sage" 
            style={{ height: 32, filter: 'brightness(0) invert(1)' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            CosPharm Admin Portal
          </Title>
        </Space>
        <Space>
          <Button type="text" icon={<SettingOutlined />} style={{ color: 'white' }}>
            Settings
          </Button>
        </Space>
      </Header>
      <Layout>
        <Sider 
          width={250} 
          style={{ 
            background: '#001529',
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0,
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ marginLeft: 250 }}>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: '#fff',
              borderRadius: 8,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
