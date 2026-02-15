import React from 'react'
import DraggableVideoPlayer from './DraggableVideoPlayer';

const DualVideoView = ({ localStream, remoteStream }) => {
  // 将 MediaStream 转为 object URL（用于 <video> src）
 

  return (
    <>
        <DraggableVideoPlayer
        stream={localStream}  // 👈 传 stream，不是 URL
        title="我"
        isLocal={true}
      />
      <DraggableVideoPlayer
        stream={remoteStream}
        title="对方"
        isLocal={false}
      />
    </>
  );
};

export default DualVideoView;
