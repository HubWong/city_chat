import { useIgnoreMsgMutation, useSendMsgMutation } from "../../services/msgApi";

export const useMsgApi = () => {
  const [ignoreMsg] = useIgnoreMsgMutation();
  const [sendMsg] = useSendMsgMutation()
  const leaveMsgToUser = async (data) => {
    
    try {
      const res = await sendMsg(data).unwrap()
      return res
    } catch (error) {
      return error
    }
  }

  const ignoreMessage = async (messageId) => {
    try {
      
      const response = await ignoreMsg(messageId).unwrap();
      return response;
    }
    catch (error) {
      console.error("忽略消息失败:", error);
      throw error;
    }
  }

  return {
    ignoreMessage,
    leaveMsgToUser
  };
};
