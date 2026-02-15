
import { getPcId } from "../../services/toolFuncs";

const TEMP_ID_KEY = 'temp_user_id';
const AVATAR_PREFIX = 'dating_avatar_';

// 获取临时ID（24小时有效）
export const getTempId = () => {
  const stored = localStorage.getItem(TEMP_ID_KEY);
  if (stored) {
    try {
      const { id, timestamp } = JSON.parse(stored);
      const now = Date.now();

      if (now - timestamp < 86400000) {
        return id;
      } else {
        // 过期，清除旧ID
        localStorage.removeItem(TEMP_ID_KEY);
      }
    } catch (error) {
      console.error('解析临时ID失败:', error);
      localStorage.removeItem(TEMP_ID_KEY);
    }
  }

  // 生成新ID
  const newId = getPcId();
  localStorage.setItem(TEMP_ID_KEY, JSON.stringify({
    id: newId,
    timestamp: Date.now()
  }));
  return newId;
};

//avatar

// 保存头像到 localStorage (作为 base64 字符串)
export const saveAvatar = (tempId, file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const base64String = e.target.result;
        const avatarKey = AVATAR_PREFIX + tempId;
        localStorage.setItem(avatarKey, base64String);
        resolve(base64String);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// 获取头像
export const getAvatar = (tempId) => {
  const avatarKey = AVATAR_PREFIX + tempId;
  return localStorage.getItem(avatarKey);
};


export const calAge = (birthYear) => {
  return new Date().getFullYear() - parseInt(birthYear)
}

