import { useEffect, useState } from "react";

export const useIpInfos = () => {
  const getFromLocalStorage = () => {
    const storedIpInfo = localStorage.getItem("ipInfo");
    
    if (storedIpInfo) {
      try {
        return JSON.parse(storedIpInfo);
      } catch (e) {
        console.warn("[*] Failed to parse ipInfo from localStorage", e);
        localStorage.removeItem("ipInfo"); // 清除损坏数据
        return null;
      }
    }
    return null;
  };

  const [ipInfo, setIpInfo] = useState(() => getFromLocalStorage()); // 使用惰性初始化

  const getIpInfo = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/"); // 移除多余空格
      const data = await response.json();
      if (data && !data.error) {
        setIpInfo(data);
        localStorage.setItem("ipInfo", JSON.stringify(data));
      } else {
        console.error("[*] Invalid IP info response:", data);
      }
    } catch (error) {
      console.error("[*] Error getting user location:", error);
    }
  };

  useEffect(() => {
    
    // 仅在首次渲染且无缓存时获取
    if (!ipInfo) {
      getIpInfo();
    }
  }, []); // 依赖项为空数组，确保只运行一次

  return { getIpInfo, ipInfo };
};