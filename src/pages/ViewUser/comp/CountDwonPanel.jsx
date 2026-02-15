// CountdownPanel.tsx
import { useState, useEffect, useCallback } from 'react';


const CountdownPanel = ({
  targetDate,
  onComplete,
  format = '{days} 天 {hours} 小时 {minutes} 分 {seconds} 秒',
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = useCallback(() => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // 检查是否倒计时结束
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        if (onComplete) onComplete();
        clearInterval(timer);
      }
    }, 1000);

    // 立即计算一次，避免首次渲染延迟
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [calculateTimeLeft, onComplete]);

  // 格式化输出
  const formatted = format
    .replace('{days}', String(timeLeft.days).padStart(1, '0'))
    .replace('{hours}', String(timeLeft.hours).padStart(2, '0'))
    .replace('{minutes}', String(timeLeft.minutes).padStart(2, '0'))
    .replace('{seconds}', String(timeLeft.seconds).padStart(2, '0'));

  return <div className={className}><span style={{ color: '#afafafff', marginRight: '1em' }}>剩余展示:</span>{formatted}</div>;
};

export default CountdownPanel;