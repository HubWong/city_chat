import { useState } from 'react'

import RoomCard from './RoomCard'
import { EmptyState } from './EmptyState'
import { PlusOutlined } from '@ant-design/icons'
import { Spin, Row, Col, FloatButton, Pagination } from 'antd'
import './UserRoomList.css'
import { useGetMyRoomsQuery } from '../../../services/roomApi'
import { useNavigate } from 'react-router-dom'



const UserRoomList = () => {
  const [pg, setPg] = useState(1)
  const { data, isLoading } = useGetMyRoomsQuery(pg)
  const rooms = data?.data
  const nav = useNavigate()

  const onPageChange = async (e) => {
    setPg(e)
  }

  return (
    <div className="room-list-page">
      <h1>我的房间</h1>
      <main className="room-list-container">
        {isLoading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : rooms.length === 0 ? (
          <EmptyState />
        ) : (
          <Row gutter={[24, 24]}>
            {rooms.map((room) => (
              <Col
                xs={24}
                sm={12}
                md={12}
                lg={8}
                xl={8}
                key={room.id}
              >
                <RoomCard room={room} />
              </Col>
            ))}
          </Row>
        )}
        {data?.total > 10 && <div className="pagination-wrapper">
          <Pagination onChange={onPageChange}
            showSizeChanger={false}
            showTotal={(t) => `total: ${t}`}
            current={data.page} pageSize={data.size} total={data?.total} />
        </div>
        }
        {/* 浮动按钮 - 全局新建按钮 */}
        <FloatButton
          icon={<PlusOutlined />}
          type="primary"
          tooltip={<div>新建聊天室</div>}
          onClick={() => nav("/center/user_room/new")}
          className="room-list-fab"
        />
      </main>
    </div>
  )
}

export default UserRoomList