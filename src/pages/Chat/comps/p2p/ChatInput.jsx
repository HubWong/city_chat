import React, { useState } from 'react';
import { Input, Button, Space, message } from 'antd';
import {
  SmileOutlined,
  SendOutlined,
} from '@ant-design/icons';
import ChatBridge from '@/shared/model/chatBridge';
import { MsgModel } from '@/shared/model/msgModel';
import ControlsBar from './ControlsBar';
import { ChatSystem } from '@/shared/model/chatSystem';
import { useWebCxt } from '@/services/WebCxt';

const ChatInput = ({ room, to_pc_id, roomMbrs }) => {
  const [text, setText] = useState('');
  const [api, contextHolder] = message.useMessage()
  const { user, socket } = useWebCxt()

  const curUser = ChatSystem.getActiveChatUser()
  const handleSend = () => {
    if (!text.trim()) return;
    if (!room) {
      api.error('no room data found')
      return
    }

    if (!curUser) {
      api.error('no target user to send.')
      return
    }

    const myMsg = MsgModel.createOutgoing(
      text.trim(),
      room,
      curUser,
      socket?.id,
      user)

    if (roomMbrs.length === 1) {
      myMsg.msg_type = 'notify'
    }

    ChatBridge.sendMsg(myMsg)
    setText("");
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onInvite = async () => {

    if (roomMbrs.length > 1) {
      api.info(`对方已在房间内`)
      return
    }
    const mdl = ChatBridge.sendInvite(user.username, room)
    if (mdl.success) {
      api.success('inivted.')
    }
    else {
      api.info(mdl.msg)
    }
  }

  return (
    <div className="chat-input">
      {contextHolder}
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <ControlsBar
            to_pc_id={to_pc_id}
            rmMbrs={roomMbrs}
            room={room} />
          <Button variant='info' icon={<SmileOutlined />} onClick={onInvite} type="text" >邀请对方</Button>
        </Space>
        <Input.TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPressEnter={handleKeyPress}
          autoSize={{ minRows: 1, maxRows: 4 }}
          placeholder="输入消息..."
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!text.trim()}
          style={{ alignSelf: 'flex-end' }}
        >
          发送
        </Button>
      </Space>
    </div>
  );
};

export default ChatInput;