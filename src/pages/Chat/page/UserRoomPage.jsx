import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import { useGetJoinRoomQuery } from '@/services/roomApi'; // 请根据实际路径调整
import { useWebCxt } from '@/services/WebCxt'; // 请根据实际路径调整
import ChatBridge from '@/shared/model/ChatBridge';
import { ChatSystem } from '@/shared/model/chatSystem';
import { Messages } from '@/shared/model/msgModel';
import { SocketUser } from '@/shared/model/appModels'
import UserRoomHeader from '../comps/userRoom/UserRoomHeader';
import UserRoomMsgContainer from '../comps/userRoom/UserRoomMsgContainer';
import UserRoomInputs from '../comps/userRoom/UserRoomInputs';
import './userroomPage.css'
import { getPcId } from '../../../services/toolFuncs';
function UserRoomPage() {
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const { socket, connected, user } = useWebCxt();
  const [roomMbrs, setMbrs] = useState([]);

  // 查询房间信息（仅当已连接时发起）
  const { data, isError, isLoading, error } = useGetJoinRoomQuery(
    { id, fromSid: socket?.id },
    { skip: !connected }
  );

  // 安全解构：兼容不同后端返回结构
  // 常见结构1: { data: { room: {}, maker: {} } }
  // 常见结构2: { room: {}, maker: {} }
  const room = data?.data?.room || data?.room;
  const maker = data?.data?.maker || data?.maker;
  const nav = useNavigate();
  // console.log(room)
  // console.log(maker)
  // 👇 处理成员列表变更
  const handleMemberChange = useCallback((action, payload) => {
    switch (action) {
      case 'add':
        setMbrs(prev => {
          const memberMap = new Map(prev.map(m => [m.sid, m]));
          const newMembers = Array.isArray(payload) ? payload : [payload];

          newMembers.forEach(member => {
            if (member?.sid && !memberMap.has(member.sid)) {
              // 自动生成用户名（如果缺失）
              if (!member?.username && member?.pc_id) {
                member.username = SocketUser.UserNameDefn(member.pc_id);
              }
              memberMap.set(member.sid, { ...member });
            }
          });

          return Array.from(memberMap.values());
        });
        break;

      case 'remove':
        setMbrs(prev => prev.filter(m => m.sid !== payload));
        break;

      default:
        return;
    }
  }, []);

  // 👇 离开房间清理
  const bye = useCallback(() => {
    if (room?.title) {
      ChatBridge.leave_room(room.title, '1');
    }
  }, [room?.title]);

  // 👇 处理 401 错误跳转
  useEffect(() => {
    if (isError && error?.status === 401) {
      messageApi.warning('登录已过期，请重新登录');
      nav('/login', { replace: true });
    }
  }, [isError, error?.status, nav, messageApi]);

  // 👇 处理用户离开事件
  const onUserLeft = useCallback((data) => {
    messageApi.info('用户已离开房间');
    const { from_sid } = data;
    Messages.add(data);
    handleMemberChange('remove', from_sid);
  }, [messageApi, handleMemberChange]);

  // 👇 Socket 事件监听
  useEffect(() => {
    if (!connected || !room?.title) return;

    ChatBridge.join_user_room({ to_room: room.title, uid: user?.id, from_pcId: getPcId() })
    // 监听加入房间事件
    socket.on('joined', (data) => {
      console.log('joined in room page....')
      
      const { participants } = data?.data || {};
      
      

      const normalized = Array.isArray(participants) ? participants : [participants];
      handleMemberChange('add', normalized);
    });

    // 监听用户离开事件
    socket.on('user_left', onUserLeft);

    // 页面关闭前清理
    window.addEventListener('beforeunload', bye);

    // 清理函数
    return () => {

      socket.off('joined');
      socket.off('user_left');
      bye();
      ChatSystem.activeChatUserId = null;
      ChatSystem.endCall();
      window.removeEventListener('beforeunload', bye);
    };
  }, [socket, connected, room?.title, bye, onUserLeft, handleMemberChange]);

  // ========== 渲染逻辑（按优先级排序）==========

  // 1️⃣ 未连接状态：显示连接中提示
  if (!connected) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Spin size="large" tip="正在连接服务器..." />
        <p style={{ color: '#999', fontSize: '14px' }}>请稍候...</p>
      </div>
    );
  }

  // 2️⃣ 查询错误（非 401 已在 useEffect 处理）
  if (isError) {
    if (error?.status === 401) {
      // 401 由 useEffect 处理跳转，此处仅友好提示
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <Spin tip="身份过期，正在跳转登录页..." />
        </div>
      );
    }

    // 其他错误
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>😅</div>
          <h2 style={{ marginBottom: '8px' }}>加载失败</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            {error?.data?.message || error?.message || '请检查网络或稍后重试'}
          </p>
          <button
            onClick={() => nav(-1)}
            style={{
              padding: '8px 24px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            返回上一页
          </button>
        </div>
      </div>
    );
  }

  // 3️⃣ 查询加载中
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Spin size="large" tip="加载房间信息..." />
        <p style={{ color: '#999', fontSize: '14px' }}>房间 ID: {id}</p>
      </div>
    );
  }

  // 4️⃣ 查询成功但房间数据缺失（真实房间不存在）
  if (!room) {
    return (
      <div className="room-not-found" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div className="not-found-content" style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <div className="not-found-icon" style={{ fontSize: '64px', marginBottom: '16px' }}>
            😕
          </div>
          <h2 style={{ fontSize: '24px', marginBottom: '8px', color: '#333' }}>
            聊天室不存在
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            您访问的聊天室不存在或已被删除
          </p>
          <button
            onClick={() => nav(-1)}
            style={{
              padding: '10px 24px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  // 5️⃣ 正常渲染
  return (
    <div className="user-room-page">
      {contextHolder}
      <div className="room-container">
        <UserRoomHeader room={room} members={roomMbrs} />
        <UserRoomMsgContainer members={roomMbrs} room={room} />
        <UserRoomInputs room={room} />
      </div>
    </div>
  );
}

export default UserRoomPage;