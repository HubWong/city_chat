import React from "react";
import { DefualtAvatar } from "@/shared/config";
import "./quickmatch.css";
import { useReduxAuth } from "../../../hooks/useReduxAuth";

const users = [
  {
    id: 1,
    name: "Alex",
    age: 28,
    avatar: `${DefualtAvatar}/avatar-0_02.gif`,
    online: true,
  },
  {
    id: 2,
    name: "Zhang",
    age: 38,
    avatar: `${DefualtAvatar}/avatar-0_06.gif`,
    online: true,
  },
  {
    id: 3,
    name: "Zhang",
    age: 38,
    avatar: `${DefualtAvatar}/avatar-1_07.gif`,
    online: true,
  },
];

const QuickMatch = () => {
  const { toggleTmperProfile } = useReduxAuth()

  return <section className="quickmatch-section">
    <h2>高匹配推荐</h2>
    <div className="user-grid">
      {users.map((user) => (
        <div key={user.id} className="user-card">
          <div className={`avatar ${user.online ? "online" : ""}`}>
            <img src={user.avatar} alt={user.name} />
          </div>
          <h3>
            {user.name}, {user.age}
          </h3>
        </div>
      ))}
    </div>
    <div className="quick-register">

      <button onClick={() => toggleTmperProfile()}>立即开始</button>
    </div>
  </section>
};
export default QuickMatch;
