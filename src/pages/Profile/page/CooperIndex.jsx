import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import useCooperApi from '../hook/useCooperApi';
import { useReduxAuth } from '../../../hooks/useReduxAuth';
import { useGetCooperQuery } from '../../../services/cooperApi';


const CooperIndex = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = message.useMessage();
  const { user } = useReduxAuth()

  const { data: meta, isSuccess, isLoading } = useGetCooperQuery(user?.id)
  const [btnTxt, setBtnTxt] = useState("创建")
  const { addOrUpdateCooper } = useCooperApi();

  useEffect(() => {
    if (isSuccess && meta?.success) {
      const { data } = meta

      form.setFieldsValue({
        cooper_name: data.cooper_name,
        tel: data.tel,
        contact_person: data.contact_person,
        wchat: data.wchat ?? undefined,
        id: data.id,
        address: data.address ?? undefined,
      });
      if (data.id) {
        setBtnTxt('更新')
      }
    }
  }, [isLoading]);

  const onFinish = async (values) => {
    try {
      setLoading(true);     
      let res;
      if (user) {
        res = await addOrUpdateCooper({ ...values }); // 传 user.id 让后端识别更新

      }

      if (res?.success) {
        api.success({ content: user.id ? '合作人信息更新成功！' : '合作人创建成功！' });
        // form.resetFields(); // 编辑场景通常不重置，可注释掉
      } else {
        api.error({ content: res?.message || '操作失败，请重试' });
      }
    } catch (err) {
      console.error('Submit error:', err);
      api.error({ content: '网络错误或服务异常' });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Form validation failed:', errorInfo);
    api.warning({ content: '请检查表单输入' });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      {contextHolder}

      <Card
        title={`${btnTxt}合伙人`}
        variant={false}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="加载中..." />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="姓名"
              name="cooper_name"
              rules={[
                { required: true, message: '请输入姓名' },
                { max: 50, message: '姓名不能超过50个字符' },
              ]}
            >
              <Input placeholder="请输入合作人姓名" />
            </Form.Item>
            <Form.Item name="id" noStyle>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              label="电话"
              name="tel"
              rules={[
                { required: true, message: '请输入电话' },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '请输入有效的11位中国大陆手机号',
                },
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>

            <Form.Item label="微信" name="wchat">
              <Input placeholder="可选，输入微信号或手机号" />
            </Form.Item>

            <Form.Item label="地址" name="address">
              <Input.TextArea
                placeholder="可选，详细地址"
                rows={2}
                maxLength={200}
                showCount
              />
            </Form.Item>
            <Form.Item label="联系人" name="contact_person">
              <Input placeholder="联系人" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                {`${btnTxt}信息`}
              </Button>

            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default CooperIndex;