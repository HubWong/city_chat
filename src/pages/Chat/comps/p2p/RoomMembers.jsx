// comps/MemberPanel.jsx

export default function RoomMembers({ members, mySid }) {
  // 找出对方（不是自己的那个）
  const other = members.find(m => m.sid !== mySid);
  const me = members.find(m => m.sid === mySid);

  return (
    <div className="room-members">
      {/* 左侧：对方 */}
      {other && (
        <div className="member-item other">
          对方: {other.username}
        </div>
      )}

      {me && (
        <div className="member-item me">
          我
        </div>
      )}
    </div>
  );
}