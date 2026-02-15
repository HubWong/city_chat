import { Card, Tag, Button, message } from "antd";
import { UserOutlined, WomanOutlined, ManOutlined } from "@ant-design/icons";
import NationFlagEle from '@/components/NationFlagEle'
import { useWebCxt } from "../../../../services/WebCxt";
import { MsgTargetType } from "@/shared/config";
import { genConvId, getPcId } from "../../../../services/toolFuncs";
import { useNavigate } from "react-router-dom";
import { useReduxAuth } from "../../../../hooks/useReduxAuth";
import EmptyState from '../../../../components/EmptyState'
import ChatBridge from "@/shared/model/chatBridge";
import { useEffect, useState } from "react";
import { ChatSystem } from "@/shared/model/chatSystem";

const UserCard = ({ user, onClick }) => (
  <Card
    className={"userCard"}  // 使用自定义样式
    title={user.username || `匿名-<${user.sid}...>`}
    extra={<NationFlagEle cn={user.ip_country} />}
    actions={[
      <Tag
        title={user?.gender === 1 ? "男" : "女"}
        icon={
          user?.gender === 1 ? (
            <ManOutlined style={{ color: "blue" }} />
          ) : (
            <WomanOutlined style={{ color: "red" }} />
          )
        }
      />,
      <Tag icon={<UserOutlined />} color={user.ip_country ? "geekblue" : "default"}>
        {parseInt(new Date().getFullYear()) - user.birth_year} yrs
      </Tag>,
    ]}
  >
    <div>
      城市: {user.living_city || '未知地区'}
      <Button
        type="primary"
        size="small"
        style={{ marginLeft: "10px", color: "pink", backgroundColor: "#fff", border: "solid" }}
        onClick={() => onClick(user)}
      >
        跟Ta聊
      </Button>
    </div>
    <p>最后活跃: {new Date(user.last_active).toLocaleString()}</p>
  </Card>
);

const AnonyUserList = () => {
  const { socket, connected } = useWebCxt();
  const [socketUsers, setUsers] = useState([]);

  const [api, contextHolder] = message.useMessage()
  const { user, toggleTmperProfile } = useReduxAuth();
  const nav = useNavigate();

  const onSelect = (data) => {

    if (data?.sid === socket?.id) {
      api.error("不能和自己聊天");
      return;
    }
    if (!user) {
      toggleTmperProfile();
      return;
    }
    if (!data.pc_id) {
      console.error('no pc id get.')
      return
    }


    ChatSystem.switchTargetUser(data)

    if (data?.sid && socket?.id) {
      const cid = genConvId(data?.sid, socket?.id, MsgTargetType.PRIVATE);

      nav(`/room_prv/${cid}/${socket?.id}`);
    } else {
      throw Error("no sid get in user list page cmpnt");
    }
  };

  const getCardList = () => {
    if (!socketUsers || socketUsers.length === 0) {
      return <EmptyState />
    }

    return socketUsers.map((user) => (
      <UserCard key={`${user?.sid}_${user.username}`} user={user} onClick={onSelect} />
    ))
  }

  useEffect(() => {

    if (!connected || !socket) return


    ChatBridge.requestUsers()
    const handleUsersOnline = (list) => {
      const pid = getPcId()
      const filterd = list.data.filter(u => u?.pc_id !== pid)

      setUsers(filterd);

    };

    const handleTemperUserOn = ({ data }) => {

      const { user } = data
       
      try {
        const newUser = typeof user === "string" ? JSON.parse(user) : user;
        if (newUser.sid !== socket?.id) {
          setUsers(prev => [...prev, newUser]);
        }
      } catch (e) {
        console.error("用户数据解析失败", e);
      }
    };

    const handleUserLeft = (data) => {
      try {
        const leftUser = typeof data.user === "string" ? JSON.parse(data.user) : data.user;
        setUsers(prev => prev.filter(u => u.sid !== leftUser.sid));
      } catch (e) {
        console.error("用户离开数据解析失败", e);
      }
    };
    socket.on("req_users_resp", handleUsersOnline)

    socket.on("temper_user_on", handleTemperUserOn);
    socket.on("user_left", handleUserLeft);
    // 清理
    return () => {
      socket.off("req_users_resp", handleUsersOnline);
      socket.off("temper_user_on", handleTemperUserOn);
      socket.off("user_left", handleUserLeft);
    };

  }, [socket, connected])
  return (
    <div className={'userListWrapper'}>
      {getCardList()}
      {contextHolder}
    </div>
  );
};

export default AnonyUserList;
