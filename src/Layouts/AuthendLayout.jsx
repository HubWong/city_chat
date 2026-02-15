import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useReduxAuth } from "../hooks/useReduxAuth";
import { Layout, Menu } from "antd";
import { MailOutlined, SettingFilled, UserOutlined, UsergroupAddOutlined, AccountBookFilled } from "@ant-design/icons";

const { Content, Sider } = Layout;

const userMenus = [
  {
    label: "我的消息",
    key: "/center",
    icon: <MailOutlined />,
  },
  {
    label: "个人信息",
    key: "/center/profile",
    icon: <UserOutlined />
  },
  {
    label: "我的关注",
    key: "/center/pals",
    icon: <UsergroupAddOutlined />
  },
  {
    label: "我的房间",
    key: "/center/user_room",
    icon: <UsergroupAddOutlined />
  },
  {
    label: "个人设置",
    key: "/center/setups",
    icon: <SettingFilled />
  },

];

const AuthendLayout = () => {
  const { user, isLogout } = useReduxAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLogout) {
      navigate('/login')
    }

  }, [user, navigate]);

  return (
    <Layout>
      <Sider collapsible width={200}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={["/center/msg"]}
          defaultSelectedKeys={["/center/profile"]}
          onSelect={({ key }) => navigate(key)}
          items={userMenus}
        />
      </Sider>
      <Content style={{ paddingLeft: '1em', margin: 0 }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AuthendLayout;
