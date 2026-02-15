import { useGetMyFriendsQuery } from "../../../services/friendApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Avatar,
  Card,
  Spin,
  Row,
  Col,
  message,
  Typography,
  Space,
  Button,
} from "antd";
 
import {
  UserOutlined,
  MessageOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useFriendsApi,RelationRequestType } from "../../../hooks/useFriendsApi";
const { Title } = Typography;

const UserCard = ({ friend, onCardClick, onDelPal }) => {
  const { avatar, username } = friend;

  return (
    <Card
      onClick={() => onCardClick(friend.id)}
      hoverable
      style={{ width: "100%", textAlign: "center" }}
      cover={
        <Avatar
          size={80}
          icon={<UserOutlined />}
          src={avatar}
          style={{ margin: "16px auto" }}
        />
      }
    >
      <Card.Meta
        title={username}
        description={
          <div>
            <Space.Compact style={{ marginTop: 10 }}>
              <Button
                type="default"
                icon={<MessageOutlined />}
                onClick={() => console.log("发送消息")}
                title="发消息" // 添加悬停提示文字
              />
              <Button
                type="default"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => onDelPal(e, friend.id)}
                title="删除"
              />
            </Space.Compact>
          </div>
        }
      />
    </Card>
  );
};

const UserPalsPage = () => {
  const [page, setPage] = useState(1);
  const {  relationRequest } = useFriendsApi();
  const [api,contextHolder]=message.useMessage()
  const { data, isLoading, isFetching, isSuccess } = useGetMyFriendsQuery(page);
  const navigate = useNavigate();
  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (isLoading)
    return (
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Spin size="large" />
      </div>
    );

  if (!isSuccess || data.data.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Title style={{color:'#7c7c7cff'}} level={4}>暂无关注</Title>
      </div>
    );
  }
  const onCardClick = (friendId) => {
    navigate(`/users/${friendId}`);
  };

  const delPal = async (e, id) => {
    e.stopPropagation();
    
    const res =await relationRequest(id, RelationRequestType.unfollow)
      if(res.success){
        api.success('删除成功')
      }else{
        api.info("删除失败"+res.message)
      }
  };
  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>我的关注</Title>
      {contextHolder}
      <Row gutter={[16, 16]} justify="start">
        {data?.data.map((friend) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={friend.id}>
            <UserCard
              onDelPal={(e, id) => delPal(e, id)}
              onCardClick={onCardClick}
              friend={friend}
            />
          </Col>
        ))}
      </Row>

      {!isFetching && data.length > 0 && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button onClick={loadMore} loading={isFetching}>
            加载更多
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserPalsPage;
