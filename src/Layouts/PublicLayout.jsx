import TopNavs from "@/components/Navs/TopNavs";
import { Outlet } from "react-router-dom";
import NofityBridge from "../components/NotifyBridge";
import TemperUserFormModal from "../components/TemperUserFormModal";
import LoginFormModal from "../components/auth/LoginFormModal";
import PayQrModal from "../components/PayQrModal";
import AppLoading from "../components/AppLoading";
import { useReduxAuth } from "../hooks/useReduxAuth";
import { useWebCxt } from "../services/WebCxt";
import DualVideoView from '@/components/Dragable/DualVideoView'

const PublicLayout = () => {
  const { loginVisible, toggleLoginForm } = useReduxAuth()
  const { streams, localStreamRef } = useWebCxt()
  return (<>
    <TopNavs />
    <div style={{
      minHeight: '100vh',
      paddingTop: '46px'
    }}>
      <Outlet />
    </div>
    <NofityBridge />
    <TemperUserFormModal />
    <LoginFormModal visible={loginVisible} onCancel={toggleLoginForm} />
    {localStreamRef.current && <DualVideoView localStream={streams[0]} remoteStream={streams[1]} />}
    <PayQrModal />
    <AppLoading />
  </>
  )
};
export default PublicLayout;
