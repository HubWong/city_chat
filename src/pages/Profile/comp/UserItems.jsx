// src/components/UserItems.jsx
import React, { useState } from 'react';
import { Form, InputNumber, Card, Button, message, Row, Col, Space, Select } from 'antd';
import { CheckCircleOutlined, UsergroupAddOutlined, PictureOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Option } = Select;

const UserItems = () => {
  const [chatForm] = Form.useForm();
  const [imageForm] = Form.useForm();
  const [chatLoading, setChatLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // 初始值
  const chatInitialValues = {
    chatDuration: 30,
    chatPrice: 5.0,
    chatTarget: 'stranger', // 默认：陌生人
  };

  const imageInitialValues = {
    imagePrice: 2.0,
  };

  // 保存聊天设置
  const handleSaveChat = async () => {
    try {
      const values = await chatForm.validateFields();
      setChatLoading(true);

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 600));
      console.log('聊天设置提交:', values);

      message.success({
        content: '✅ 聊天收费设置已保存',
        duration: 2,
      });
    } catch (errorInfo) {
      console.warn('聊天表单校验失败:', errorInfo);
      message.warning('请检查聊天设置填写是否完整');
    } finally {
      setChatLoading(false);
    }
  };

  // 保存图片设置
  const handleSaveImage = async () => {
    try {
      const values = await imageForm.validateFields();
      setImageLoading(true);

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 600));
      console.log('图片设置提交:', values);

      message.success({
        content: '✅ 图片资源收费设置已保存',
        duration: 2,
      });
    } catch (errorInfo) {
      console.warn('图片表单校验失败:', errorInfo);
      message.warning('请检查图片价格是否填写');
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className='priceSetup-card'>



      <Card
        title={
          <Space size="middle">
            <UsergroupAddOutlined style={{ color: '#1677ff' }} />
            <span>💬 聊天收费设置</span>
          </Space>
        }
        variant={false}
        style={{ marginBottom: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        <Form
          form={chatForm}
          layout="vertical"
          initialValues={chatInitialValues}
          autoComplete="off"
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="chatDuration"
                label="单次聊天时长（分钟）"
                rules={[{ required: true, message: '请输入时长' }]}
              >
                <InputNumber
                  min={1}
                  max={120}
                  step={5}
                  style={{ width: '100%' }}
                  placeholder="如：30"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                name="chatPrice"
                label="对应价格（元）"
                rules={[{ required: true, message: '请输入价格' }]}
              >
                <InputNumber
                  min={0.1}
                  step={0.5}
                  precision={1}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/¥\s?|(,*)/g, '')}
                  style={{ width: '100%' }}
                  placeholder="如：5.0"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                name="chatTarget"
                label="收费对象"
                rules={[{ required: true, message: '请选择收费群体' }]}
              >
                <Select placeholder="请选择">
                  <Option value="stranger">陌生人</Option>
                  <Option value="friend">好友</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button
              type="primary"
              onClick={handleSaveChat}
              loading={chatLoading}
              icon={<CheckCircleOutlined />}
            >
              {chatLoading ? '保存中...' : '保存聊天设置'}
            </Button>
          </div>
        </Form>
      </Card>


      <Card
        title={
          <Space size="middle">
            <PictureOutlined style={{ color: '#52c41a' }} />
            <span>🖼️ 图片资源收费设置</span>
          </Space>
        }
        variant={false}
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        <Form
          form={imageForm}
          layout="vertical"
          initialValues={imageInitialValues}
          autoComplete="off"
        >
          <Form.Item
            name="imagePrice"
            label="观看图片价格（元）"
            rules={[{ required: true, message: '请输入图片价格' }]}
            style={{ maxWidth: 300 }}
          >
            <InputNumber
              min={0.01}
              step={0.1}
              precision={2}
              formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/¥\s?|(,*)/g, '')}
              style={{ width: '100%' }}
              placeholder="如：2.00"
            />
          </Form.Item>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16
          }}>
            <Link to="/center/user_photos">⚙️ 设置收费图片</Link>
            <Button
              type="primary"
              onClick={handleSaveImage}
              loading={imageLoading}
              icon={<CheckCircleOutlined />}
            >
              {imageLoading ? '保存中...' : '保存图片设置'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UserItems;