import { Result, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useLocation } from 'wouter';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #001529 0%, #002140 100%)',
    }}>
      <Result
        status="404"
        title={<span style={{ color: '#fff', fontSize: 48 }}>404</span>}
        subTitle={<span style={{ color: '#fff' }}>Sorry, the page you visited does not exist.</span>}
        extra={
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={() => setLocation('/')}
          >
            Back to Home
          </Button>
        }
      />
    </div>
  );
}
