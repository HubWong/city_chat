import { useState, useEffect } from 'react' // ✅ 新增必要导入
import { formatTimestamp, formatRelativeTime } from '@/shared/config/index'
import './MessageBubble.css'
import { useWebCxt } from '@/services/WebCxt'
import { getDicebearAvt } from '@/components/UserAvatar'
import { getPcId } from '../../../../services/toolFuncs'

const MessageBubble = ({ message }) => {
  const { user: currentUser } = useWebCxt()
  const [previewImage, setPreviewImage] = useState(null);
  const isCurrentUser = message?.from_pc_id === getPcId()
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

  // ✅ 状态管理头像URL
  const [avatarUrl, setAvatarUrl] = useState('')
  const { content, rmt } = message.data;

  const renderContent = () => {
    switch (rmt) {
      case 'message':
        return <div className="message-text">{content}</div>;
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
        return <div className="message-text">{content}</div>;
      default:
        return null;
    }
  };
  // ✅ 异步获取头像（含防卸载、空值校验、错误处理）
  useEffect(() => {
    let isMounted = true
    const fetchAvatar = async () => {
      // 仅非当前用户且存在用户名时才请求
      if (isCurrentUser || !message?.from_user) {
        setAvatarUrl('')
        return
      }

      try {
        const url = await getDicebearAvt(message.from_user)
        if (isMounted) setAvatarUrl(url || '') // 防止空值
      } catch (error) {
        console.error('Failed to load avatar:', error)
        if (isMounted) setAvatarUrl('') // 可选：设置默认占位图路径
      }
    }

    fetchAvatar()
    return () => { isMounted = false } // 清理防内存泄漏
  }, [message?.from_user, isCurrentUser]) // 依赖精准

  // ✅ 安全格式化时间（防 message.ts 为空）
  const timestamp = message?.ts ? formatTimestamp(message.ts) : ''
  const relativeTime = message?.ts ? formatRelativeTime(message.ts) : ''

  return (
    <div className={`message-bubble ${isCurrentUser ? 'current-user' : ''}`}>
      {!isCurrentUser && message?.from_user && ( // ✅ 增加存在性校验
        <div className="message-avatar">
          <img
            src={avatarUrl}
            alt={`${message.from_user}'s avatar`} // ✅ 修复可访问性
            onError={(e) => { e.target.src = '/default-avatar.png' }} // ✅ 可选：加载失败兜底
          />
        </div>
      )}

      <div className="message-content-wrapper">
        {!isCurrentUser && message?.from_user && (
          <div className="message-sender-name">{message.from_user.split('@')[0]}</div>
        )}

        <div className="message-bubble-content">
          {/* <div className="message-text">
            {message?.data?.content || '无法获取内容'}
          </div> */}
          {renderContent()}

          <div className="message-meta">
            <span className="message-time" title={timestamp}>
              {relativeTime || '—'}
            </span>
            {isCurrentUser && message?.status && (
              <span className="message-status">
                {message.status === 'sent' && '✓'}
                {message.status === 'delivered' && '✓✓'}
                {message.status === 'read' && (
                  <span className="read-status">✓✓</span>
                )}
              </span>
            )}
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
    </div>
  )
}

export default MessageBubble