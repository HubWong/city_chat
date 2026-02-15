// ProfileModal.js
import { useState } from 'react';
import { Modal } from 'antd';
import UserProfileForm from '../../Profile/comp/UserProfileForm'; // 你的表单组件（也需为 JS）
import { useAuthApi } from '../../../hooks/useAuthApi';
import { useGetMeQuery } from '../../../services/authApi';

const ProfileModal = ({ title, onOk, open, handleCancel }) => {
  const {data,isSuccess}=useGetMeQuery()
  const initialData = data?.data
  const { updateMyCv } = useAuthApi()
  const [confirmLoading, setConfirmLoading] = useState(false);

  const modalTitle = title || (initialData ? '编辑资料' : '新增用户');

  const handleSubmit = async (formData) => {
    setConfirmLoading(true);
    try {

      const resp = await updateMyCv(formData)
       
      if (resp.success) {
        onOk(formData);        
      }


    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>

      <Modal
        title={modalTitle}
        open={open}
        onCancel={handleCancel}
        footer={null} // 表单内部有自己的提交按钮
        width={800}
        centered
        destroyOnHidden // 关闭时销毁内容，避免状态残留
      >
        <UserProfileForm
          initialData={initialData}
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
};

export default ProfileModal;