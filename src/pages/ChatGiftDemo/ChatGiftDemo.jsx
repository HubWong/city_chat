import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  FireFilled,
  CrownFilled,
  RocketFilled,
  GiftFilled,
} from "@ant-design/icons";
import { Badge, message } from "antd";
import "./anminate.css";

export const GIFT_TYPES = {
  ROSE: {
    icon: <FireFilled className="gift-icon" />,
    color: "#ff4d4f",
    name: "玫瑰",
    level: 1,
    price: 50,
  },
  DIAMOND: {
    icon: <CrownFilled className="gift-icon" />,
    color: "#1890ff",
    name: "钻石",
    level: 2,
    price: 150,
  },
  ROCKET: {
    icon: <RocketFilled className="gift-icon" />,
    color: "#722ed1",
    name: "火箭",
    level: 3,
    price: 500,
  },
  DEFAULT: {
    icon: <GiftFilled className="gift-icon" />,
    color: "#52c41a",
    name: "礼物",
    level: 0,
    price: 10,
  },
};

const GiftAnimation = ({
  type = "DEFAULT",
  position = "center",
  duration = 2000,
  onAnimationEnd,
}) => {
  const [animationState, setAnimationState] = useState("enter");
  const giftConfig = useMemo(() => GIFT_TYPES[type] || GIFT_TYPES.DEFAULT, [
    type,
  ]);

  // 动画阶段控制
  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setAnimationState("active");
      message.success(`收到${giftConfig.name}礼物！`);
    }, 300);

    const exitTimer = setTimeout(() => {
      setAnimationState("exit");
      setTimeout(() => onAnimationEnd?.(), 500);
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [duration, giftConfig.name, onAnimationEnd]);

  // 根据位置计算初始样式
  const getPositionStyle = () => {
    const positions = {
      center: { top: "50%", left: "50%" },
      top: { top: "20%", left: "50%" },
      bottom: { top: "80%", left: "50%" },
    };
    return positions[position] || positions.center;
  };

  return (
    <div
      className={`gift-container ${animationState}`}
      style={{
        ...getPositionStyle(),
        "--gift-color": giftConfig.color,
        "--animation-duration": `${duration}ms`,
      }}
    >
      <Badge count={giftConfig.level} color={giftConfig.color}>
        <div className="gift-content">
          {giftConfig.icon}
          <span className="gift-name">{giftConfig.name}</span>
        </div>
      </Badge>
      <div className="particle-effect" />
    </div>
  );
};

GiftAnimation.propTypes = {
  type: PropTypes.oneOf(["ROSE", "DIAMOND", "ROCKET", "DEFAULT"]),
  position: PropTypes.oneOf(["center", "top", "bottom"]),
  duration: PropTypes.number,
  onAnimationEnd: PropTypes.func,
};

export default GiftAnimation;
