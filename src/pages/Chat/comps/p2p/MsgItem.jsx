import { useState, useEffect } from 'react';  

const MsgItem = ({ fromUser, m }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const isMyMessage = fromUser === '我';
  const { content, rmt } = m.data;
  const isSys = m.status === 'sys';

  // 关闭预览（支持ESC键）
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setPreviewImage(null);
    };
    if (previewImage) {
      document.body.style.overflow = 'hidden'; // 防止背景滚动
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [previewImage]);

  const onImageClick = (e) => {
    e.stopPropagation();
    if (content) setPreviewImage(content); // 防御性检查
  };

  const closePreview = () => setPreviewImage(null);

  const renderContent = () => {
    switch (rmt) {
      case 'message':
        return <div className="message-body">{content}</div>;
      case 'img_msg':
        return (
          <img
            onClick={onImageClick}
            src={content}
            alt="图片消息"
            style={{ maxWidth: '150px', maxHeight: '150px', cursor: 'zoom-in' }}
            className="message-body"
            onError={(e) => {
              e.target.style.display = 'none';
              console.warn('图片加载失败:', content);
            }}
          />
        );
      case 'sys':
        return <div className="message-body">{content}</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className={`message-item ${isSys ? 'message-sys' : ''}`}>
        <div className={`message-container ${isMyMessage ? 'from-me' : 'from-other'}`}>
          <div className="message-content">
            {!isSys && (
              <div className="message-sender">
                {isMyMessage ? '我:' : `${fromUser}:`}
              </div>
            )}
            {renderContent()}
            <div className="message-time">
              {new Date(m.ts).toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 图片预览模态框 */}
      {previewImage && (
        <div 
          className="image-preview-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            cursor: 'pointer'
          }}
          onClick={closePreview}
        >
          <div 
            style={{ 
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90vh',
              cursor: 'default' 
            }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="图片预览"
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                display: 'block',
                borderRadius: '4px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
              onError={(e) => {
                e.target.alt = '预览图片加载失败';
                e.target.style.backgroundColor = '#333';
              }}
            />
            <button
              aria-label="关闭预览"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onClick={closePreview}
              onMouseEnter={e => e.target.style.background = 'rgba(0,0,0,0.7)'}
              onMouseLeave={e => e.target.style.background = 'rgba(0,0,0,0.5)'}
            >
              &times;
            </button>
            <div 
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              点击遮罩区域或按 ESC 键关闭
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MsgItem