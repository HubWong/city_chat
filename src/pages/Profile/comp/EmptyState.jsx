import { MessageOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"
import { Button } from "antd"

export const EmptyState = ({ message, showCreateButton = true }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <MessageOutlined style={{ fontSize: '32px', color: '#1677ff' }} />
      </div>
      <p className="empty-state-message">
        {message || '暂无聊天室'}
      </p>
      {showCreateButton && (
        <Link to="/center/user_room/new">
          <Button type="primary" size="large">
            创建第一个聊天室
          </Button>
        </Link>
      )}
    </div>
  )
}
