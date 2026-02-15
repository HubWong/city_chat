import { useState } from "react";
import { Layout, Menu, theme, Avatar, Badge } from "antd";
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  FileOutlined,
  SettingOutlined,
  LeftCircleOutlined,
  FileImageOutlined,
  MessageFilled,
  LogoutOutlined,
  GroupOutlined
} from "@ant-design/icons";

import { Outlet, useNavigate } from "react-router-dom";
import { useReduxAuth } from "../hooks/useReduxAuth";

const { Header, Sider, Content } = Layout;


const adminSideBars = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "控制台" },
  { key: "users", icon: <UserOutlined />, label: "用户管理" },
  { key: "payment", icon: <FileOutlined />, label: "支付管理" },
  { key: "settings", icon: <SettingOutlined />, label: "系统设置" },
  { key: "photos", icon: <FileImageOutlined />, label: "用户图片" },
  { key: "appMsgs", icon: <MessageFilled />, label: "用户留言" },
  { key: "front", icon: <LeftCircleOutlined />, label: "去前台" },
  { key: "coopers", icon: <GroupOutlined />, label: "婚介公司" },
  { key: "rooms", icon: <GroupOutlined />, label: "用户房间" },
  { key: "logoutUser", icon: <LogoutOutlined />, label: "退出" },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const { logoutUser } = useReduxAuth();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const nav = useNavigate();


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={220}
        breakpoint="lg"
        collapsedWidth={80}
      >
        <div
          className="logo"
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: collapsed ? 20 : 18,
            fontWeight: "bold",
          }}
        >
          {collapsed ? "AD" : "ADMIN"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={adminSideBars}
          onSelect={({ key }) => {
            if (key === "front") {
              nav("/user");
              return;
            }
            if (key === "logoutUser") {
              logoutUser();
              return;
            }
            setSelectedKey(key);
            nav(key);
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
          }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined
              style={{ fontSize: 20 }}
              onClick={() => setCollapsed(false)}
            />
          ) : (
            <MenuFoldOutlined
              style={{ fontSize: 20 }}
              onClick={() => setCollapsed(true)}
            />
          )}
          <div style={{ flex: 1 }} />
          <Badge count={5} style={{ marginRight: 24 }}>
            <Avatar icon={<UserOutlined />} />
          </Badge>
        </Header>
        <Content
          style={{
            margin: "16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
