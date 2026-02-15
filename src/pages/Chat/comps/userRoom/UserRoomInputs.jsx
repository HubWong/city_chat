import React, { useState, useRef } from 'react'
import { FileAddOutlined, FileImageOutlined } from '@ant-design/icons'
import ChatBridge from '@/shared/model/chatBridge'
import { MsgModel } from '@/shared/model/msgModel'
import { useWebCxt } from '../../../../services/WebCxt'
import { message } from 'antd'
const UserRoomInputs = ({ room }) => {
    const { socket, user } = useWebCxt()
    const [api,contextHolder]=message.useMessage()
    const imgRef = useRef(null);
    const fileRef = useRef(null);
    const [messageInput, setMessageInput] = useState('')
    const [messagesList, setMessagesList] = useState()

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }
    const handleSendMessage = () => {
        if (messageInput.trim() === '') return
        const newMessage = MsgModel.
            createOutgoing(messageInput.trim(), room.title, '', socket?.id, user)
        // setMessagesList([...messagesList, newMessage])
        console.log('send msg:', newMessage)
        ChatBridge.sendMsg(newMessage, true)
        setMessageInput('')

        // 模拟消息送达和已读
        // setTimeout(() => {
        //     setMessagesList(prev =>
        //         prev.map(msg =>
        //             msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        //         )
        //     )
        // }, 500)

        // setTimeout(() => {
        //     setMessagesList(prev =>
        //         prev.map(msg =>
        //             msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        //         )
        //     )
        // }, 1000)
    }

 
    const handleSendImg = (e) => {

        const file = e.target.files?.[0];
        if (!file) return;

        // 限制文件类型和大小（可选）
        if (!file.type.startsWith('image/')) {
            api.warning('请选择图片文件');
            return;
        }
        const fs = file.size
        const mtLm = 1 * 1024 * 1024
        if (fs > mtLm) {
            api.error('图片超过1M请使用发送文件', 2)
            return
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result;
            if (typeof base64 === 'string') {
                const model = MsgModel.createOutgoing(
                    base64,
                    room.title,
                    '',
                    socket.id,
                    user,
                    MsgModel.socketMsgType.chat_image)

                ChatBridge.sendMsg(model,true)
            }
        };
        reader.readAsDataURL(file);
    };

    
    return (
        <div className="message-input-container">
            {contextHolder}
            <div className="input-actions">
                <input
                    ref={imgRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleSendImg}
                />
                <input
                    ref={fileRef}
                    type="file"
                    hidden
                    onChange={e => onFile(e.target.files?.[0])}
                />
                {/* <button className="action-btn" aria-label="文件分享" onClick={()=>fileRef.current.click() }>
                    <FileAddOutlined />
                </button> */}
                <button className="action-btn" aria-label="图片" onClick={() => imgRef.current.click()}>
                    <FileImageOutlined />
                </button>
            </div>

            <div className="input-wrapper">
                <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="输入消息..."
                    className="message-textarea"
                    rows="1"
                    maxLength="500"
                />
                {messageInput.trim() === '' ? (
                    <button className="voice-btn" aria-label="语音">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 16C14.2091 16 16 14.2091 16 12V4C16 1.79086 14.2091 0 12 0C9.79086 0 8 1.79086 8 4V12C8 14.2091 9.79086 16 12 16Z" fill="currentColor" />
                            <path d="M4 11.5C4 12.8807 5.11929 14 6.5 14C7.88071 14 9 12.8807 9 11.5V9.5C9 8.11929 7.88071 7 6.5 7C5.11929 7 4 8.11929 4 9.5V11.5Z" fill="currentColor" />
                            <path d="M15 11.5C15 12.8807 16.1193 14 17.5 14C18.8807 14 20 12.8807 20 11.5V9.5C20 8.11929 18.8807 7 17.5 7C16.1193 7 15 8.11929 15 9.5V11.5Z" fill="currentColor" />
                        </svg>
                    </button>
                ) : (
                    <button
                        className="send-btn"
                        onClick={handleSendMessage}
                        disabled={messageInput.trim() === ''}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}

export default UserRoomInputs
