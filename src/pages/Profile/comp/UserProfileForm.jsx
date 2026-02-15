// UserProfileForm.tsx
import { useState, useEffect } from 'react';
import './UserProfileForm.css';
import EditAvatar from './EditAvatar';
import { years } from '@/shared/config';

const UserProfileForm = ({ initialData, onSubmit }) => {
    
    const [formData, setFormData] = useState({
        username: '',
        bio: null,
        birth_year: null,
        gender: 0,
        marital_status: 0,
        living_city: '',
        dowry: null,
        on_show: false,
        is_active: true       
    });    

    // 初始化数据
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' && value !== '' ? Number(value) : val === '' ? null : val,
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        
        const finalData = {
            ...formData
        };
 
        if (finalData.marital_status === null) {
            finalData.marital_status = 0
        }
        
        // 将文件和表单数据一起提交
        onSubmit(finalData);
    };


    return (
        <div className="user-profile-form">
            
            <EditAvatar />
            <form onSubmit={handleSubmit} >
                <h2>个人资料</h2>
                {/* 表单其他字段（保持不变） */}
                <div className="form-columns">
                    <div className="form-column">
                        <div className="form-group">
                            <label>用户名 *</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>居住城市</label>
                            <input
                                type="text"
                                name="living_city"
                                required
                                value={formData.living_city}
                                onChange={handleChange}
                                placeholder="例如：Nuremberg"
                            />
                        </div>

                        <div className="form-group">
                            <label>性别</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="1">男</option>
                                <option value="0">女</option>
                                <option value="2">其他</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>出生年份</label>
                            <select
                                name="birth_year"
                                value={formData.birth_year || ''}
                                onChange={handleChange}
                                required
                            >
                                <option value="">请选择</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-column">
                        <div className="form-group">
                            <label>婚姻状况</label>
                            <select
                                name="marital_status"
                                value={formData.marital_status || '0'}
                                onChange={handleChange}
                            >
                                <option value="0">未婚</option>
                                <option value="1">已婚</option>
                                <option value="2">离异</option>
                                <option value="3">丧偶</option>
                                <option value="4">保密</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>彩礼（可选）</label>
                            <input
                                type="text"
                                name="dowry"
                                value={formData.dowry || ''}
                                onChange={handleChange}
                                placeholder="例如：188000"
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>个人简介</label>
                            <textarea
                                name="bio"
                                value={formData.bio || ''}
                                onChange={handleChange}
                                placeholder="介绍一下自己..."
                                rows={4}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="on_show"
                            checked={formData.on_show}
                            onChange={handleChange}
                        />
                        <span>立即展示</span>
                    </label>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                        />
                        <span>账号已激活</span>
                    </label>
                </div>

                <button type="submit" className="submit-btn">保 存</button>
            </form>
        </div>

    );
};

export default UserProfileForm;