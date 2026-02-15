import { v4 as uuidv4 } from "uuid";
import { STORAGE_KEY, DefualtAvatar } from "@/shared/config/index";
import { pinyin } from "pinyin-pro";

import Cookies from 'js-cookie';

//time count down
function calculateRemainingTime(targetTimeStr) {
  const targetTime = new Date(targetTimeStr).getTime();
  const now = Date.now();

  // 如果目标时间已过，返回 0 或负值
  if (targetTime <= now) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true
    };
  }

  const diff = targetTime - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false
  };
}

export function addOneDaySimple(isoString) {

  if (!isoString) {
    return Date.now()
  }
  const date = new Date(isoString);
  date.setDate(date.getDate() + 1);
  return date.toISOString(); // 返回标准 ISO 字符串（带毫秒，以 Z 结尾）
}
export const getGenderText = (gender) => {

  if (gender === 0) return '女';
  if (gender === 1) return '男';
  return '未知';
};

export const getMartialText = (status) => {

  if (!status) {
    console.error("status not defined..")
  }
  let txt = "未知"
  switch (status) {
    case 0:
      txt = "未婚"
      break;
    case 1:
      txt = "已婚"
      break;
    case 2:
      txt = "离异"
      break;
    case 3:
      txt = "丧偶"
      break;
    case 4:
      txt = "保密"
      break;
    default:
      break;
  }
  return txt
}
export function startCountdown(targetTimeStr) {

  const interval = setInterval(() => {
    const remaining = calculateRemainingTime(targetTimeStr);
    if (remaining.isExpired) {
      //console.log("时间到！");

      clearInterval(interval);
      return "时间到"
    } else {
      console.log(`剩余：${remaining.days}d ${remaining.hours}h ${remaining.minutes}m ${remaining.seconds}s`);
      return `${remaining.hours}小时 ${remaining.minutes}分 ${remaining.seconds}秒`
    }
  }, 1000);
}



export const converToPinyin = (charsCn) => {
  return pinyin(charsCn, {
    toneType: 'none',     // 不带声调
    type: 'array',        // 返回数组 ['bei', 'jing']     
  }).join('')
}

// 设置Cookie（默认永久）
export const saveToCookie = (name, value, days = 365 * 100, options = {}) => {
  Cookies.set(name, value, {
    expires: days,
    path: '/',
    secure: true,
    ...options
  });
};

// 获取Cookie
export const getCookie = (name) => {
  return Cookies.get(name);
};

// 删除Cookie
export const removeCookie = (name, path = '/') => {
  Cookies.remove(name, { path });
};

export const _GenId = () => {
  return uuidv4();
};

export const getLocalItem = (key) => {
  return localStorage.getItem(key);
};

export const setLocalItem = (key, value) => {
  localStorage.setItem(key, value);
};

export const removeLocalItem = (key) => { 
  localStorage.removeItem(key);
};

export const _getOrGenStrCookie = (key) => {
  const uniqueId = getCookie(key);
  if (uniqueId) {
    return uniqueId;
  } else {
    const newUniqueId = _GenId();
    saveToCookie(key, newUniqueId);
    return newUniqueId;
  }
};

export const getPcId = (isShort = false) => {
  let n = _getOrGenStrCookie(STORAGE_KEY.PC_ID);
  if (isShort) {
    return `<visitor-${n.substring(0, 6)}...>`
  }
  return n
};


export const genInvitCode = (length = 6) => {
  const code = getRandomInt(0, Math.pow(10, length) - 1);
  return code.toString();
}


export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function getRandomInRangeWithZero(min, max, length) {
  // 生成min到max之间的随机整数
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  // 转换为字符串并补前导0
  return randomNum.toString().padStart(length, "0");
}

export function getRandomWithLeadingZero(length) {
  // 生成随机数并补前导0
  const randomNum = Math.floor(Math.random() * Math.pow(10, length));
  return randomNum.toString().padStart(length, "0");
}
export function extractNumbers(str) {
  return str.match(/\d+(\.\d+)?/g) || [];
}

//image
const checkImageExists = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

const isImageUrl = (url) => {
  return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url.split('?')[0]);
};

export const validateImageUrl = async (url) => {
  if (isImageUrl(url)) {
    return false;
  }
  return await checkImageExists(url);
};

export function getDefaultAvatr(male = true) {

  const n = getRandomInRangeWithZero(1, 15, 2);
  if (male) {
    return `${DefualtAvatar}/avatar-0_${n}.gif`;
  } else {
    return `${DefualtAvatar}/avatar-1_${n}.gif`;
  }
}


export function getDefaultAvatar(name = 'man', bc = '0ea5e9', clr = 'red') {
  return `https://ui-avatars.com/api/?name=${name}&background=${bc}&color=${clr}`
}

export const imageResize = (file, maxSize = 800) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {

            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }));
          },
          'image/jpeg',
          0.75 // 压缩质量
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};


export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function checkMediaDevices() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.warn("此浏览器不支持媒体设备检测");
    return { camera: false, mic: false };
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = devices.some(d => d.kind === "videoinput");
    const hasMic = devices.some(d => d.kind === "audioinput");

    console.log("检测结果:", { hasCamera, hasMic });
    return { camera: hasCamera, mic: hasMic };
  } catch (err) {
    console.error("获取设备列表失败:", err);
    return { camera: false, mic: false };
  }
}


export async function isFirefox() {
  if (navigator.userAgentData) {
    try {
      const brand = await navigator.userAgentData.brands.find(b => b.brand === 'Mozilla');
      return !!brand; // 如果找到了Mozilla品牌，则返回true，否则返回false
    } catch (error) {
      console.error('无法获取userAgentData', error);
      return false;
    }
  } else {
    // 如果不支持userAgentData，回退到userAgent方法
    return window.navigator.userAgent.includes('Firefox');
  }
}


//extract by '()'
export const getByRegex = (strData) => {
  const regex = /\(([^)]+)\)/g;
  return [...strData.matchAll(regex)].map(match => match[1])
}

export function getParam(name, fallback = "") {
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || fallback;
}


export const genConvId = (uid1, uid2, typeStr) => {

  if (!uid1 || !uid2) {
    throw Error("uid1 or 2 not defined");
  }
  uid1 = `(${uid1})`
  uid2 = `(${uid2})`
  const p_id = [...[uid1, uid2].sort()].join("_");

  return `${typeStr}_${p_id}`;
};
