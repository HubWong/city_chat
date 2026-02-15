import React from 'react'
import SlotModal from '../../../components/SlotModal'
import { useMsgApi } from '../../Msg/useMsgApi'
import { Form, Input, Button, message } from 'antd'
import { ChatSystem } from '@/shared/model/chatSystem'

const { TextArea } = Input

const MsgForm = ({ onSuccess }) => {
    const [form] = Form.useForm()
    const { leaveMsgToUser } = useMsgApi()
    const [api, contextHolder] = message.useMessage()
    const handleFinish = async (values) => {
        try {
            const receiver = ChatSystem.getActiveChatUser()
             
            if (!receiver) {
                api.error('未选择接收用户')
                return
            }

            const res = await leaveMsgToUser({
                content: values.content,
                message_type: 'NEW_MESSAGE', // 普通文本
                receiver_id: receiver.id,
            })
           
            if (res) {
                api.success('留言成功')
            } else {
                api.error(res.msg)
            }

            form.resetFields()
            onSuccess?.()
        } catch (err) {
            api.error(err)
            api.error('留言失败')
        }
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
        >
            {contextHolder}
            <Form.Item
                name="content"
                label="留言内容"
                rules={[
                    { required: true, message: '请输入留言内容' },
                    { max: 500, message: '最多 500 字' },
                ]}
            >
                <TextArea
                    rows={4}
                    placeholder="写点什么吧…"
                    showCount
                    maxLength={500}
                />
            </Form.Item>

            <Form.Item style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">
                    发送留言
                </Button>
            </Form.Item>
        </Form>
    )
}

const LeaveMsgModal = ({ show, onHide }) => {
    return (
        <SlotModal
            title="留言给 Ta"
            open={show}
            onCancel={onHide}
            footer={null}
        >
            <MsgForm onSuccess={onHide} />
        </SlotModal>
    )
}

export default LeaveMsgModal
