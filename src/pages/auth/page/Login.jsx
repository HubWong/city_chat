
import { Card } from "antd";
import LoginCommonForm from "../../../components/auth/LoginCommonForm"; // 路径根据实际调整
import './login.css'

const Login = () => {
  return (
    <div className="login-container">
      <Card title="登录" className="card">
        <LoginCommonForm   />
      </Card>
    </div>
  );
};

export default Login;