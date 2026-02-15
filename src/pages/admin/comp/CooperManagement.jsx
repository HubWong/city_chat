// src/pages/cooper/CooperManagement.jsx
import React, { useMemo, useState } from 'react';
import { List, Card, Tag, Space, Typography, Button, message, Alert } from 'antd';
import {
  PhoneOutlined,
  WechatOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { formatDateTime } from '@/shared/config';
import useCooperApi from '@/pages/Profile/hook/useCooperApi'
import { useGetCoopersQuery } from '../../../services/cooperApi';
import PgsBar from '../../../components/PgsBar';

const { Text, Paragraph } = Typography;


const CooperCards = React.memo(({ items, pendingValidated, onValidateToggle }) => {
  if (!items?.length) return null;

  return (
    <List
      dataSource={items}
      grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3 }}
      renderItem={(cooper) => {
        // 🔑 关键：动态计算当前应显示的审核状态
        const displayValidated = pendingValidated[cooper.id] !== undefined
          ? pendingValidated[cooper.id]
          : !!cooper.validated;

        return (
          <List.Item key={cooper.id}>
            <Card
              size="small"
              className="shadow-sm hover:shadow-md transition-shadow"
              styles={{ body: { padding: '16px' } }}
            >

              {/* 合作方名称（主标题） */}
              <div className="font-bold text-lg text-gray-800 mb-2">
                {cooper.cooper_name || '未命名合作方'}
              </div>

              <Space size="small" wrap>
                <Tag color={cooper.validated ? 'success' : 'warning'} icon={cooper.validated ? <CheckCircleOutlined /> : null}>
                  {cooper.validated ? '已审核' : '待审核'}
                </Tag>
                {cooper.user_id && (
                  <Tag icon={<UserOutlined />} color="blue">
                    用户ID: {cooper.user_id}
                  </Tag>
                )}
              </Space>

              <div className="mt-3 space-y-2 text-sm">
                {/* 联系人 */}
                {cooper.contact_person && (
                  <div>
                    <Text type="secondary">联系人：</Text>
                    <Text>{cooper.contact_person}</Text>
                  </div>
                )}

                {/* 电话（可点击） */}
                <div>
                  <PhoneOutlined className="mr-1 text-gray-500" />
                  <a href={`tel:${cooper.tel}`} className="text-blue-600 hover:underline">
                    {cooper.tel}
                  </a>
                </div>

                {/* 微信 */}
                {cooper.wchat && (
                  <div>
                    <WechatOutlined className="mr-1 text-gray-500" />
                    <Text copyable>{cooper.wchat}</Text>
                  </div>
                )}

                {/* 地址 */}
                {cooper.address && (
                  <div>
                    <EnvironmentOutlined className="mr-1 text-gray-500" />
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{ margin: 0, display: 'inline' }}
                      className="text-gray-700"
                    >
                      {cooper.address}
                    </Paragraph>
                  </div>
                )}
              </div>

              {/* 底部：时间信息 */}
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center">
                  <ClockCircleOutlined className="mr-1" />
                  <span>创建于：{formatDateTime(cooper.created_at)}</span>
                </div>
                <div className="flex items-center mt-1">
                  <ClockCircleOutlined className="mr-1" />
                  <span>更新于：{formatDateTime(cooper.updated_at)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={displayValidated} // ← 使用 displayValidated
                    onChange={(e) => onValidateToggle(cooper.id, e.target.checked)}
                    disabled={pendingValidated[cooper.id] !== undefined}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {displayValidated ? '✅ 已审核' : '⏳ 待审核'} {/* ← 这里用 displayValidated */}
                  </span>
                </label>
                <Button type="link" size="small" danger>
                  删除
                </Button>
              </div>
            </Card>
          </List.Item>
        );
      }}
    />
  );
});

// —————— 主组件 ——————
const CooperManagement = () => {
  const [api, contextHolder] = message.useMessage();
  const [pg, setPg] = useState(1); // ✅ 页码完全由 state 管理
  const { toggleValid } = useCooperApi();

  // 局部 pending 状态（用于乐观 UI）
  const [pendingValidated, setPendingValidated] = useState({});

  const limit = 10;
  const { data, isLoading, isError, error, isFetching } = useGetCoopersQuery({ pg, limit });

  // ✅ 修复：应为 data?.items / data?.total（除非后端包了 data）
  const items = data?.data || [];
  const total = data?.total || 0;
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  // ✅ 翻页函数：只 setPg
  const handlePageChange = (page) => {
    setPg(page);
  };

  // 审核切换
  const toggleValidate = async (id, validated) => {
    setPendingValidated((prev) => ({ ...prev, [id]: validated }));
    try {
      await toggleValid({ id, valid: validated ? 1 : 0 });
      setPendingValidated((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      api.success('审核状态更新成功');
    } catch (err) {
      setPendingValidated((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      api.error(`操作失败：${err?.data?.detail || '请重试'}`);
    }
  };

  // 渲染
  if (isError) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">合作方管理</h2>
        <Alert
          message="加载失败"
          description={error?.message || '请稍后重试'}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={() => window.location.reload()}>
              刷新
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {contextHolder}
      <h2 className="text-2xl font-bold">合作方管理</h2>

      {/* 列表区域 */}
      {isLoading && !isFetching ? (
        <p className="text-center py-8 text-gray-500">正在加载...</p>
      ) : items.length === 0 ? (
        <p className="text-center py-8 text-gray-500">暂无合作方数据</p>
      ) : (
        <CooperCards
          items={items}
          pendingValidated={pendingValidated}
          onValidateToggle={toggleValidate}
        />
      )}

      {isFetching && !isLoading && (
        <p className="text-center text-blue-500">正在加载下一页...</p>
      )}

      {/* ✅ 分页条 —— 仅当有数据且多页时显示 */}
      {total > 0 && totalPages > 1 && (
        <PgsBar
          current={pg}
          total={total}      // ⚠️ Ant Design 的 `total` 是总记录数（不是总页数！）
          pageSize={limit}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CooperManagement;