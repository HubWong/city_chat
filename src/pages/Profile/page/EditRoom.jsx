import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useMessage from 'antd/es/message/useMessage'
import { ArrowLeftOutlined, MessageOutlined, SafetyCertificateOutlined, SaveOutlined, DeleteOutlined, UnlockOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, message, Space, Tooltip, Spin } from 'antd'
import { useRoomApi } from '../../../hooks/useRoomApi'
import { useGetRoomQuery } from '../../../services/roomApi'
import './EditRoom.css'

const EditRoom = () => {
  const { roomId } = useParams()
  const { data, isLoading, isError, error } = useGetRoomQuery({ id: roomId, forUpdate: 1 }, { skip: roomId === 'new' })

  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(roomId !== 'new')
  const [saving, setSaving] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [hasPassword, setHasPassword] = useState(false)
  const { createOrUpdateRoom } = useRoomApi()
  const [api, contextHolder] = useMessage()

  useEffect(() => {
    if (roomId !== 'new') {
      if (isError) {
        api.error(error)
        return
      }
      // 模拟获取聊天室数据
      const mockRoom = data?.data

      setTimeout(() => {
        form.setFieldsValue({
          ...mockRoom,
          room_pwd: mockRoom.room_pwd || ''
        })
        setHasPassword(!!mockRoom.room_pwd && mockRoom.room_pwd.trim() !== '')
        setLoading(false)
      }, 300)
    } else {
      setLoading(false)
    }
  }, [roomId, form, isLoading, isError])



  const handleSubmit = async () => {
    const values = await form.validateFields()
     
    setSaving(true)
    const res = await createOrUpdateRoom({ ...values })
    if (res.success) {
      api.success('new room 已建立')
    } else {
      api.error(res.message)
    }

    message.success(roomId === 'new' ? '创建成功' : '保存成功')
    setSaving(false)
    navigate(-1)
  }

  const handleDelete = async () => {
    if (!window.confirm('确定要删除这个聊天室吗？')) return

    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    message.success('删除成功')
    setSaving(false)
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="edit-room-loading">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="edit-room-page">

      {contextHolder}
      <main className="edit-room-container">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="back-button"
        >
          返回
        </Button>

        <div className="edit-room-card">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              label="聊天室名称"
              name="title"
              rules={[
                { required: true, message: '请输入聊天室名称' },
                { max: 50, message: '名称不能超过50个字符' }
              ]}
            >
              <Input
                autoComplete='on'
                placeholder="请输入聊天室名称"
                size="large"
                prefix={<MessageOutlined />}
                showCount
                maxLength={50}
              />
            </Form.Item>

            <Form.Item
              label="简介"
              name="memo"
              rules={[{ max: 200, message: '简介不能超过200个字符' }]}
            >
              <Input.TextArea
                placeholder="请输入聊天室简介"
                rows={4}
                showCount
                maxLength={200}
              />
            </Form.Item>

            <Form.Item
              label={
                <div className="password-label">
                  进入密码
                  <Tooltip title="设置密码后，用户需要输入密码才能进入聊天室">
                    <Button
                      type="link"
                      size="small"
                      icon={<SafetyCertificateOutlined />}
                      className="password-tooltip"
                    />
                  </Tooltip>
                </div>
              }
              name="room_pwd"
              extra={hasPassword ? '留空则移除密码' : '可选，设置后用户需要密码才能进入'}
            >
              <Input.Password
                placeholder={hasPassword ? '输入密码' : '可选，设置密码保护'}
                size="large"
                autoComplete="current-password"
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible
                }}
                prefix={hasPassword ? <SafetyCertificateOutlined /> : <UnlockOutlined />}
                onChange={(e) => {
                  const value = e.target.value
                  if (value && !hasPassword) {
                    setHasPassword(true)
                  } else if (!value && hasPassword) {
                    // 保留状态，让用户明确选择是否移除
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              label="成员数量"
              name="max_man"
              rules={[{ type: 'number', min: 0, message: '请输入有效的数量' }]}
            >
              <InputNumber
                placeholder="请输入成员数量"
                min={0}
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Space size="middle" className="edit-room-actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  size="large"
                  loading={saving}
                  disabled={saving}
                >
                  {saving ? '保存中...' : '保存'}
                </Button>

                {roomId !== 'new' && (
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="large"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    删除
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Form>
        </div>
      </main>
    </div>
  )
}

export default EditRoom