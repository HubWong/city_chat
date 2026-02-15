import { useEffect, useState, useRef } from "react";
import Peer from "simple-peer/simplepeer.min.js";

import { useWebCxt } from "../services/WebCxt";
import { useReduxAuth } from "./useReduxAuth";


//only used in Vmeeting page
export function useWebRTC({ roomId, userId, maker }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStream = useRef(null);
  const pendingRemoteStream = useRef(null);
  const { socket } = useWebCxt();
  const { user } = useReduxAuth()
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const pendingSignal = useRef(null);

  useEffect(() => {
    return () => {
      pendingSignal.current = null;
    };
  }, [pendingSignal.current]);

  const getMediaStream = async () => {
    try {
      // 始终申请音视频权限，确保 m-line 一致
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // 如果用户想默认关闭 mic/cam，就关闭轨道（而不是不获取）
      stream.getAudioTracks().forEach((track) => {
        track.enabled = isMicOn;
      });
      stream.getVideoTracks().forEach((track) => {
        track.enabled = isCameraOn;
      });

      return stream;
    } catch (err) {
      console.error("获取媒体失败:", err);
      return null;
    }
  };

  const startCall = async () => {
    localStream.current = await getMediaStream();

    if (!localStream.current) return;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.current;
    }

    if (!roomId) {
      throw Error("roomid no done.");
    }

    socket.emit("join_p2p", { room_name: roomId, user: userId, maker });

    socket.on("joined", ({ initiator }) => {

      // 创建 peer 时传入媒体流
      peerRef.current = createPeer(initiator == "Y" ? true : false);

      // 如果 signal 在此之前已到达，则现在处理
      if (pendingSignal.current) {
        if (!peerRef.current) {
          //throw Error("peer ref is null");
          peerRef.current = createPeer(initiator == "Y" ? true : false);
        }
        peerRef.current.signal(pendingSignal.current);
        pendingSignal.current = null;
      }
    });

    socket.on("signal", ({ signal }) => {
      if (!peerRef.current) {
        // 本地 peer 还没创建（流未准备好）
        console.warn("peer 还没创建，暂存信令");
        pendingSignal.current = signal;
      } else {
        peerRef.current.signal(signal);
      }
    });
  };

  const createPeer = (initiator) => {
    console.log("is init:", initiator);
    if (!localStream.current) {
      console.warn("媒体流未准备好");
      return null;
    }

    const peer = new Peer({
      initiator,
      trickle: false,
      stream: localStream.current,
    });

    peer.on("signal", (signal) => {
      socket.emit("signal", { room: roomId, signal });
    });

    // 兼容 Firefox
    peer.on("track", (track, stream) => {
      // 等待 remoteVideoRef 初始化完毕
      const trySetRemoteStream = () => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        } else {
          pendingRemoteStream.current = stream;
          setTimeout(trySetRemoteStream, 100);
        }
      };
      trySetRemoteStream();
    });
    peer.on("stream", (stream) => {
      console.log("收到远端流");
      // 等待 remoteVideoRef 初始化完毕
      const trySetRemoteStream = () => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        } else {
          pendingRemoteStream.current = stream;
          setTimeout(trySetRemoteStream, 100);
        }
      };
      trySetRemoteStream();
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    peer.on("close", () => {
      pendingSignal.current = null;
      console.log("Peer 已关闭");
    });

    return peer;
  };

  const toggleMic = () => {
    const audioTrack = localStream.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStream.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const endCall = () => {
    socket.emit("leave", { room: roomId, leaverId: user?.id });

    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    localStream.current?.getTracks().forEach((track) => track.stop());
    localStream.current = null;

    // 清空视频 DOM
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (pendingSignal.current) pendingSignal.current = null; // ✅ 清理挂起的 signal
  };

  return {
    localVideoRef,
    remoteVideoRef,
    isMicOn,
    isCameraOn,
    toggleMic,
    toggleCamera,
    endCall,
    startCall,
  };
}
