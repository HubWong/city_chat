import { Typography, Button } from "antd";

import { useNavigate } from "react-router-dom";
const { Title } = Typography;

export default function RoomHeader({  mbrLen, leaveRoom,title = "USER ROOM" }) {
 const nav = useNavigate()
  return (
    <div  className="chat-header">
      <Title level={5} >聊天室成员: ({mbrLen}) 人</Title>
      <Button
        size="small"
        type="primary"
        shape="round"
        onClick={() => {
          if (window.confirm("是否彻离开房间")) {
            leaveRoom();
            nav(-1);
          } 
        }}
      >
        X
      </Button>
    </div>
  );
}
