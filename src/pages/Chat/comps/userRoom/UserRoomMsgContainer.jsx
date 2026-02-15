import { useRef, useState, useEffect } from 'react'
import { useMessages } from "@/services/msgCxt";
import MessageBubble from './MessageBubble'
import { useWebCxt } from '../../../../services/WebCxt'
import { Messages, MsgModel } from "@/shared/model/msgModel";


const UserRoomMsgContainer = ({ members, room }) => {
    const messagesEndRef = useRef(null)

    const { socket } = useWebCxt()
    const { roomMsgs } = useMessages()
    const messageList = roomMsgs(room.title)

    useEffect(() => {
        scrollToBottom()
    }, [messageList])

    useEffect(() => {
        const onMsg = (msg) => {
            
            Messages.add(msg, 'in')
        }
        socket.on("text-message", onMsg);
        return ()=>{
            socket.off('text-message')
        }
    }, [])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="messages-container">
            <div className="messages-header">
                <div className="date-divider">
                    <span>{new Date().toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</span>
                </div>
            </div>

            <div className="messages-list" id="messages-list">
                {messageList.map((message) => (
                   <MessageBubble key={message?.msg_id}
                        message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* 在线状态 */}
            <div className="online-status">
                <div className="online-dot"></div>
                <span>{members.length} 人在线</span>
            </div>
        </div>
    )
}

export default UserRoomMsgContainer
