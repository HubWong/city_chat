import { Menu, Button } from "antd";
import {
  UserOutlined,
  BoxPlotOutlined,
  TeamOutlined,
  LoginOutlined,
  HeartTwoTone,
  ContactsFilled,
} from "@ant-design/icons";
import { UI_URI } from "@/shared/config";
import { useNavigate, Link } from "react-router-dom";
import { useReduxAuth } from "../../hooks/useReduxAuth";
import { AdminEmail } from "@/shared/config";
import './topNav.css'

const TopNavs = () => {
  const navigate = useNavigate();
  const { isLogout, logoutUser, token, user } = useReduxAuth();
  const getMenuItems = () => {
    const logoItem = {
      key: "logo",
      label: (
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={`${UI_URI}/src/assets/ddq.png`} //  
            alt="App Logo"
            style={{ height: '42px', marginRight: '8px' }} // 自定义大小和间距
          />
        </Link>
      )
    };
    const baseItems = [
      {
        key: "userlist2",
        icon: <HeartTwoTone />,
        label: <Link to="/user">本地交友</Link>,
      },
      {
        key: "chat",
        icon: <TeamOutlined />,
        label: <Link to="/chat">聊天室列表</Link>,
      },
      {
        key: "about",
        icon: <BoxPlotOutlined />,
        label: <Link to="/about">关于</Link>,
      },
    ];



    const authItem =
      token === null
        ? [{
          key: "login",
          style: { marginLeft: "auto" },
          label: (
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => navigate("/login")}
            >
              登录
            </Button>
          ),
        }]
        : [{
          key: "logout",
          style: { marginLeft: "auto" },
          label: (
            <Button danger onClick={() => logoutUser()}>
              退出登录
            </Button>
          ),
        }];

    if (!isLogout) {
      authItem.push({
        key: "profile",
        icon: <UserOutlined />,
        label: <Link to="/center">{user?.username || user?.email.split('@')[0]}</Link>,
      });

      if (user && user?.role == "admin" || user?.email === AdminEmail) {
        authItem.push({
          key: "admin",
          icon: <ContactsFilled />,
          label: <Link to="/admin">admin</Link>,
        });
      }
    }
    return [logoItem, ...baseItems, ...authItem];
  };

  return (
    <div className="top-nav-wrapper">
      <Menu
        mode="horizontal"
        theme="light"
        items={getMenuItems()}
      />
    </div>
  );
};

export default TopNavs;
