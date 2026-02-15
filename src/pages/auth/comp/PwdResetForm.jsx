import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useAuthApi } from "../../../hooks/useAuthApi";
import { useNavigate, useParams } from "react-router-dom";
import useMessage from "antd/es/message/useMessage";

const PwdResetForm = () => {
  const { tkn } = useParams("tkn");

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, placeholder] = useMessage()
  const { lostPasswordReset } = useAuthApi();

  const onFinish = async (values) => {
    setLoading(true);
    try {

      const resp = await lostPasswordReset(values)
      if (resp.success === true) {
        messageApi.success("密码重置成功");

        navigate("/login");
        return;
      } else {
        messageApi.error(`重置密码失败: ${resp.message}`);
      }
    } catch (error) {
      messageApi.error("重置失败: " + error.message,);
    } finally {
      form.resetFields();
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      name="password_reset"
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item name="token" initialValue={tkn} noStyle />
      <Form.Item
        name="newPassword"
        label="新密码"
        rules={[
          { required: true, message: "请输入新密码" },
          { min: 8, message: "密码至少8个字符" },
        ]}
        hasFeedback
      >
        <Input.Password prefix={<LockOutlined />} placeholder="输入新密码" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="确认密码"
        dependencies={["newPassword"]}
        hasFeedback
        rules={[
          { required: true, message: "请确认密码" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("两次输入的密码不一致"));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="再次输入新密码"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          重置密码
        </Button>
      </Form.Item>
      {placeholder}
    </Form>
  );
};

export default PwdResetForm;
