// SuccessStories.jsx
import React, { useRef } from "react";
import "./stories.css";
import { DefualtAvatar } from "@/shared/config";

const SuccessStories = () => {
  const scrollRef = useRef(null);
  const stories = [
    {
      id: 1,
      couple: [
        `${DefualtAvatar}/avatar-0_01.gif`,
        `${DefualtAvatar}/avatar-1_01.gif`,
      ],
      text: "相识3个月后我们订婚了",
      location: "北京 ↔ 上海",
      date: "2023.05",
    },
    {
      id: 2,
      couple: [
        `${DefualtAvatar}/avatar-0_02.gif`,
        `${DefualtAvatar}/avatar-1_02.gif`,
      ],

      text: "相识3个月后我们订婚了",
      location: "济南 ↔ 北京",
      date: "2023.05",
    },
    {
      id: 3,
      couple: [
        `${DefualtAvatar}/avatar-0_03.gif`,
        `${DefualtAvatar}/avatar-1_03.gif`,
      ],

      text: "相识3个月后我们订婚了",
      location: "潍坊 ↔ 深圳",
      date: "2023.06",
    },
    {
      id: 4,
      couple: [
        `${DefualtAvatar}/avatar-0_06.gif`,
        `${DefualtAvatar}/avatar-1_04.gif`,
      ],

      text: "相识6个月后我们订婚了",
      location: "潍坊 ↔ 青岛",
      date: "2023.06",
    },
    // 其他案例数据...
  ];

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="stories-container">
      <div className="section-header">
        <h2>真实恋爱故事</h2>
        <div className="scroll-controls">
          <button onClick={() => handleScroll("left")} aria-label="向左滚动">
            &lt;
          </button>
          <button onClick={() => handleScroll("right")} aria-label="向右滚动">
            &gt;
          </button>
        </div>
      </div>

      <div className="stories-scroller" ref={scrollRef}>
        {stories.map((story) => (
          <div key={story.id} className="story-card">
            <div className="avatar-pair">
              <img
                src={story.couple[0]}
                alt="用户"
                className="avatar left-avatar"
                
              />
              <img
                src={story.couple[1]}
                alt="用户"
                className="avatar right-avatar"
                
              />
            </div>
            <div className="story-content">
              <p className="quote">"{story.text}"</p>
              <div className="meta">
                <span className="location">{story.location}</span>
                <span className="date">{story.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuccessStories;
