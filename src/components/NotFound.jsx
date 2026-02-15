
import { Button, Result, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SmileOutlined } from '@ant-design/icons';

const { Content } = Layout;

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '80vh' }}>
      <Content style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Result
          status="404"
          icon={<SmileOutlined style={{ color: '#ff4d4f' }} />}
          title="404"
          subTitle="抱歉，您访问的页面不存在"
          extra={
            <Button 
              type="primary" 
              onClick={() => navigate('/')}
            >
              返回首页
            </Button>
          }
          style={{ maxWidth: '100%' }}
        />
      </Content>
    </Layout>
  );
};

export default NotFoundPage;
