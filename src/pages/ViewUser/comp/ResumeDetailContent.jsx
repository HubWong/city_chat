import React, { useMemo, useState, useEffect } from 'react'
import { Button, message } from 'antd'
import { HeartFilled, MessageOutlined, UserDeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { calAge } from '../../../shared/config/util';
import { useNavigate, useParams } from 'react-router-dom';
import { getGenderText, getMartialText, genConvId } from '../../../services/toolFuncs';
import SocketClient from '@/shared/model/socketModel';
import { MsgTargetType } from '@/shared/config';
import LeaveMsgModal from './LeaveMsgModal';
import { ChatSystem } from '@/shared/model/chatSystem';
import { useWebCxt } from '../../../services/WebCxt';

// 默认头像
const getDefGender = (gender) => {
    if (gender === '女') {
        return '♀';
    } else if (gender === '男') {
        return '♂';
    }
    return '?';
};

const DefaultAvat = ({ photos, gender }) => {

    const avat = photos.find(item => item.description === 'avatar')
    if (avat) {
        return <img alt="" src={avat.url} />
    }
    return <div className="avatar-default">
        {getDefGender(gender)}
    </div>
}
const ResumeDetailContent = ({resume, isFollowing, toggleFollow, currentUser, isMe }) => {
    const [api, contextHolder] = message.useMessage()
    
    const photos = resume.photos
    const { id } = useParams();
    const idNum = useMemo(() => (id ? parseInt(id, 10) : null), [id]);
    const { socket, connected } = useWebCxt()
    useEffect(() => {
        if (!connected||!socket)
            return
       
    }, [socket,connected])
    const navigate = useNavigate()
    const [uSid, setUSid] = useState(null)
    const [order, setOrder] = useState(null)
    const [showMsgModal, setSModel] = useState(false)

    const handleContact = async () => {

        if (!currentUser) {
            api.warning('请先登录');
            navigate('/login');
            return;
        }

        if (isMe) {
            api.warning('不能给自己发送私信');
            return;
        }

        if (idNum === null) {
            api.error('用户信息无效');
            return;
        }

        ChatSystem.switchTargetUser(resume)
        if (!resume.sid) {
            setSModel(true)
        } else {
            if (!socket.id) {
                api.error('sid 参数失效')
                return
            }
            const cid = genConvId(resume.sid, socket.id, MsgTargetType.MBR);
            navigate(`/room_prv/${cid}/${socket.id}`);
        }

    };

    useEffect(() => {
        if (!socket) {
            return
        }

        socket.on('user_sid', d => {
            const { userSid } = d
            setUSid(userSid)
        })
        if (resume && resume.data) {
            const { sid } = resume?.data
            if (!sid) {
                socket?.emit('req_sid_by_id', { user_id: idNum })
            } else {
                setUSid(sid)
            }
        }


        return () => {
            socket.off('user_sid')
        }
    }, [uSid, order])


    const getAgeFun = (birthYear) => {
        if (birthYear) {
            return <span className="value">{calAge(birthYear)}岁 ({birthYear}年出生)</span>
        }
        return <span className='value'>年龄不祥</span>
    }
    const genContactBtn = () => {
        return <button className="contact-button" onClick={handleContact} >
            {
                resume.sid ? <> <MessageOutlined style={{ marginRight: 5 }} />
                    立刻沟通</> : <> <MessageOutlined style={{ marginRight: 5 }} />
                    留言给Ta</>
            }
        </button>

    }
    return (
        <div className="detail-content">

            {contextHolder}
            <div className="avatar-section">
                <div className="avatar-large">
                    {photos && <DefaultAvat photos={photos} gender={resume?.gender} />}

                </div>

                <div className="follow-button-wrapper">
                    <Button
                        type={isFollowing ? 'default' : 'primary'}
                        danger={isFollowing}
                        onClick={() => toggleFollow('follow')}
                        size="large"
                        icon={isFollowing ? <UserDeleteOutlined /> : <UserAddOutlined />}
                        style={{
                            marginTop: '16px',
                            width: '100%',
                            fontWeight: '600'
                        }}
                    >
                        {isFollowing ? '取消关注' : '关注'}
                    </Button>

                    <Button
                        type='danger'
                        icon={<HeartFilled />}
                        size="large"
                        onClick={() => toggleFollow('like')}
                        style={{
                            marginTop: '8px',
                            width: '100%',
                            background: '#da2a2d',  // 鲜艳的红色
                            borderColor: '#ff4d4f',
                            color: 'white',
                            fontWeight: '600'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#cf1322';  // 悬停时更深的红色
                            e.currentTarget.style.borderColor = '#cf1322';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ff4d4f';
                            e.currentTarget.style.borderColor = '#ff4d4f';
                        }}
                    >
                        喜欢
                    </Button>
                </div>
            </div>

            <div className="basic-info">
                <div className="info-item">
                    <span className="label">姓名:</span>
                    <span className="value">{resume?.username || '姓名不详'}</span>
                </div>
                <div className="info-item">
                    <span className="label">性别:</span>
                    <span className="value gender">{getGenderText(resume?.gender)}</span>
                </div>
                <div className="info-item">
                    <span className="label">年龄:</span>

                    {getAgeFun(resume?.birth_year)}
                </div>
                <div className="info-item">
                    <span className="label">彩礼要求:</span>
                    <span className="value dowry">{!resume?.dowry ? "无要求" : resume?.dowry}</span>
                </div>
                <div className="info-item">
                    <span className="label">婚姻状态:</span>
                    <span className="value marital_status">{getMartialText(resume?.marital_status)}</span>
                </div>
                <div className="info-item">
                    <span className="label">所在城市:</span>
                    <span className="value city">{resume?.living_city}</span>
                </div>
                <div className="info-item">
                    <span className="label">个人亮点:</span>
                    <span className="value strong_points">{resume?.strong_points ?? '没写'}</span>
                </div>
            </div>

            <div className="description-section">
                <h2>个人介绍</h2>
                <p className="bio">{resume?.bio}</p>
            </div>

            <div className="contact-section">
                <h2>联系方式</h2>
                <p>请通过平台私信联系</p>
                {genContactBtn()}

            </div>
            <LeaveMsgModal show={showMsgModal} onHide={() => setSModel(false)} />
        </div>
    )
}

export default ResumeDetailContent
