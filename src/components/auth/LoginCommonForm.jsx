
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { getPcId } from "../../services/toolFuncs";
import { Link, useNavigate } from "react-router-dom";
import { useAuthApi } from "../../hooks/useAuthApi";
import './LoginCommonForm.css'


const LoginCommonForm = ({onSuc=null}) => {
    const [api, contextHolder] = message.useMessage()
    const navigate = useNavigate();
    const { loginUser, isLoginLoading } = useAuthApi();

    const handleSubmit = async (e) => {

        const fm = document.getElementById("login-form");
        if (!fm) return;
        const resp = await loginUser(new FormData(fm));

        if (resp && resp.success) {

            navigate("/user");
            if (onSuc) {
                onSuc()
            }
        } else {
            api.error("用户名或密码错误");
        }
    };
    return (
        <div> {contextHolder}
            <Form
                onFinish={handleSubmit}
                autoComplete="off"
                layout="vertical"
                id="login-form"
            >
                <Form.Item rules={[{ required: true, message: "请输入Email" }]}>
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Email/Tel"
                        type="email"
                        size="large"
                        name="username"
                        autoComplete="username"
                    />
                    <input type="hidden" name="pc_id" value={getPcId()} />
                </Form.Item>

                <Form.Item rules={[{ required: true, message: "请输入密码" }]}>
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="密码"
                        name="password"
                        autoComplete="current-password"
                        size="large"

                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoginLoading}
                        block
                        size="large"
                    >
                        登录
                    </Button>
                </Form.Item>
            </Form>
            <div className='footer'>
                还没有账号？
                <Link to="/sign_up">立即注册</Link>
                <Link to="/reset_req">忘记密码</Link>
            </div>
        </div>

    );
};

export default LoginCommonForm;