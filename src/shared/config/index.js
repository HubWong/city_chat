// API配置
export const API_BASE_URL = "http://localhost:8000";
export const UI_URI = 'http://localhost:5173'
export const host = `${API_BASE_URL}/api/v1`;
export const AdminEmail = "wyb6688@hotmail.com";
// Socket配置
export const SOCKET_URL = "ws://localhost:8000";

// 默认头像
export const DEFAULT_AVATAR_IMG = {
  MEN: "https://randomuser.me/api/portraits/men/1.jpg",
  WOMEN: "https://randomuser.me/api/portraits/women/1.jpg",
  DEFAULT_AVATAR_URL: "https://api.dicebear.com/7.x/avataaars/svg",
};

export const DefaultFolder = "/image";
export const DefualtAvatar = "/image/avatar";

// 年份选项
const currentYear = new Date().getFullYear();
const minBirthYear = 1925;
const maxBirthYear = currentYear - 18;
export const years = Array.from(
  { length: maxBirthYear - minBirthYear + 1 },
  (_, i) => maxBirthYear - i
);



// 生成时间戳显示文本
export const formatTimestamp = (timestamp) => {
  const now = new Date()
  const msgDate = new Date(timestamp)

  const isToday = now.toDateString() === msgDate.toDateString()
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === msgDate.toDateString()

  if (isToday) {
    return msgDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (isYesterday) {
    return '昨天 ' + msgDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else {
    return msgDate.toLocaleDateString('zh-CN') + ' ' + msgDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
}

// 生成相对时间
export const formatRelativeTime = (timestamp) => {
  const now = new Date()
  const msgDate = new Date(timestamp)
  const diff = now - msgDate

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return days + '天前'
  } else if (hours > 0) {
    return hours + '小时前'
  } else if (minutes > 0) {
    return minutes + '分钟前'
  } else {
    return '刚刚'
  }
}
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const MODE_TYPES = {
  VIDEO: "video",
  FILE: "file",
};


export const MsgTargetType = {
  MBR: "mbr", //from user id   
  PRIVATE: "private", //sid 
  SYS: "sys", //
};

export const GenSocketUserFor = {
  TMPER_ME: "temper_me",
  SELECT_ANONY: "select_anony",
  SELECT_MBR: "select_mbr",
  BY_UId: 'by_user_id'
};


// 本地存储key
export const STORAGE_KEY = {
  TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
  USER_INFO: "userInfo",
  PC_ID: "pcId",
};

export const paymentPlans = [
  {
    id: "monthly",
    name: "月度",
    price: 5,
    currency: "USD",
    duration: "1个月",
    features: ["跨国消息发送", "无限制聊天", "优先客服支持"],
  },
  {
    id: "halfyear",
    name: "半年",
    price: 10,
    currency: "USD",
    duration: "6个月",
    features: ["跨国消息发送", "无限制聊天", "优先客服支持", "8折优惠"],
  },
  {
    id: "yearly",
    name: "年度",
    price: 38,
    currency: "USD",
    duration: "12个月",
    features: ["跨国消息发送", "无限制聊天", "优先客服支持", "6折优惠"],
  },
];

export const PaymentStatusType = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
};
export const paymentList = [
  // 中国支付方式
  {
    id: "alipay",
    name: "支付宝",
    icon: "alipay",
    region: "CN",
    description: "支持余额、银行卡、花呗等多种付款方式",
  },
  {
    id: "wechat",
    name: "微信支付",
    icon: "wechat",
    region: "CN",
    description: "使用微信扫码或零钱支付",
  },
  {
    id: "unionpay",
    name: "银联",
    icon: "unionpay",
    region: "CN",
    description: "支持所有银联卡在线支付",
  },
  // {
  //   id: "qq_pay",
  //   name: "QQ钱包",
  //   icon: "qq",
  //   region: "CN",
  //   description: "使用QQ钱包余额支付",
  // },

  // 国际支付方式
  {
    id: "cryt",
    name: "加密货币",
    icon: "qq",
    region: "GLOBAL",
    description: "使用加密代币支付",
  },
  // {
  //   id: "visa",
  //   name: "Visa",
  //   icon: "visa",
  //   region: "GLOBAL",
  //   description: "全球通用的信用卡支付",
  // },
  // {
  //   id: "mastercard",
  //   name: "MasterCard",
  //   icon: "mastercard",
  //   region: "GLOBAL",
  //   description: "万事达卡信用卡支付",
  // },
  // {
  //   id: "paypal",
  //   name: "PayPal",
  //   icon: "paypal",
  //   region: "GLOBAL",
  //   description: "全球领先的在线支付平台",
  // },
  // {
  //   id: "stripe",
  //   name: "Stripe",
  //   icon: "stripe",
  //   region: "GLOBAL",
  //   description: "安全便捷的信用卡处理",
  // },
  // {
  //   id: "apple_pay",
  //   name: "Apple Pay",
  //   icon: "apple",
  //   region: "GLOBAL",
  //   description: "使用Touch ID或Face ID快速支付",
  // },
  // {
  //   id: "google_pay",
  //   name: "Google Pay",
  //   icon: "google",
  //   region: "GLOBAL",
  //   description: "Google钱包快速支付",
  // },
  // {
  //   id: "amazon_pay",
  //   name: "Amazon Pay",
  //   icon: "amazon",
  //   region: "GLOBAL",
  //   description: "使用Amazon账户信息支付",
  // },

  // 其他地区支付方式
  {
    id: "ideal",
    name: "iDEAL",
    icon: "ideal",
    region: "EU",
    description: "荷兰最受欢迎的在线支付方式",
  },
  {
    id: "sofort",
    name: "Sofort",
    icon: "sofort",
    region: "EU",
    description: "德国银行直接转账",
  },
  {
    id: "giropay",
    name: "Giropay",
    icon: "giropay",
    region: "EU",
    description: "德国银行在线支付",
  },
  {
    id: "bancontact",
    name: "Bancontact",
    icon: "bancontact",
    region: "EU",
    description: "比利时本地支付方式",
  },
];
