import React, { useEffect, useState } from "react";
import { useAuthApi } from "../../../hooks/useAuthApi";
import { Form, Input, Button, Spin, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useReduxAuth } from "../../../hooks/useReduxAuth";

const ResetPwdRequest = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = message.useMessage();
  const { requestValidEmail } = useAuthApi();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 替换为实际API调用
      const resp = await requestValidEmail(values.email);
      if (resp.data.success) {
        api.success("重置链接已发送至邮箱");
        api.success(resp.data.message)
        form.resetFields();
        return;
      }
      api.error(resp.data.message);
      form.resetFields();
    } catch (error) {
      api.error(`重置链接发送失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const {loginVisible,hideLoginModal}=useReduxAuth()
  useEffect(()=>{
    if(loginVisible){
      hideLoginModal()
    }

  },[])


  return (
    <Form
      form={form}
      name="reset_request"
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 400, margin: '4em auto' }}
    >
      <Form.Item
        name="email"
        label="注册邮箱"
        rules={[
          { required: true, message: "请输入邮箱地址" },
          {
            type: "email",
            message: "请输入有效的邮箱格式",
          },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="example@domain.com" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          发送重置链接
        </Button>
      </Form.Item>
      {contextHolder}
    </Form>
  );
};

export default ResetPwdRequest;
