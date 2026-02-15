import {
  createContext,
  useContext,
  useEffect,
  useState,

} from "react";
import { useIpInfos } from "../hooks/useIpInfos";
import SocketClient from "@/shared/model/socketModel"; // 假设它是静态类 / 单例
import ChatBridge from "@/shared/model/chatBridge";
import { useReduxAuth } from "../hooks/useReduxAuth";
import { useVideoCall } from "../pages/Chat/hooks/useVideoCall";


const WebSocketContext = createContext(null);

export const WebCxtProvider = ({ children }) => {
  const { ipInfo } = useIpInfos();
  const { user } = useReduxAuth();

  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  SocketClient.setUserData({ user, ipInfo });
  const s = SocketClient.get();
  const { startVideoCall, accepteVideoCall, openLocalVideo, stopVideoCall, streams, handleIncomingSignal, localStreamRef } = useVideoCall()

  useEffect(() => {

    setSocket(s);

    setConnected(SocketClient.isConnected);

    const updateConnection = () => {
      if (SocketClient.isConnected) {
        ChatBridge.bind(s)
      } else {
        console.log('[*] Error: ws lost.')
      }
      setConnected(SocketClient.isConnected);
    };

    s.on("connect", updateConnection);
    s.on("disconnect", updateConnection);

    return () => {
      s.off("connect", updateConnection);
      s.off("disconnect", updateConnection);

    };
  }, []);

  const value = {
    socket,
    ipInfo,
    connected,
    localStreamRef,
    user,
    startVideoCall,
    openLocalVideo,
    accepteVideoCall,
    streams,
    handleIncomingSignal,
    stopVideoCall,
    userData: SocketClient.userData, // 注意：这是静态属性，可能不会触发重渲染
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebCxt = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebCxt must be used within a WebCxtProvider");
  }
  return context;
};