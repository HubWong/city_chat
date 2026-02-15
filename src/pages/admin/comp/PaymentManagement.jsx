
import React, { useState } from "react";
import { Table, Tag, Space, Button, Select, Pagination,Tooltip } from "antd";
import dayjs from 'dayjs';

import { useGetPaymentListQuery } from "../hook/adminApi";
const { Option } = Select;

const PaymentManagement = () => {
  const [pg, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading, isError, error } = useGetPaymentListQuery(pg);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const { data: payments = [], total = 0 } = data || {};

  const columns = [
    {
      title: "交易ID",
      dataIndex: "transaction_id",
      key: "transaction_id",
      width: 220,
      fixed: 'left'
    },
    {
      title: "用户ID",
      dataIndex: "user_id",
      key: "user_id",
      width: 100
    },
    {
      title: "金额",
      key: "amount",
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>
          {record.amount} {record.currency}
        </span>
      ),
      align: 'right'
    },
    {
      title: "类型/方式",
      key: "payment_info",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Tag color={record.payment_type === "refund" ? "orange" : "blue"}>
            {record.payment_type}
          </Tag>
          <span>{record.payment_method}</span>
        </Space>
      )
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Tooltip title={record.error_message || ''}>
          <Tag color={{
            pending: "gold",
            success: "green",
            failed: "red",
            refunded: "purple",
          }[status]}>
            {status.toUpperCase()}
          </Tag>
        </Tooltip>
      )
    },
    {
      title: "时间",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      width: 160
    },
    {
      title: "操作",
      key: "action",
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small">详情</Button>
          {record.original_payment_id && (
            <Button type="link" size="small">原交易</Button>
          )}
        </Space>
      )
    }
  ];
  

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>支付管理</h2>
      <div style={{ marginBottom: 16 }}>
        <Select
          defaultValue="all"
          style={{ width: 120 }}
          onChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
        >
          <Option value="all">全部状态</Option>
          <Option value="pending">处理中</Option>
          <Option value="success">成功</Option>
          <Option value="failed">失败</Option>
          <Option value="refunded">已退款</Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={payments}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        bordered
        scroll={{ x: "max-content" }}
      />
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Pagination
          current={pg}
          total={total}
          onChange={setPage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default PaymentManagement;
