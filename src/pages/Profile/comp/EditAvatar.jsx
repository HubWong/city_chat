import React, { useRef, useEffect, useState } from 'react'
import { useAuthApi } from '../../../hooks/useAuthApi';
import { message } from 'antd';
import './EditAvatar.css'
import { useLoadMyAvatarQuery } from '../../../services/authApi';


const EditAvatar = () => {
    const { data, isLoading, isSuccess } = useLoadMyAvatarQuery()
    const [api, contextHolder] = message.useMessage()
    const fileInputRef = useRef(null);
    const [ap, setAvatarPreview] = useState(null);
    const { updateAvatar } = useAuthApi()
    const [avatarFile, setAvatarFile] = useState(null); // 保留原始文件
    useEffect(() => {
        if (isSuccess) {
            setAvatarPreview(data?.data)

        }
    }, [isLoading, data?.data?.avatar])

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            if (!file.type.match('image.*')) {
                api.warning('请选择图片文件');
                return;
            }

            // 验证文件大小 (最大2MB)
            if (file.size > 2 * 1024 * 1024) {
                api.error('图片大小不能超过2MB');
                return;
            }
            setAvatarFile(file); // 保留 File（可选）

            const reader = new FileReader();
            reader.onload = async () => {
                const base64String = reader.result; // "data:image/jpeg;base64,/9j/4AAQ..."
                setAvatarPreview(base64String); // 用于预览
                // 存入 formData（或单独状态）
                const res = await updateAvatar({ avatar_url: base64String })

                if (res.success) {
                    api.success('头像已更新.')
                } else {
                    api.error(res.message)
                }
                //setFormData(prev => ({ ...prev, avatar: base64String }));
            };
            reader.readAsDataURL(file);
        } else {
            // 清除头像
            setAvatarPreview(avatarPreview || null);
            setFormData(prev => ({ ...prev, avatar: initialData?.avatar || null }));
        }
    };
    return (
        <div className="form-group avatar-section">
            {contextHolder}
            <div className="avatar-container" onClick={handleAvatarClick}>
                {ap ? (
                    <img src={ap} alt="头像" className="avatar-img" />
                ) : (
                    <div className="avatar-placeholder">+</div>
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <p className="hint">点击头像更换</p>
        </div>
    )
}

export default EditAvatar
