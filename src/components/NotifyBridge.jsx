import { useEffect } from "react"
import { Events } from "@/shared/model/eventModel"
import { notification, Button, Space, message } from "antd";
import { CheckCircleOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router-dom";

import ChatBridge from "@/shared/model/chatBridge";
import { useWebCxt } from "../services/WebCxt";
import { ChatSystem } from "@/shared/model/chatSystem";

export default function NofityBridge() {
  const nav = useNavigate()
  const [api, contextHolder] = message.useMessage()

  const {
    startVideoCall,
    handleIncomingSignal,
    accepteVideoCall
  } = useWebCxt()

  const onError = (msg) => {
    notification.error({ message: msg })
  }


  const onUserCall = (data) => {
    const { from, caller_sid, room } = data
    notification.open({
      message: `通话请求`,
      description: `是否接收 ${from} 的通话请求？`,
      duration: 0, // 不自动关闭
      actions: (
        <Space>
          <Button
            size="small"
            type="primary"
            onClick={async () => {
              const mdl = await startVideoCall()
              if (mdl && mdl.success) {
                ChatBridge.callResponse({ room, target_user: caller_sid, accept: true });
              } else {
                ChatBridge.callResponse({ room, target_user: caller_sid, accept: false });
                api.error(mdl.msg)
              }
              notification.destroy();
            }}
          >
            是
          </Button>
          <Button
            size="small"
            danger
            onClick={() => {
              ChatBridge.callResponse({ room, target_user: caller_sid, accept: false });
              notification.destroy();
            }}
          >
            否
          </Button>
        </Space>
      ),
    });
  }

  const noNotify = (msg) => {

    const username = msg.from_user || "匿名用户";
    const roomId = msg.to_room
    const to_sid = msg.to_sid
    if (msg.from_sid === to_sid) {
      api.warning("不能发给自己")
    }

    if (ChatSystem.activeChatUserId === msg.data?.from_pc_id) {
      return
    }
    notification.open({
      message: "收到消息",
      description: (
        <div>
          <p>来自用户 {username}</p>
          <p>
            <Button
              type="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                const r = ChatSystem.switchTargetUser(msg, 'notify')
                if (r) {
                  nav(`/room_prv/${roomId}/${to_sid}`)
                }
              }}
            >
              查看
            </Button>
          </p>
        </div>
      ),
      icon: <CheckCircleOutlined style={{ color: "#108ee9" }} />,
      placement: "topRight",
      duration: 2.5,
    });
  }


  const onSendRequest = (data) => {

    const { from, content, room, from_sid } = data

    notification.open({
      message: `${from}发送文件请求`,
      description: `是否接收 ${from} 的文件${content})？`,
      duration: 0, // 不自动关闭
      actions: (
        <Space>
          <Button
            size="small"
            type="primary"
            onClick={async () => {
              ChatBridge.sendRespons({ room, toSid: from_sid, accept: true });
              notification.destroy();
            }}
          >
            是
          </Button>
          <Button
            size="small"
            danger
            onClick={() => {
              ChatBridge.sendRespons({ room, toSid: from_sid, accept: false });
              notification.destroy();
            }}
          >
            否
          </Button>
        </Space>
      ),
    });
  }
  const handleNotify = async (messageData) => {

    const notifyType = messageData.msg_type
    switch (notifyType) {
      case 'calling':
        onUserCall(messageData)
        break;
      case 'notify':
        noNotify(messageData)
        break
      case 'send_request':
        onSendRequest(messageData)
      default:
        break;
    }
  };

  useEffect(() => {
    const off = Events.on("notify", async msg => {

      await handleNotify(msg)
    })

    const callingOff = Events.on('calling', async data => {
      await handleNotify(data)
    })
    const signalOff = Events.on('signal', async data => {
      handleIncomingSignal(data.signal)
    })


    const hangUpOff = Events.on('hangup', async () => {
      if (ChatSystem.call.target_user !== null) {
        api.info('user hang up!')
        ChatSystem.endCall()
      }

    })

    const callAccepted = Events.on('call_accepted', async data => {
      await accepteVideoCall()
    })

    const errOff = Events.on('error_msg', data => {
      onError(data)
    })
    return () => {
      off,
        callingOff,
        signalOff,
        errOff,
        callAccepted,
        hangUpOff
    }
  }, [])

  return <>{contextHolder}</>
}
