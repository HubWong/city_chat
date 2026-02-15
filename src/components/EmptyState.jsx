
import React from 'react';
import { Empty, Button } from 'antd';
import PropTypes from 'prop-types';

const EmptyState = ({ 
  description = '暂无数据',
  btnText,
  onBtnClick,
  image = Empty.PRESENTED_IMAGE_SIMPLE 
}) => {
  return (
    <div className="empty-state-wrapper">
      <Empty
        image={image}
        description={description}
      >
        {btnText && (
          <Button 
            type="primary" 
            onClick={onBtnClick}
          >
            {btnText}
          </Button>
        )}
      </Empty>
    </div>
  );
};

EmptyState.propTypes = {
  description: PropTypes.string,
  btnText: PropTypes.string,
  onBtnClick: PropTypes.func,
  image: PropTypes.node
};

export default EmptyState;
