import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  Typography,
  Empty,
  Input,
  Tooltip,
  message,
} from "antd";
import { SendOutlined, SmileOutlined } from "@ant-design/icons";
import { useWebCxt } from "../../../services/WebCxt";
import { useParams } from "react-router-dom";

import UserCard from "../../../components/UserCard";
const { Title, Text } = Typography;
const { Search } = Input;

const PubRoom = () => {
  const { name } = useParams();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { socket } = useWebCxt();
 

  const applySearchFilter = (list, term) => {
    return list.filter((user) =>
      user.username?.toLowerCase().includes(term?.toLowerCase())
    );
  };
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.emit("get_pubroom_users", name);
   
    socket.on("pubroom-users", (userList) => {
      setUsers(userList);
      setFilteredUsers(userList);
    });

    return () => {
      socket.off("pubroom-users");

      socket.emit("left_pubroom", name);
    };
  }, [socket]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter((user) => user.username?.toLowerCase().includes(term))
    );
  }, [searchTerm, users]);

  const handleChatStart = (user) => {
    
  };

  const tips = [
    "✨ 快去打个招呼吧，说不定是灵魂好友！",
    "👋 和新朋友聊天吧，缘分来了挡也挡不住～",
    "📢 点击头像即可发起聊天，别害羞～",
    "🎈 人与人之间，聊天就是连接的魔法～",
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <Card title="公共聊天室 - 在线用户" variant={false}>
      <Title level={4}>加入的用户</Title>
      <Search
        placeholder="搜索用户昵称"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />
      <Text type="secondary" style={{ marginBottom: 12, display: "block" }}>
        <SmileOutlined /> {randomTip}
      </Text>
      {filteredUsers.length === 0 ? (
        <Empty description="未找到用户" />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={filteredUsers}
          grid={{ gutter: 16, column: 3 }}  // 3列布局
          renderItem={(user) => (
            <List.Item
              actions={[
                <Tooltip title="点击聊天" key="chat">
                  <SendOutlined
                    style={{ fontSize: 18 }}
                    onClick={() => handleChatStart(user)}
                  />
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <UserCard onSelect={null} user={user} forMbr={false} />}

              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default PubRoom;
