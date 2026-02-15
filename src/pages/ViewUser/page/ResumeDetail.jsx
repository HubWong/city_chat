import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate,Link} from 'react-router-dom';

import { useGetCvQuery } from '@/services/resumeApi'
import { Spin, message } from 'antd';
import './ResumeDetail.css';
import { useLazyCheckIsFollowingQuery } from '@/services/friendApi'
import { useFriendsApi } from '@/hooks/useFriendsApi';
import PhotoGallery from '../comp/PhotoGallery'
import ResumeDetailContent from '../comp/ResumeDetailContent'
import { useWebCxt } from '@/services/WebCxt';
import { useReduxAuth } from '../../../hooks/useReduxAuth';
import RoomsOfUser from '../comp/RoomsOfUser';


const ResumeDetail = () => {
  const { id } = useParams();
  const { user, socket, connected } = useWebCxt()

  const { userViewHistory, } = useReduxAuth()
  const [checkIsFollowing, { data, isSuccess }] = useLazyCheckIsFollowingQuery()
  const { data: resume, isLoading } = useGetCvQuery(id)
  const photos = resume?.data.photos
  const rooms = resume?.data.rooms

  const navigate = useNavigate();
  const { toggleFollowingRequest, relationRequest } = useFriendsApi()
  const [isMe, setIsMe] = useState(false)

  const [isFollowing, setIsFollowing] = useState(false);

  // 防御性处理
  const idNum = useMemo(() => (id ? parseInt(id, 10) : null), [id]);
  const _lastSameView = (targetId) => {
    const last = userViewHistory.findLast((item) => item.id === targetId);
    if (last) {
      if (Date.now() - last.id > 60000) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const sendViewUserNotice = () => {
    const sndReq = _lastSameView(id);
    if (sndReq) {
      const isViewModel = { ...user, to_user_id: id };
      socket.emit("view_user", isViewModel);
    }
  };


  useEffect(() => {
    if (!connected) {
      return
    }
    console.log('cnnected in detail')
    if (user && idNum !== null && idNum !== user.id) {
      checkIsFollowing(idNum);
    } else {
      setIsFollowing(false);
    }

  }, [id, idNum, user, checkIsFollowing, connected]);

  // 2. 更新 isFollowing 状态
  useEffect(() => {
    if (idNum === user?.id) {
      setIsMe(true)
    }
    if (isSuccess && data) {
      setIsFollowing(!!data.success);
    }
  }, [isSuccess, data]);

  const [api, contextHolder] = message.useMessage()

  const toggleFollow = async (followOrLike) => {

    if (!user) {
      navigate('/login')
      return
    }
    if (user?.id === idNum) {
      api.error('是自己');
      return;
    }

    if (followOrLike === 'follow') {
      const newStatus = await toggleFollowingRequest(idNum);
      const isNowFollowing = newStatus.data === 1;
      setIsFollowing(isNowFollowing);
      api.success(isNowFollowing ? '已关注' : '已取消关注');
    } else {
      const res = await relationRequest(idNum, 'like')
      if (res.success) {
        api.success('已喜欢')
      } else {
        api.info(res.message)
      }

    }



  };



  if (isLoading) {
    return <Spin description="loading" />
  }
  if (!resume) {
    return (
      <div className="not-found">
        <h2>简历未找到</h2>
        {!resume?.data.success && <h3>{resume?.data.message}</h3>}
        <button onClick={() => navigate('/')} className="back-button">
          返回列表
        </button>
      </div>
    );
  }



  return (
    <div className="resume-detail">
      {contextHolder}
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← 返回列表
        </button>
        <h1>{resume?.data.username || 'Ta'} 的个人介绍</h1>
      </div>
      <ResumeDetailContent resume={resume.data} isMe={isMe} currentUser={user} toggleFollow={toggleFollow} isFollowing={isFollowing} />
      {rooms  && <RoomsOfUser rooms={rooms}/>}
      {!rooms && <div> <Link to="/center/user_room/new">创建房间 </Link></div>}
      <PhotoGallery photos={photos} />
    </div>
  );
};

export default ResumeDetail;