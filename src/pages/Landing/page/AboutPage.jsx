import {
  Card,
  Typography,
  Divider,
  Grid,
  Space,
  Form,
  Input,
  Button,
  message,
} from "antd";
import {
  TeamOutlined,
  CodeOutlined,
  MailOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useAdminApi } from "../../admin/hook/useAdminApi";
import "./aboutPage.css";
import { useState } from "react";
import { getPcId } from "@/services/toolFuncs";
const { useBreakpoint } = Grid;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const AboutSection = () => {
 
  return (
    <Card className="about-card">
      <Space direction="vertical" size="middle">
        <Title level={3} className="section-title">
          <CodeOutlined /> 关于P2PChat
        </Title>
        <Paragraph className="section-content">
          P2PChat是一个基于在线约会应用,所有数据直接在用户设备间传输...
        </Paragraph>
      </Space>
    </Card>
  );
};

const HiringSection = () => {
  const screens = useBreakpoint();

  return (
    <Card className="hiring-card">
      <Space direction="vertical" size="middle">
        <Title level={3} className="section-title">
          <TeamOutlined /> 加入我们
        </Title>
        <Paragraph className="section-content">
          我们正在招聘前端工程师和后端工程师,要求熟悉WebRTC技术栈... <br />
          <MailOutlined /> hisen_2024@hotmail.com
        </Paragraph>
      </Space>
    </Card>
  );
};

const MessageSection = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const { leaveMsgToAdmin } = useAdminApi();
  const handleSubmit = async (values) => {
   
    values.pc_id = getPcId();
    setLoading(true);
    try {
     
      const res = await leaveMsgToAdmin(values);
      if (res.success) {
        message.success("留言提交成功");
        form.resetFields();
      } else {
        message.error(res.message || "留言提交失败");
      }
    } catch (error) {
      message.error("提交失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="message-card">
      <Form form={form} onFinish={handleSubmit}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={3} className="section-title">
            <MessageOutlined /> 留言反馈
          </Title>
          <Form.Item
            name="sender_name"
            rules={[{ required: true, message: "请输入您的姓名" }]}
          >
            <Input placeholder="您的姓名" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input placeholder="邮箱地址" />
          </Form.Item>
          <Form.Item
            name="msg_content"
            rules={[{ required: true, message: "请输入留言内容" }]}
          >
            <TextArea rows={4} placeholder="请输入您的留言..." />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="submit-button"
          >
            提交留言
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

const AboutPage = () => {
  const screens = useBreakpoint();

  return (
    <div className="about-container">
      <AboutSection />
      <Divider />
      <HiringSection />
      <Divider />
      <MessageSection />
    </div>
  );
};

export default AboutPage;
