import React, { useState } from "react";
import { Table, Button, Space, Tag, message, Card, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useGetAppMsgsQuery } from "../hook/adminApi";
import "./appMsgManagement.css";
import { useAdminApi } from "../hook/useAdminApi";

const { Title } = Typography;

const MessageTable = () => {
  const [pagination, setPagination] = useState(1);
  const { markMsgRead } = useAdminApi();
  const { data: messagesData, isLoading, isFetching,refetch } = useGetAppMsgsQuery(
    pagination
  );

  const markAsRead = async (id) => {
    if (!id) {
      message.error("id 没找到");
      return;
    }
    // 这里应该调用RTK Query的mutation来更新服务器状态
    const res = await markMsgRead(id);
    refetch()
    if (res) {
      message.success("标记为已读");
    } else {
      message.error("标记失败");
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: "发送人",
      dataIndex: "sender_name",
      key: "sender_name",
      render: (text, record) => (
        <Space>
          {text}
          {!record.viewed && <Tag color="red">未读</Tag>}
        </Space>
      ),
    },
    {
      title: "内容",
      dataIndex: "msg_content",
      key: "content",
    },
    {
      title: "时间",
      dataIndex: "created_at",
      key: "created_at",

      render: (text) =>
        new Intl.DateTimeFormat("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date(text)),
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          icon={<CheckOutlined />}
          onClick={() => markAsRead(record.id)}
          disabled={record.read}
        >
          标记已读
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={messagesData?.data || []}
      rowKey="id"
      loading={isLoading || isFetching}
      pagination={{
        pagination,
        total: messagesData?.total || 0,
        showSizeChanger: true,
      }}
      onChange={handleTableChange}
      bordered
    />
  );
};

const AppMsgManagement = () => {
  return (
    <Card className="msg-management-card">
      <Title level={4} className="page-title">
        来自前端的消息
      </Title>
      <MessageTable />
    </Card>
  );
};

export default AppMsgManagement;
