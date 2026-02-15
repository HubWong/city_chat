import React, { useEffect  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Space,
  Row,
  Col,
} from "antd";
import { useWebRTC } from "../../../hooks/useWebRTC";
import {
  AudioMutedOutlined,
  AudioOutlined,
  VideoCameraOutlined,
  VideoCameraAddOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

//instant cam chat
export default function MeetingRoomPage() {
  const { roomId, mySid: userId, maker } = useParams();

  const navigate = useNavigate()
  const {
    localVideoRef,
    remoteVideoRef,
    isMicOn,
    isCameraOn,
    toggleMic,
    toggleCamera,
    endCall,
    startCall,
  } = useWebRTC({ roomId, userId, maker });

  useEffect(() => {
    startCall();

    return () => {
      endCall();
    };
  }, []);

  return (
    <div style={{ padding: 10 }}>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} md={12}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            style={{ width: "100%", borderRadius: 10 }}
          />
          Local Video
        </Col>
        <Col xs={24} md={12}>
          <video
            ref={remoteVideoRef}
            autoPlay
            style={{ width: "100%", borderRadius: 10 }}
          />
          Remote Video
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: 20 }}>
        <Space size="large">
          <Button
            shape="circle"
            icon={isMicOn ? <AudioOutlined /> : <AudioMutedOutlined />}
            onClick={toggleMic}
          />
          <Button
            shape="circle"
            icon={
              isCameraOn ? <VideoCameraOutlined /> : <VideoCameraAddOutlined />
            }
            onClick={toggleCamera}
          />
          <Button
            shape="circle"
            danger
            icon={<PhoneOutlined />}
            onClick={() => {
              endCall();
              navigate("/userlist");
            }}
          />
        </Space>
      </Row>
    </div>
  );
}
