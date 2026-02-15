import React, { useEffect } from 'react'
import { useReduxAuth } from '../hooks/useReduxAuth'
import { Spin } from 'antd'
import useMessage from 'antd/es/message/useMessage'
const AppLoading = () => {
    const { isLoading, showLoading } = useReduxAuth()
    const [api,contextHolder]=useMessage()
    useEffect(() => {
        let timeoutId

        if (isLoading) {          
            timeoutId = setTimeout(() => {
                showLoading(false); // 关闭 loading
                api.info('连接超时')
            }, 10000);
        }

        // 清理函数：组件卸载或 isLoading 变为 false 时清除定时器
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isLoading, showLoading]);

    if (!isLoading) return null;

    return (
        <div

            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                zIndex: 9999,
            }}
        >
            {contextHolder}
            <Spin size="large" tip="加载中..." />
        </div>
    );
}

export default AppLoading
