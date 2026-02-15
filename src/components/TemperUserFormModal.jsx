import { useEffect } from "react";
import { Button, Input, Select, Form, Modal } from "antd";
import { useTemperUserForm } from '../hooks/useTemperUserForm';
import { useReduxAuth } from "../hooks/useReduxAuth";
import { getPcId } from "../services/toolFuncs";
import { years } from "@/shared/config";

const { Option } = Select;

const TemperUserFormModal = () => {
  const [form] = Form.useForm();
  const { user } = useReduxAuth();
  const { visible, onCancel, onsubmit, isLoading, setLoading } = useTemperUserForm();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      onsubmit(values);
      setLoading(false);
    } catch (error) {
      console.error("提交失败:", error);

    } finally {
      setLoading(false)
    }
  };

  // 监听 modal 打开或 user 变化，更新表单
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        username: user?.username ?? getPcId(true),
        gender: (user?.gender !== undefined ? String(user.gender) : '1'), // 转为字符串
        birth_year: user?.birth_year ?? new Date().getFullYear() - 18,
      });
    }
  }, [form, visible]);

  return (
    <Modal
      title="填写临时信息"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={isLoading}>
          提交
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="username"
          label="用户昵称"
          rules={[{ required: true, message: "请输入昵称" }]}
        >
          <Input placeholder="请输入昵称" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="性别"
          rules={[{ required: true, message: "请选择性别" }]}
        >
          <Select placeholder="请选择性别">
            <Option value="1">男</Option>
            <Option value="0">女</Option>
            <Option value="2">其他</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="birth_year"
          label="出生年份"
          rules={[{ required: true, message: "请选择出生年份" }]}
        >
          <Select placeholder="请选择出生年份">
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TemperUserFormModal;