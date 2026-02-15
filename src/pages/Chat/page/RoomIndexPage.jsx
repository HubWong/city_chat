import { useState, useRef, useEffect } from 'react'
import { Pagination } from 'antd'
import ChatRoomCard from '../comps/userRoom/ChatRoomCard'
import { useRoomApi } from '@/hooks/useRoomApi'
import { Link } from 'react-router-dom'
import { useIpInfos } from '../../../hooks/useIpInfos'
import './RoomIndexPage.css'

function RoomIndexPage() {

  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const { rooms, total, pagination, onPageChange, searchRoom } = useRoomApi()
  const { ipInfo } = useIpInfos()

  const searchContainerRef = useRef(null)
  const inputRef = useRef(null)


  // 执行搜索
  const executeSearch = (query, page, pageSize) => {
    const params = {
      query: query.trim() || null,
      city: ipInfo?.city || null,
      isPublic: true,
      current: page,
      pageSize: pageSize
    }


    searchRoom(params)
  }

  // 按钮搜索
  const handleSearchSubmit = () => {
    const newPage = 1
    const newPageSize = pagination.pageSize
    onPageChange(newPage, newPageSize)
    executeSearch(searchQuery, newPage, newPageSize)
  }

  // 清空搜索
  const handleClearSearch = () => {
    setSearchQuery('')
    const newPage = 1
    const newPageSize = pagination.pageSize

    // 重置到第 1 页
    onPageChange(newPage, newPageSize)

    // 执行搜索（清空搜索条件）
    executeSearch('', newPage, newPageSize)

    inputRef.current?.focus()
  }

  // 按下回车键触发搜索
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  // ========== 分页逻辑 ==========

  // 分页变化处理
  const handlePageChange = (page, pageSize) => {

    // 更新分页状态
    onPageChange(page, pageSize)

    // 执行搜索
    executeSearch(searchQuery, page, pageSize)
  }

  // ========== UI 交互 ==========

  const handleSearchFocus = () => {
    setIsSearching(true)
  }

  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsSearching(false)
    }, 200)
  }

  // ESC 键清空搜索
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClearSearch()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchQuery, pagination.current])

  // 点击外部关闭搜索面板
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearching(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ========== 初始加载 ==========

  useEffect(() => {
    executeSearch('', 1, pagination.pageSize)
  }, [])

  // ========== 过滤逻辑 ==========

  // 前端过滤（如果后端已经按搜索条件返回，这里可以简化）
  const filteredRooms = searchQuery
    ? rooms.filter(room =>
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.memo && room.memo.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : rooms

  // ========== 渲染 ==========

  return (
    <div className="index-page">
      <div className="app-container">
        <div className="page-header">
          <h1 className="page-title">💬 聊天室列表</h1>

          {/* 搜索框 */}
          <div
            ref={searchContainerRef}
            className={`search-container ${isSearching ? 'active' : ''}`}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          >
            <div className="search-wrapper">
              <div className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="🔍 搜索聊天室..."
                className="search-input"
                aria-label="搜索聊天室"
              />

              {/* 搜索按钮 */}
              <button
                className="search-btn"
                onClick={handleSearchSubmit}
                aria-label="搜索"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={handleClearSearch}
                  aria-label="清空搜索"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>

            {/* 搜索结果统计 */}
            {isSearching && searchQuery && (
              <div className="search-results-count">
                找到 {filteredRooms.length} 个结果
              </div>
            )}
          </div>
        </div>

        {/* 聊天室列表 */}
        {filteredRooms.length > 0 ? (
          <div>
            <div className="rooms-grid">
              {filteredRooms.map(room => (
                <ChatRoomCard key={room.id} room={room} />
              ))}
            </div>

            {/* 分页 */}
            <div className="pagination-wrapper">
              <Pagination
                current={pagination?.current || 1}
                total={total || 0}
                pageSize={pagination?.pageSize || 10}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `共 ${total} 个聊天室`}
              />
            </div>
          </div>
        ) : (
          <div className="empty-state">
            {searchQuery ? (
              <>
                <div className="empty-icon">🔍</div>
                <h3>没有找到匹配的聊天室</h3>
                <p>请尝试使用其他关键词进行搜索</p>
                <button className="reset-search-btn" onClick={handleClearSearch}>
                  清空搜索
                </button>
              </>
            ) : (
              <>
                <div className="empty-icon">💬</div>
                <h3>暂无聊天室</h3>
                <p><Link style={{color:'#2a2a2a'}} to={`/center/user_room/new`}>创建</Link>
                  或加入聊天室开始交流吧！</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RoomIndexPage