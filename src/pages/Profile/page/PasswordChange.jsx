
import { useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import { useAuthApi } from '../../../hooks/useAuthApi'
import './PasswordChange.css';

const PasswordChange = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [api, contextHolder] = message.useMessage()
  const { changePwd } = useAuthApi()
  const onFinish = async (values) => {
    setLoading(true)
  
    // 这里可以调用 API 修改密码
    const res = await changePwd(values)
    if (res.success) {
      api.success('密码修改成功！');

    } else {
      api.error(res.message)
    }
    form.resetFields();
    setLoading(false)
  };

  return (
    <div className="password-change-container">
      {contextHolder}
      <div className="password-change-card">
        <h2 className="password-change-title">修改密码</h2>
        {loading && <Spin tip="loading" />}
        <Form
          form={form}
          name="passwordChange"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="当前密码"
            name="old_password"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="new_password"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PasswordChange;