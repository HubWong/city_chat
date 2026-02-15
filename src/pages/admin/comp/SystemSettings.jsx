
import React, { useState } from 'react';
import { Card, Form, Input, InputNumber, Select, Checkbox, Button, Row, Col, Divider } from 'antd';
import { paymentPlans } from '@/shared/config';
import { useCreateOrUpdateServicesMutation } from '../hook/adminApi';
import { extractNumbers } from '../../../services/toolFuncs';
const SubscriptionForm = ({ selectedPlan, onSave }) => {
  const [form] = Form.useForm();
  form.setFieldsValue(selectedPlan || {});

  const [createOrUpdateServices] = useCreateOrUpdateServicesMutation();
  const handleSubmit = async (values) => {
    values.duration = extractNumbers(values.duration)[0]
    values.price = Number(values.price)
    try {
      await createOrUpdateServices(values);
      console.log(values)
      onSave(values);
    } catch (error) {
      console.error('Error updating service plan:', error);
    }
  };
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="name" label="套餐名称" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="price" label="价格" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="currency" label="货币" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="CNY">CNY</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="duration" label="有效期" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="features" label="包含功能">
        <Checkbox.Group style={{ width: '100%' }}>
          <Row>
            {['跨国消息发送', '无限制聊天', '优先客服支持', '8折优惠', '6折优惠'].map(item => (
              <Col span={8} key={item}>
                <Checkbox value={item}>{item}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Form.Item>
      <Button type="primary" htmlType="submit">保存修改</Button>
    </Form>
  );
};

const SystemManagement = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState(paymentPlans);

  const handleSave = (values) => {
    setPlans(plans.map(p => p.id === values.id ? values : p));
    console.log(values)
    console.log('saved plan')

  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        <Col span={12}>
          <h2>套餐列表</h2>
          <Row gutter={16}>
            {plans.map(plan => (
              <Col span={24} key={plan.id} style={{ marginBottom: 16 }}>
                <Card
                  hoverable
                  onClick={() => setSelectedPlan(plan)}
                  style={{ 
                    border: selectedPlan?.id === plan.id ? '2px solid #1890ff' : undefined,
                    cursor: 'pointer'
                  }}
                >
                  <h3>{plan.name}</h3>
                  <p>价格: {plan.currency}{plan.price}</p>
                  <p>有效期: {plan.duration}</p>
                  <Divider style={{ margin: '12px 0' }} />
                  <div>
                    {plan.features.map(f => (
                      <div key={f}>✓ {f}</div>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={12}>
          <h2>套餐详情</h2>
          {selectedPlan ? (
            <SubscriptionForm 
              selectedPlan={selectedPlan} 
              onSave={handleSave} 
            />
          ) : (
            <div>请从左侧选择套餐进行编辑</div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SystemManagement;
