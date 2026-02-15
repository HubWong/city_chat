import { useEffect, useState, useRef, useCallback } from "react";
import { message } from "antd";
import { useVideoCall } from "../hooks/useVideoCall";
import RoomMessages from "../comps/p2p/RoomMessages";
import { useWebCxt } from "../../../services/WebCxt";
import { useParams, useNavigate } from "react-router-dom";
import { useReduxAuth } from "../../../hooks/useReduxAuth";
import { getByRegex } from "../../../services/toolFuncs";
import { useFileShare } from "../hooks/useFileShare";
import { FileProgress } from '../comps/p2p/FileProgress'
import { ChatSystem } from "@/shared/model/chatSystem";
import ChatBridge from "@/shared/model/chatBridge";
import RoomHeader from "../comps/p2p/RoomHeader";
import RoomMembers from "../comps/p2p/RoomMembers";
import ChatInput from "../comps/p2p/ChatInput";
import { SocketUser } from "@/shared/model/appModels";
import { Messages } from "@/shared/model/msgModel";
import './P2pRoom.css'


export default function PrvRoom() {
  const { cId: room, init: fromId } = useParams();
  const { socket, connected } = useWebCxt();
  const [toSid, setToSid] = useState(null)
  const { user } = useReduxAuth();
  const curUser = ChatSystem.getActiveChatUser()

  const roomType = room.split('_')[0];
  const nav = useNavigate();
  const [roomMbrs, setMbrs] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
   
  const { progress, uploadFile, isUploading, downloadFileFn } = useFileShare(room)

  // const handleFileResp = (data) => {
  //   const { accept } = data
  //   if (accept) {
  //     messageApi.info('Accepted file transfer request.');
  //     uploadFile(fileInputRef.current, curUser.sid)

  //   } else {
  //     messageApi.warning('your request denied!')
  //   }
  //   fileInputRef.current = null

  // }
  // const handleFileDone = async (data) => {
  //   const { url, filename } = data
  //   await downloadFileFn(url)
  // }

  const { stopVideoCall } = useVideoCall(room);


  // 👇 成员变更处理
  const handleMemberChange = useCallback((action, data) => {
    switch (action) {
      case 'add':
        setMbrs(prev => {
          const memberMap = new Map(prev.map(m => [m.sid, m]));
          const newMembers = Array.isArray(data) ? data : [data];
          newMembers.forEach(member => {

            if (member?.sid && !memberMap.has(member.sid)) {
              if (!member?.username) {
                member.username = SocketUser.UserNameDefn(member.pc_id)
              }
              memberMap.set(member.sid, member);
            }
          });
          return Array.from(memberMap.values());
        });
        break;
      case 'remove':
        setMbrs(prev => prev.filter(m => m.sid !== data));
        break;
      default:
        return;
    }
  }, []);


  const onUserLeft = useCallback((data) => {
    messageApi.info('用户已离开房间');
    const { from_sid } = data
    Messages.add(data)
    handleMemberChange('remove', from_sid);
  }, [messageApi, handleMemberChange])

  const joinRoom = () => {
    const userInfo = () => {
      if (roomType === 'private') return socket.id;
      if (roomType === 'mbr' && !curUser) {
        messageApi.error('Missing curUser for mbr room');
        return;
      }

      return `${user.id}_${curUser.id}`;

    };

    ChatBridge.join_p2p({
      room_name: room,
      user: userInfo(),
      maker: fromId,
      // from_uid: user?.id
    })
  };

  const bye = () => {
    stopVideoCall()
    ChatBridge.leave_room(room)
  };

  useEffect(() => {
    if (!socket || !connected) return;
    const getToUserSid = () => {
      const arr = getByRegex(room);
      let otherSid = arr.find(x => x !== socket?.id);

      setToSid(otherSid)
      return otherSid
    }
    getToUserSid()

    if (roomType === 'mbr' && !curUser) {
      messageApi.error('缺少聊天对象信息');
      nav(-1);
      return;
    }
    joinRoom();

    window.addEventListener("beforeunload", bye);
    socket.on("joined", (data) => {

      const { participants } = data.data
      const normalized = Array.isArray(participants) ? participants : [participants];
      handleMemberChange('add', normalized);
    });

    socket.on('user_left', onUserLeft);

    return () => {
      socket.off('joined')
      socket.off('user_left')
      bye(),
        ChatSystem.activeChatUserId = null
      ChatSystem.endCall()
      window.removeEventListener("beforeunload", bye);
    };
  }, [socket, room, curUser, fromId]);

  return (

    <div className="chat-room">
      {contextHolder}
      <RoomHeader mbrLen={roomMbrs.length} leaveRoom={bye} />
      <RoomMembers members={roomMbrs} mySid={socket?.id} />
      <RoomMessages roomMbrs={roomMbrs} mySid={socket?.id} room={room} />
      <ChatInput
        toSid={toSid}
        to_pc_id={curUser?.pc_id}
        roomMbrs={roomMbrs}
        room={room} />
      {isUploading && <FileProgress progress={progress} />}
    </div>
  );
}