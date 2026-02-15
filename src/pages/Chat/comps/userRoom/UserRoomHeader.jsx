import React from 'react'
import { getDefaultAvatar } from '@/services/toolFuncs'
import { useNavigate } from 'react-router-dom'

const UserRoomHeader = ({ room, members }) => {
    const navigate = useNavigate()
   
    return (
        <div className="room-header">
            <div className="header-left">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ←
                </button>
                <div className="room-avatar-large">
                    <img src={room.url || getDefaultAvatar(room.title)} alt={room.title} />
                </div>
                <div className="room-info">
                    <h1 className="room-title">{room.title}</h1>
                    <div className="room-members">
                        <span className="member-count">{members.length} 成员</span>
                        <div className="member-avatars">
                            {members.slice(0, 5).map((member, index) => (
                                <img
                                    key={member.id}
                                    src={member.avatar}
                                    alt={member.username}
                                    style={{ zIndex: members.length - index }}
                                />
                            ))}
                            {members.length > 5 && (
                                <span className="more-members">+{members.length - 5}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="header-right">
                <button className="header-btn" aria-label="更多">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                        <circle cx="12" cy="6" r="2" fill="currentColor" />
                        <circle cx="12" cy="18" r="2" fill="currentColor" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default UserRoomHeader
