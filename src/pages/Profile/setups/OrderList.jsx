import React from 'react'
import { Button } from 'antd'
import { Navigate, useNavigate } from 'react-router-dom'
const OrderList = () => {
  const nav = useNavigate()
  return (
    <div>
      <div className="header">售卖历史</div>
      <div className="withdraw">
        <Button onClick={()=>nav(-1)}>
          返回
        </Button>
        <Button type='primary'>提现</Button></div>
      <div className="order-list">
        my OrderList details
      </div>
    </div>
  )
}

export default OrderList
