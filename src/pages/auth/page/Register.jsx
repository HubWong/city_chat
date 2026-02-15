import React, { useEffect } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined, CodeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../../services/authApi";
import styles from "./Register.module.css";
import { useWebCxt } from "../../../services/WebCxt";
import { useReduxAuth } from "../../../hooks/useReduxAuth";

// 验证函数
const validateEmailOrPhone = (e, value) => {
  if (!value) {
    return Promise.reject(new Error('请输入邮箱或手机号码'));
  }

  // 邮箱正则
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // 手机号码正则（这里以中国大陆手机号为例）
  const phoneRegex = /^1[3-9]\d{9}$/;

  if (emailRegex.test(value) || phoneRegex.test(value)) {
    return Promise.resolve();
  }

  return Promise.reject(new Error('请输入有效的邮箱或中国大陆手机号码'));
};
const Register = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const [api, contextHolder] = message.useMessage()
  const { ipInfo } = useWebCxt();
  const { pcId,hideLoginModal,loginVisible } = useReduxAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    if(loginVisible){
      hideLoginModal()
    }
  },[])
  const onFinish = async (values) => {
    values.ip_country_city = ipInfo?.country + ',' + ipInfo?.city;
    values.pc_id = pcId;
    try {
      const resp = await register(values).unwrap();
      if (resp.success === false) {
        api.error(resp.message);
        return false;
      } else {
        api.success('注册成功，前往登录吧');
        navigate("/login");
        return true;
      }
    } catch (error) {
      api.error(error?.data?.message || "注册失败，请重试");
    }
  };

  return (
    <div className={styles.container}>
      {contextHolder}
      <Card className={styles.card} title="注册">
        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="on"
          layout="vertical"
        >
          <Form.Item
            name="email"
             
            rules={[
              { validator: validateEmailOrPhone }
            ]}
          >
            <Input autoComplete="email" prefix={<UserOutlined />} placeholder="Email或手机号码" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码至少6个字符" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
              autoComplete="new-password"  // 👈 关键修复1：新密码
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
              size="large"
              autoComplete="new-password"  // 👈 关键修复2：同上（部分浏览器会配对识别）
            />
          </Form.Item>

          <Form.Item
            name="invite_code"
            rules={[{ required: false, message: '请输入邀请码' }]}
          >
            <Input
              prefix={<CodeOutlined />}
              placeholder="邀请码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
            >
              注册
            </Button>
          </Form.Item>

          <div className={styles.footer}>
            已有账号？
            <Link to="/login">立即登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
