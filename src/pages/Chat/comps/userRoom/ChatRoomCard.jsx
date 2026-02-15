import { useNavigate } from 'react-router-dom'
import './ChatRoomCard.css'
import { getDefaultAvatar } from '../../../../services/toolFuncs'
import { formatDateTime } from '../../../../shared/config'
/*chat room card in Chat module*/
function ChatRoomCard({ room }) {

  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/room/${room.id}`)
  }

  return (
    <div className="chat-room-card" onClick={handleClick}>
      <div className="card-avatar">
        <img src={room.url || getDefaultAvatar(room.title)} alt={room.title} />
        {room.unreadCount > 0 && (
          <div className="unread-badge">
            {room.unreadCount > 99 ? '99+' : room.unreadCount}
          </div>
        )}
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3 className="room-name">{room.title}</h3>
          <span className="room-time">{formatDateTime(room.created_at)}</span>
        </div>

        <div className="card-body">
          <p className="room-description">{room.memo || '暂无介绍'}</p>
          <div className="room-meta">
            <span className="member-count">👥 {room.max_man}</span>
            {room.lastMessage && (
              <p className="last-message">{room.lastMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatRoomCard