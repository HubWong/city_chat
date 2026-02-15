import { Button, Tooltip } from "antd";
import {
  VideoCameraOutlined,
  StopOutlined
} from "@ant-design/icons";
import FileInputs from "./FileInputs";
import { useEffect, useRef } from "react";
import useMessage from "antd/es/message/useMessage";
import { ChatSystem } from "@/shared/model/chatSystem";
import ChatBridge from "@/shared/model/chatBridge";
import { useWebCxt } from "../../../../services/WebCxt";
import { useReduxAuth } from "../../../../hooks/useReduxAuth";

export default function ControlsBar({
  toSid,
  rmMbrs,
  room
}) {
  const [api, contextHolder] = useMessage()
  const curUser = ChatSystem.getActiveChatUser()
  const { user, startVideoCall, stopVideoCall, localStreamRef, socket } = useWebCxt()
  const fileInputRef = useRef()
  const { showLoading } = useReduxAuth()

  const requestVideoCall = async () => {
    let targuser = ChatSystem.getActiveChatUser()

    if (!targuser || !targuser.pc_id) {
      throw Error('no target get')
    }

    const mdl = await startVideoCall()
    showLoading(true)
    if (mdl && mdl.success) {
      ChatBridge.startCall(curUser, user, room, ChatSystem.CallStatus.CALLING)
    }
    else {
      api.error(mdl.msg)
    }
  }

  const requestSendFile = (e) => {
    if (!e) return;
    fileInputRef.current = e
    ChatBridge.sendFileRequest(curUser, room, user.username, e)

  }


  return (
    <div>
      {rmMbrs.length > 1 && <div>
        <FileInputs toSid={toSid} onFile={requestSendFile} room={room} />
        {contextHolder}
        <Tooltip title="视频通话">
          <Button onClick={async () => await requestVideoCall(true)} type="primary">
            <VideoCameraOutlined />
          </Button>
        </Tooltip>

        {localStreamRef.current && (
          <Tooltip title="挂断">
            <Button onClick={() => { stopVideoCall() }} type="primary" danger>
              <StopOutlined />
            </Button>
          </Tooltip>
        )}
      </div>}
    </div>
  );
}
