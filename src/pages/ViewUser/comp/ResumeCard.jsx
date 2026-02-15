// src/components/ResumeCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calAge, getTempId } from '@/shared/config/util';
import './ResumeCard.css';
import { addOneDaySimple, getGenderText } from '../../../services/toolFuncs';
import CountdownPanel from './CountDwonPanel';
import { useUserApi } from '../hook/useUserApi';
import { useReduxAuth } from '../../../hooks/useReduxAuth';

export const ResumeCard = ({ resume }) => {
  const navigate = useNavigate();
  const tempId = getTempId();
  const { user } = useReduxAuth()
  const { downUserCvReq } = useUserApi()
  const isMyResume = resume.tempId === tempId;
  const [downCv, setDownCv] = useState(false)
  const autoDownCv = async () => {
    if (downCv) {
      return false
    }
    await downUserCvReq(resume.id)
    setDownCv(true)
  }
  const handleClick = () => {
    if (!user) {
      navigate('/login')
      return false
    }
    navigate(`/user/${resume.id}`);
  };



  return (
    <div className={`resume-card ${isMyResume ? 'my-resume' : ''}`} onClick={handleClick}>
      {isMyResume && (
        <div className="my-badge">我的简历</div>
      )}
      <div className={`card-header ${resume.gender === '女' ? 'female-header' : ''}`}>
        <div className="name-gender">
          <h3 className="username">{resume.username}</h3>
          <span className="gender">{getGenderText(resume.gender)}</span>
        </div>
        <div className="birth_year">{calAge(resume.birth_year)}岁</div>
      </div>

      <div className="card-body">
        <div className="info-row">
          <span className="label">出生年份:</span>
          <span className="value">{resume.birth_year}年</span>
        </div>
        <div className="info-row">
          <span className="label">彩礼:</span>
          <span className="value dowry">{!resume.dowry ? '无要求' : resume.dowry}</span>
        </div>
        <div className="info-row">
          <span className="label">所在城市:</span>
          <span className="value city">{resume.living_city}</span>
        </div>
        {resume.sid && <div className="info-row">
          <span className="label">在线</span>

        </div>}
      </div>

      <div className="card-footer">
        <p className="description">{resume.description}</p>
        <div className="view-detail">查看详情 →</div>
      </div>

      <div className="expiry-indicator">
        <CountdownPanel targetDate={addOneDaySimple(resume.updated_at)}
          onComplete={null} />
      </div>
    </div>
  );
};

export default ResumeCard;