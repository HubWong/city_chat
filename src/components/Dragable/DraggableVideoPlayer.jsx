// DraggableVideoPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import './DraggableVideoPlayer.css'; // 引入独立样式文件

const DraggableVideoPlayer = ({ stream, title = "视频", isLocal = false }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const dragRef = useRef(null);
  const toggleHidden = () => {
    setIsHidden(!isHidden);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch(err => {
        console.error('Fullscreen request failed', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    if (videoRef.current) {
      videoRef.current.srcObject = stream; // ✅ 正确方式
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (isHidden) {
    return (
      <button
        onClick={toggleHidden}
        className="video-player-toggle-btn"
      >
        显示视频
      </button>
    );
  }

  return (
    <Draggable
      handle=".drag-handle"
      disabled={isFullscreen}
      bounds="body"
      nodeRef={dragRef}
    >
      <div ref={dragRef} className={`video-player-container ${isFullscreen ? 'fullscreen' : ''} ${isLocal ? 'local' : 'remote'}`}>

        {!isFullscreen && (
          <div className="drag-handle">
            {title}
          </div>
        )}
        <div className="video-wrapper">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal} // 通常本地视频静音避免回声
          />
        </div>
        <div className="video-controls">
          <button onClick={toggleHidden} className="control-btn">隐藏</button>
          <button onClick={toggleFullscreen} className="control-btn">
            {isFullscreen ? '退出全屏' : '全屏'}
          </button>
        </div>
      </div>
    </Draggable>
  );
};

export default DraggableVideoPlayer;