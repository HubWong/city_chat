import { useEffect, useState } from "react";
import { List, Pagination, Spin, Empty, message } from "antd";
import {
  BellFilled,
  EyeFilled,
  UserAddOutlined,
  MessageFilled,
} from "@ant-design/icons";
import MessageItem from "./MessageItem";
import { useGetMsgListQuery } from '../../services/msgApi';
import { useMsgApi } from "./useMsgApi";

const messageTypes = {
  SYSTEM: { icon: <BellFilled />, color: "gold", label: "系统消息" },
  VISITOR: { icon: <EyeFilled />, color: "blue", label: "访客通知" },
  FRIEND_REQUEST: {
    icon: <UserAddOutlined />,
    color: "green",
    label: "好友请求",
  },
  NEW_MESSAGE: { icon: <MessageFilled />, color: "purple", label: "新消息" },
};

const MessagePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { ignoreMessage } = useMsgApi();
  const [api, contextHolder] = message.useMessage()
  const pageSize = 10;
  const ignoreMsg = async (id) => {
    try {
      await ignoreMessage(id);

    } catch (error) {
      api.error(error)
    }
  }
  const acceptReq = async (req) => {
    switch (req.message_type) {
      case "FRIEND_REQUEST":
        // 处理好友请求逻辑
        console.log(`同意好友请求: ${req.sender_id}`);
        break;
      case "NEW_MESSAGE":
      case "VISITOR":
      case "SYSTEM":
        // 处理系统消息逻辑
        console.log(`msg,visit,syst: ${req.content}`);
        break;
      default:
        console.log("未知消息类型");
        break;
    }

    await ignoreMsg(req.id);
  };
  const { data: responseData, isLoading, isError } = useGetMsgListQuery({
    page: currentPage,
    pgSize: pageSize,
  });

  useEffect(() => {
    if (!isLoading) {
    }
  }, [responseData]);

  if (isLoading) return <Spin spinning={isLoading} fullscreen />;
  if (isError) return <Empty description="加载失败，请重试" />;
  return (
    <div style={{ padding: 5 }}>
      <h3>近两周的信息</h3>
      {contextHolder}
      <List
        dataSource={responseData?.data || []}
        renderItem={(item) => (
          <MessageItem
            key={item.id}
            type={messageTypes[item.message_type]}
            content={item.content}
            time={item.created_at}
            isRead={item.is_read}
            hasDetail={item.message_type !== "SYSTEM"}
            sender_id={item.sender_id}
            onAccept={() => acceptReq(item)}
          />
        )}
        locale={{ emptyText: "暂无消息" }}
      />
      {responseData?.total > 0 && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Pagination
            current={currentPage}
            total={responseData?.total || 0}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default MessagePage;
