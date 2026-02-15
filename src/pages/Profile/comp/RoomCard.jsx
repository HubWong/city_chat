import { Link } from 'react-router-dom'
import { MessageOutlined, UserOutlined, ClockCircleOutlined, SafetyOutlined } from '@ant-design/icons'
import './RoomCard.css'
import { formatDateTime } from '@/shared/config/index'
const RoomCard = ({ room }) => {


  // 判断是否有密码
  const hasPassword = !!room.room_pwd && room.room_pwd.trim() !== ''

  return (

    <div className="room-card">
      <div className="room-card-content">
        <div className="room-card-header">
          <div className="room-card-title-group">
            <div className="room-card-title-wrapper">
              <h3 className="room-card-title">
                {room.title}
              </h3>
              {hasPassword && (
                <SafetyOutlined
                  className="room-card-password-icon"
                  title="需要密码"
                />
              )}
            </div>
            <p className="room-card-description">
              {room.memo || '暂无简介'}
            </p>
          </div>
          {room.avatar && (
            <div className="room-card-avatar">
              <span className="room-card-avatar-text">
                {room.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="room-card-footer">
          <div className="room-card-info">
            <UserOutlined className="room-card-icon" />
            <span>{room.max_man || 0} 人</span>
          </div>
          <div className="room-card-info">
            <ClockCircleOutlined className="room-card-icon" />
            <span>{formatDateTime(room.updated_at)}</span>
          </div>
        </div>
      </div>

      <div className="room-card-action flex">
        <span>
          <Link to={`/room/${room.id}`}>
            <MessageOutlined className="room-card-action-icon" />进入聊天
          </Link>
        </span>
        <span>
          <Link to={`/center/user_room/${room.id}`} className="">
            修改
          </Link>
        </span>
      </div>


    </div>

  )
}

export default RoomCard