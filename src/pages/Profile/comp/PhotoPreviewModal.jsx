// components/PhotoPreviewModal.jsx

import { Modal, Button } from "antd";

export const PhotoPreviewModal = ({
  visible,
  file,
  onClose,
  onRemove,
}) => {
  return (
    <Modal
      open={visible}
      title="图片预览"
      onCancel={onClose}
      footer={[
        <Button
          key="delete"
          danger
          onClick={async () => {
            try {
              await onRemove(file);
              onClose();
            } catch {
              // 用户取消时不处理
            }
          }}
        >
          删除
        </Button>,
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
    >
      <img
        alt="预览"
        style={{ width: "100%", maxHeight: "70vh", objectFit: "contain" }}
        src={file?.url || file?.thumbUrl}
      />
    </Modal>
  );
};