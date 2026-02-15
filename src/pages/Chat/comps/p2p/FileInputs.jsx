import { useRef } from "react";
import { Button, Tooltip } from "antd";
import {
  FileAddFilled,
  FileImageOutlined,
} from "@ant-design/icons";
import { MsgModel } from "@/shared/model/msgModel";
import useMessage from "antd/es/message/useMessage";
import ChatBridge from "@/shared/model/chatBridge";
import { useWebCxt } from "@/services/WebCxt";
import { ChatSystem } from "@/shared/model/chatSystem";

export default function FileInputs({ onFile, room, toSid }) {
  const imgRef = useRef(null);
  const fileRef = useRef(null);
  const { socket } = useWebCxt()
  const [api, contextHolder] = useMessage()
  const curUser = ChatSystem.getActiveChatUser()
  const { user } = useWebCxt()
  
  // 发送图片消息
  const handleSendImg = (e) => {

    if (!curUser && !toSid) {
      console.error('target user is undefined')
      return
    }

    const file = e.target.files?.[0];
    if (!file) return;


    // 限制文件类型和大小（可选）
    if (!file.type.startsWith('image/')) {
      api.warning('请选择图片文件');
      return;
    }
    const fs = file.size
    const mtLm = 1 * 1024 * 1024
    if (fs > mtLm) {
      api.error('图片超过1M请使用发送文件', 2)
      return
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (typeof base64 === 'string') {
        const model = MsgModel.createOutgoing(
          base64,
          room,
          curUser,
          socket.id,
          user,
          MsgModel.socketMsgType.chat_image)
        
        ChatBridge.sendMsg(model)
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input
        ref={imgRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleSendImg}
      />
      <input
        ref={fileRef}
        type="file"
        hidden
        onChange={e => onFile(e.target.files?.[0])}
      />
      {contextHolder}
      <Tooltip title="发送图片">
        <Button onClick={() => imgRef.current.click()}>
          <FileImageOutlined />
        </Button>
      </Tooltip>

      {/* <Tooltip title="发送文件">
        <Button onClick={() => fileRef.current.click()}>
          <FileAddFilled />
        </Button>
      </Tooltip> */}
    </>
  );
}
