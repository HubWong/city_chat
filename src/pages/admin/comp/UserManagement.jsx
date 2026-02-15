
import { Table, Button, Pagination, Space, Tag, Modal, Form, Input, Select, Switch } from 'antd';
import { useState } from 'react';
import { useGetUserListQuery } from '../hook/adminApi';

const { Option } = Select;

const UserManagement = () => {
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const { data, isLoading, isError, error } = useGetUserListQuery(page);
  const showModal = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      username: record.username,
      email: record.email,
      birth_year: parseInt(new Date().getFullYear() - record.birth_year),
      role: record.role,
      is_active: record.is_active,
      is_online: record.is_online
    });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        console.log('提交数据:', { ...currentRecord, ...values });
        setIsModalVisible(false);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const { data: users = [], total = 0 } = data || {};

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left'
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (text) => text || '--'
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (avatar) => (
        <img
          src={avatar || 'avatar_0_01.gif'}
          style={{ width: 32, height: 32, borderRadius: '50%' }}
          alt="avatar"
        />
      )
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200
    },
    {
      title: '地区',
      render: (_, record) => (
        <span>
          {record.ip_city || '--'}
          {record.ip_country && ` (${record.ip_country.toUpperCase()})`}
        </span>
      )
    },
    {
      title: '年龄',
      dataIndex: 'birth_year',
      render: (birth_year) => (parseInt(new Date().getFullYear() - birth_year))
    },
    {
      title: '状态',
      render: (_, record) => (
        <Space>
          <Tag color={record.is_active ? 'green' : 'red'}>
            {record.is_active ? '活跃' : '禁用'}
          </Tag>
          {record.is_online && <Tag color="blue">在线</Tag>}
        </Space>
      )
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: (role) => (
        <Tag
          color={{
            admin: 'red',
            editor: 'blue',
            vip: 'gold',
          }[role] || 'green'}
        >
          {role}
        </Tag>
      )
    },
    {
      title: '操作',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <>
          <Button type="link" size="small" onClick={() => showModal(record)}>
            编辑
          </Button>

        </>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>用户管理</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        bordered
        size="middle"
      />
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Pagination
          current={page}
          total={total}
          onChange={setPage}
          showSizeChanger={false}
        />
      </div>

      <Modal
        title="编辑用户"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="年龄" name="birth_year">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="角色" name="role">
            <Select>
              <Option value="admin">管理员</Option>
              <Option value="editor">编辑</Option>
              <Option value="vip">VIP用户</Option>
              <Option value="user">普通用户</Option>
            </Select>
          </Form.Item>
          <Form.Item label="活跃状态" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="在线状态" name="is_online" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
