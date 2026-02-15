import PropTypes from "prop-types";
import { UserOutlined, ManOutlined, WomanOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
const Flag = ({ code }) => {
  const flagUrl = `https://flagcdn.com/w40/${code}.png`; // 小尺寸
  return (
    <img
      src={flagUrl}
      alt={`${code} flag`}
      style={{
        width: "24px",
        height: "16px",
        borderRadius: "3px",
        boxShadow: "0 0 2px rgba(0,0,0,0.2)",
        marginRight: "6px",
      }}
    />
  );
};

// 本地默认头像（Base64 格式的小 SVG，可替换为你自己的）
const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iI2Y1ZjVmNSIgc3Ryb2tlPSIjZDBkMGQwIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMTUgMTVhNSA1IDAgMSAxIDEwIDAgNSA1IDAgMCAxLTEwIDB6IiBmaWxsPSIjYzhjOGM4Ii8+PHBhdGggZD0iTTE1IDI1YTggOCAwIDAgMCAxMCAwIiBzdHJva2U9IiNjOGM4YzgiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==";

export const getDicebearAvt = async (username) => {
  // 构造安全的 seed
  const safeSeed = encodeURIComponent(username || 'default');

  // 初始头像 URL
  const primaryUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${safeSeed}`;
  const fallbackUrl = `https://api.dicebear.com/9.x/identicon/svg?seed=${safeSeed}`;
  try {
    // 尝试主URL
    await fetch(primaryUrl);
    return primaryUrl
  } catch (error) {
    try {
      // 尝试备用URL
      await fetch(fallbackUrl);
      return fallbackUrl
    } catch (backupError) {

      return DEFAULT_AVATAR
    }
  }
}

const UserAvatar = ({ gender, username, nation, isMbr = true }) => {
  const [imgSrc, setImgSrc] = useState('');

  // 构造安全的 seed
  const safeSeed = encodeURIComponent(username || 'default');

  // 初始头像 URL
  const primaryUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${safeSeed}`;
  const fallbackUrl = `https://api.dicebear.com/9.x/identicon/svg?seed=${safeSeed}`;

  // 组件挂载时设置初始 src
  useEffect(() => {
    setImgSrc(primaryUrl);
  }, [primaryUrl]);

  const handleError = () => {
    if (imgSrc === primaryUrl) {
      // 第一次失败：尝试 identicon
      setImgSrc(fallbackUrl);
    } else {
      // 第二次失败：使用本地默认头像
      setImgSrc(DEFAULT_AVATAR);
    }
  };

  const getGenderIcon = () => {
    switch (gender) {
      case 1:
        return <ManOutlined style={{ color: "#1890ff" }} />;
      case 2:
        return <WomanOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return <UserOutlined style={{ color: "#8c8c8c" }} />;
    }
  };

  return (
    <div
      style={{
        padding: "10px",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        width: '100%'
      }}
    >
      {/* 头像 */}
      <img
        src={imgSrc}
        alt={`${username}'s avatar`}
        onError={handleError}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "20%",
          border: "2px solid #f0f0f0",
          objectFit: "cover",
        }}
      />

      {/* 用户信息 */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
            fontSize: "15px",
          }}
        >
          {nation && <Flag code={String(nation).toLowerCase()} />}
          <div style={{ marginRight: "6px", width: '40%', overflow: 'hidden' }}>
            {username}
          </div>
          {getGenderIcon()}
        </div>
        <div style={{ fontSize: "12px", color: "#8c8c8c" }}>在线</div>
      </div>
      <div>
        {isMbr ? '用户' : '临时'}
      </div>
    </div>
  );
};

UserAvatar.propTypes = {
  gender: PropTypes.number,
  username: PropTypes.string.isRequired,
  nation: PropTypes.string,
};


export default UserAvatar;
