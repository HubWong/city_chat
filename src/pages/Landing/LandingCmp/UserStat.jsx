// UserStats.jsx
import React from 'react';
import './stats.css';

const UserStats = () => {
  // 模拟数据
  const stats = [
    { id: 1, icon: '👥', title: '今日活跃用户', count: 45678 },
    { id: 2, icon: '💑', title: '今日成功匹配', count: 2345 },
    { id: 3, icon: '🌟', title: '五星好评率', percentage: 92 },
  ];

  return (
    <section className="user-stats-container">
      {stats.map((stat) => (
        <div key={stat.id} className="stat-card">
          <div className="stat-icon">
            {stat.icon}
          </div>
          <div className="stat-info">
            <h3>{stat.title}</h3>
            {stat.count ? (
              <p className="count">{stat.count}</p>
            ) : (
              <p className="percentage">{stat.percentage}%</p>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default UserStats;
