import React from "react";
import PropTypes from "prop-types";
import { Card, Tag, Typography, Button } from "antd";
import { Link } from "react-router-dom";

const { Text } = Typography;
const MessageItem = ({
  type,
  content,
  time,
  hasDetail,
  sender_id = null,
  onAccept = null,
}) => (
  <Card size="small" style={{ marginBottom: 16 }}>
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {type.icon && (
          <Tag icon={type.icon} color={type.color}>
            {type.label}
          </Tag>
        )}
        <Text>{content}</Text>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Text type="secondary">{new Date(time).toLocaleString()}</Text>
        {hasDetail && sender_id && (
          <div>
            <Link
              to={`/user/${sender_id}`}
              size="small"
              style={{ marginRight: 10 }}
            >
              查看对方
            </Link>
           <Button size="small" onClick={onAccept}>
              {type.label==='好友请求'? '同意':'忽略'}
            </Button>
          </div>
        )}
      </div>
    </div>
  </Card>
);

MessageItem.propTypes = {
  type: PropTypes.shape({
    icon: PropTypes.node,
    color: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
  content: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  hasDetail: PropTypes.bool,
};

export default MessageItem;
