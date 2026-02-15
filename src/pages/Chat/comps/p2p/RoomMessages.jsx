import { Button } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useWebCxt } from '@/services/WebCxt'
import ChatBridge from "@/shared/model/chatBridge";
import { useMessages } from "@/services/msgCxt";
import { Messages, MsgModel } from "@/shared/model/msgModel";
import MsgItem from './MsgItem'

export default function RoomMessages({ mySid, room, roomMbrs }) {
  //const roomInitMsg = { room: room, msg_type: 'sys', from_user: 'sys', ts: Date.now(), data: { content: '临时房间已建立' } }
  const roomInitMsg = MsgModel.createSysRoomMsg(room)
  const { roomMsgs } = useMessages()
  const messageList = roomMsgs(room)
  const listEndRef = useRef(null);
  const { socket } = useWebCxt()

  const onMsg = useCallback((msg) => {
    if (msg.from_user === 'sys' && msg_type === 'left_room') {
      const nm = MsgModel.createSysRoomMsg(room, 'left')
      Messages.add(nm)
      return
    }

    Messages.add(msg, 'in')
  }, [messageList]);


  useEffect(() => {
    if (!socket) return;
    socket.on("text-message", onMsg);
    Messages.add(roomInitMsg)
  }, [socket]);

  // 自动滚动到底部
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);




  const getUser = useCallback((sid) => {
    if (!sid || sid === 'sys') return '系统';
    if (sid === mySid) return '我';
    const member = roomMbrs.find(x => x.to_sid === sid);
    return member?.username || '对方';
  }, [roomMbrs, mySid]);



  return (
    <div className="room-messages">
      <div className="flex flex-col h-screen bg-white">

        <div className="flex-1 overflow-y-auto p-2 pb-20"> {/* pb-20 预留输入框高度 */}
          <div>消息数: {messageList.length}
            <Button onClick={() => ChatBridge.clean()}>
              <CloseCircleOutlined />
            </Button> </div>
          {messageList && messageList.map((msg) => (
            <MsgItem key={msg.msg_id} m={msg} fromUser={getUser(msg.from_sid)} mySid />
          ))}

          <div ref={listEndRef} />
        </div>

      </div>
    </div>

  );

}