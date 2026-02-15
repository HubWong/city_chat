// HeroSection.jsx
import React from 'react';
import './Hero.css';
import { Link } from 'react-router-dom'; // 假设你正在使用react-router-dom进行路由管理

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>遇见你的心动瞬间</h1>
        <p>加入数百万寻找真爱的单身人士，开启你的浪漫之旅</p>
        <Link to="/sign_up" className="cta-button">立即注册</Link>
      </div>
      <div className="hero-image">
        <img src="/image/home-hero.jpg" alt="情侣在海边看日落" />
      </div>
    </section>
  );
};

export default HeroSection;
