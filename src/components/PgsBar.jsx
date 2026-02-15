// src/components/PgsBar.jsx
import React from 'react';
import { Pagination as AntdPagination } from 'antd';

/**
 * 分页条组件（封装 Ant Design Pagination）
 * @param {number} props.current - 当前页（1-based）
 * @param {number} props.total - 总记录数（非总页数！）
 * @param {number} props.pageSize - 每页条数
 * @param {function} props.onChange - (page: number) => void
 */
const PgsBar = ({ current, total, pageSize, onChange }) => {
  return (
    <div className="flex justify-center">
      <AntdPagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
        showQuickJumper
        showTotal={(total, range) => (
          <span className="text-gray-500">
            显示 {range[0]}–{range[1]} 项，共 {total} 项
          </span>
        )}
      />
    </div>
  );
};

export default PgsBar;