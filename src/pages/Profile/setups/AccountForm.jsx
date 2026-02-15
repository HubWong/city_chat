import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Card, Typography, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useGetAccountQuery } from '../../../services/accountApi';
import { useAccountApi } from './useAccountApi';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
const { Title } = Typography;

const AccountForm = () => {
    const nav=useNavigate()
    const [api, contextHolder] = message.useMessage()
    const { data, isSuccess, isLoading } = useGetAccountQuery()
    const [form] = Form.useForm();
    const { addOrUpdateAccount } = useAccountApi()
    useEffect(() => {

        if (isSuccess) {
            // 注意：确保 data 字段名和表单字段名一致
            form.setFieldsValue({
                chain_type: data.chain_type || '',
                wallet_chain: data.wallet_chain || '',
                wallet_address: data.wallet_address || '',
                accept_contract: data.accept_contract || '',
                currency: data.currency || 'USDC',
            });
        }
    }, [isSuccess, data])
    const onFinish = async (values) => {

        const res = await addOrUpdateAccount(values)
        if (res.success) {
            api.success('已保存.')
        }
        else {
            api.error(res.message)
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
            {contextHolder}
            <Card variant='outlined' style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                 <Button onClick={()=>nav(-1)}>
                          返回
                        </Button>
                <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
                    个人加密货币账户
                </Title>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}

                    requiredMark={false}
                >
                    {/* Chain Type */}
                    <Form.Item
                        name="chain_type"
                        label="Chain Type"
                        rules={[{ required: true, message: '请输入 Chain Type' }]}
                    >
                        <Select placeholder="选择默认链">
                            <Option value="evm">evm</Option>
                            <Option value="tron">tron</Option>
                        </Select>
                    </Form.Item>

                    {/* Wallet Chain */}
                    <Form.Item
                        name="wallet_chain"
                        label="Wallet Chain"
                        rules={[{ required: true, message: '请输入 Wallet Chain' }]}
                    >
                        <Input placeholder="例如: eth, bsc, polygon, tron" />
                    </Form.Item>

                    {/* Wallet Address */}
                    <Form.Item
                        name="wallet_address"
                        label="Wallet Address"
                        rules={[
                            { required: true, message: '请输入个人钱包地址' },
                            {
                                pattern: /^0x[a-fA-F0-9]{40}$/,
                                message: '请输入有效的以太坊地址（0x + 40 位十六进制）'
                            }
                        ]}
                    >
                        <Input placeholder="0x..." />
                    </Form.Item>

                    {/* Accept Contract */}
                    <Form.Item
                        name="accept_contract"
                        label="Accept Contract"
                        rules={[{ required: true, message: '请输入合约地址' }]}
                    >
                        <Input placeholder="0x..." />
                    </Form.Item>

                    {/* Default Currency */}
                    <Form.Item
                        name="currency"
                        label="Default Currency"
                        rules={[{ required: true, message: '请选择默认币种' }]}
                    >
                        <Select placeholder="选择默认币种">
                            <Option value="USDC">USDC</Option>
                            <Option value="USDT">USDT</Option>
                            <Option value="DAI">DAI</Option>
                            <Option value="ETH">ETH</Option>
                            <Option value="SOL">SOL</Option>
                        </Select>
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            block
                            size="large"
                        >
                            保存账户信息
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AccountForm;