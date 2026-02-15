import { useState } from "react";
import { useReduxAuth } from "./useReduxAuth";
import { useWebCxt } from "../services/WebCxt";
import { getPcId } from "../services/toolFuncs";
import ChatBridge from "../shared/model/chatBridge";

export const useTemperUserForm = () => {

  const [isLoading, setLoading] = useState(false)
  const {
    profileShow,
    toggleTmperProfile,
    reduxUpdateMe,
  } = useReduxAuth();

  const onCancel = () => {
    toggleTmperProfile();
  };

  const onsubmit = (data) => {
    data.pc_id = getPcId();
    if (ChatBridge.updateMe(data)) {
      reduxUpdateMe(data);
      toggleTmperProfile();
    }
  };
  return {
    onCancel,
    visible: profileShow,
    onsubmit,
    isLoading,
    setLoading

  };
};
