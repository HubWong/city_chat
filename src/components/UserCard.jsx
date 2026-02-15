
import React from 'react'
import {
    Card,
    Row,
    Col,
    Avatar,
    Tag,
    Button,

} from "antd";
import { UserOutlined, ManOutlined, WomanOutlined } from "@ant-design/icons";
import { validateImageUrl, getDefaultAvatr } from '../services/toolFuncs';

const getAvatar = (user) => {
    const isValidUrl = validateImageUrl(user.avatar);
    if (isValidUrl) return user.avatar;
    if (!user.gender) {
        return getDefaultAvatr(false)
    }


    return getDefaultAvatr(user?.gender === '男');
};
const UserCard = ({ user, onSelect, forMbr = true }) => {

    return (
        <Card className="user-card" onClick={() => onSelect(user)}>
            <Row gutter={3} align="middle">
                {forMbr && <Col xs={6} sm={4}>
                    <div className="avatar-container">
                        <Avatar size={94} src={getAvatar(user)} icon={<UserOutlined />} />
                    </div>
                </Col>}
                <Col xs={18} sm={20}>
                    <div className="user-info">
                        <h3>{user.username || '匿名'}</h3>
                        <div className="meta-info">
                            <span className="gender">
                                {user.gender === 1 ? (
                                    <ManOutlined style={{ color: "#1890ff" }} />
                                ) : (
                                    <WomanOutlined style={{ color: "#ff4d4f" }} />
                                )}
                                {user.gender == 0 ? 'f' : 'm'}
                            </span>
                            <span className="birth_year">{user.birth_year || 'unkown'}岁</span>
                            <span className="ip_country">{user.ip_country || 'unkown'}</span>
                            <span className="ip_city">{user.ip_city || 'unkown'}</span>
                            <Tag color={user.is_online ? "green" : "gray"} className="online-tag">
                                {user.is_online ? "在线" : "离线"}
                            </Tag>
                        </div>
                        <Button size='small'
                            onClick={onSelect}
                        >
                            view
                        </Button>
                    </div>
                </Col>
            </Row>
        </Card>
    );

}

export default UserCard
