
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReduxAuth } from '../../../hooks/useReduxAuth';
import { Card, Button, Typography, Divider, Space, message } from 'antd';
import { CrownOutlined, ShareAltOutlined, CopyOutlined, LinkOutlined, MoneyCollectTwoTone, MoneyCollectFilled } from '@ant-design/icons';
import UserItems from '../comp/UserItems'
import './userSetups.css'; // 引入单独的CSS文件

const { Title, Text } = Typography;

const MembershipCard = () => {
  const [xpDay, setXpDay] = useState('已过期')

  const upgradeMembership = () => {
    message.info('正在跳转会员升级页面');
  };

  return (
    <Card className="membership-card">

      <div className="card-header">
        <p className="expired-text">
          {xpDay}
        </p>
        <CrownOutlined /> 升级会员
      </div>
      <div className="card-content">
        <Title level={4}>解锁高级功能</Title>
        <Text className="card-description">
          立即升级享受专属权益
        </Text>
        <Button
          type="primary"
          className="upgrade-button"
          onClick={upgradeMembership}
        >
          立即升级
        </Button>
      </div>
    </Card>
  );
};


const InviteCodeCard = ({ inviteCode }) => {
  // 1. 复制邀请码
  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    message.success('邀请码已复制');
  };

  // 2. 获取带邀请码的分享链接
  const shareUrl = `${window.location.origin}/?invite=${encodeURIComponent(inviteCode)}`;

  // 3. 复制分享链接
  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      message.success('邀请链接已复制，快去分享吧！');
    } catch (err) {
      message.error('复制失败');
    }
  };

  // 4. 浏览器原生分享（Web Share API）
  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '邀请你加入',
          text: `我的邀请码是：${inviteCode}，点击链接立即加入！`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // 用户取消或不支持，降级
      }
    }
    copyShareLink(); // 降级为复制链接
  };

  // 5. QQ 分享链接（官方）
  const qqShareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl)}&title=邀请你加入&summary=我的邀请码：${inviteCode}，注册即送会员！&pics=${encodeURIComponent(`${window.location.origin}/logo.png`)}`;

  return (
    <Card className="invite-card">
      <div className="card-header">
        <ShareAltOutlined /> 邀请好友
      </div>
      <div className="card-content">
        <Text strong className="invite-label">
          当前邀请码：
        </Text>
        <Space className="code-container">
          <Text code className="invite-code">
            {inviteCode || ''}
          </Text>
          <Button
            icon={<CopyOutlined />}
            className="copy-button"
            onClick={copyInviteCode}
            size="small"
          />
        </Space>

        <Divider className="card-divider" />

        {/* 新增：分享操作区 */}
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Button
            type="primary"
            icon={<LinkOutlined />}
            block
            onClick={handleWebShare}
          >
            一键分享邀请
          </Button>

          {/* 可选：显示 QQ 分享链接（适合在 QQ 内打开时使用） */}
          <a
            href={qqShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textAlign: 'center', display: 'block', marginTop: 8 }}
          >
            <Button size="small">分享到 QQ</Button>
          </a>
        </Space>

        <Text type="secondary" className="invite-description" style={{ display: 'block', marginTop: 16 }}>
          每成功邀请1位好友，双方各获得7天会员权限
        </Text>
      </div>
      <div> <Link to="/center/pwd_change"> 更改密码</Link></div>
    </Card>
  );
};
const SetupIndex = () => {
  const { user } = useReduxAuth();

  const [amount, setAmnt] = useState(0.00)
  const onWithdraw = async () => {
    if (amount > 0) {
      alert('跳转提现页')
    } else {
      alert("余额不足")
    }
  }



  return (
    <div className="user-settings-container">
      <MembershipCard />

      <Card className="withdraw-card">
        <div className='card-header'>
          <MoneyCollectFilled />资金账户
        </div>
        <Button icon={<MoneyCollectTwoTone />}
          type="primary"
          className="withdraw-button"
          onClick={onWithdraw}>{parseFloat(amount)} </Button>

        <Link to='/center/setups/orders' >详情</Link>
        <div className="go-setup"><Link to={'/center/setups/config'}>设置账户</Link></div>




      </Card>
      <UserItems />
      <InviteCodeCard inviteCode={user?.invite_code} />

    </div>
  );
};

export default SetupIndex;
