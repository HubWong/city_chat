
import GiftAnimation,{GIFT_TYPES} from './ChatGiftDemo';
import GiftPanel from './GiftPanel'
import { useState,useRef } from 'react';
import { Card,List,Avatar } from 'antd';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [activeGift, setActiveGift] = useState(null);
  const listRef = useRef();

  const handleSend = (giftType) => {
    const newMsg = {
      id: Date.now(),
      type: 'gift',
      giftType,
      sender: '用户',
      time: new Date().toLocaleTimeString()
    };
    setMessages([...messages, newMsg]);
    setActiveGift(giftType);
  };

  return (
    <div style={{ width: 400, height: 600 }}>
      {activeGift && (
        <GiftAnimation 
          type={activeGift} 
          onEnd={() => setActiveGift(null)} 
        />
      )}

      <Card title="聊天室" styles={{ padding: 0 }}>
        <div ref={listRef} style={{ height: 400, overflowY: 'auto' }}>
          <List
            dataSource={messages}
            renderItem={item => (
              <List.Item>
                <div style={{ display: 'flex', width: '100%' }}>
                  <Avatar>{item.sender[0]}</Avatar>
                  <div style={{ marginLeft: 12 }}>
                    <div>
                      <strong>{item.sender}</strong>
                      <span style={{ marginLeft: 8, color: '#999' }}>
                        {item.time}
                      </span>
                    </div>
                    {item.type === 'gift' ? (
                      <div style={{ color: GIFT_TYPES[item.giftType].color }}>
                        {GIFT_TYPES[item.giftType].icon} 送出了 {GIFT_TYPES[item.giftType].name}
                      </div>
                    ) : item.content}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
        <GiftPanel onSend={handleSend} />
      </Card>
    </div>
  );
};

export default ChatWindow