import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  Row,
  Col,
  Button,
  Radio,
  Space,
  Typography,
  Divider,
  Modal,
  Form,
  Input,
  Select,
  message,
  Badge,
  Alert
} from 'antd';
import {
  CreditCardOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  WalletOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import {
  selectSubscriptionPlans,
  selectCurrentSubscription,
  selectPaymentMethods,
  selectIsProcessingPayment,
  selectPaymentError,
  selectIsSubscriptionActive

} from '../../store/slices/paymentSlice';
import { usePaymentApi } from './usePaymentApi';
import styles from './Payment.module.css';

const { Title, Text, Paragraph } = Typography;

export default function Payment() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [form] = Form.useForm();

  const subscriptionPlans = useSelector(selectSubscriptionPlans);
  const currentSubscription = useSelector(selectCurrentSubscription);
  const paymentMethods = useSelector(selectPaymentMethods);
  const isProcessing = useSelector(selectIsProcessingPayment);
  const paymentError = useSelector(selectPaymentError);
  const isSubscriptionActive = useSelector(selectIsSubscriptionActive);

  // 支付API hooks
  const { processPayment } = usePaymentApi()

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleProceedToPayment = () => {
    if (!selectedPlan || !selectedPaymentMethod) {
      message.warning('请选择订阅计划和支付方式');
      return;
    }
    setPaymentModalVisible(true);
  };

  const handlePaymentSubmit = async (values) => {
    try {
      const result = await processPayment({
        selectedPlan,
        selectedPaymentMethod,
        paymentDetails: values,
        returnUrl: window.location.origin + '/payment/success',
        cancelUrl: window.location.origin + '/payment/cancel',
      });

      if (result.type === 'redirect') {
        window.location.href = result.url;
      } else if (result.type === 'success') {
        message.success('支付成功！订阅已激活');
        setPaymentModalVisible(false);
        form.resetFields();
        setSelectedPlan(null);
        setSelectedPaymentMethod(null);
      } else if (result.type === 'pending') {
        message.info('请完成支付流程');
        setPaymentModalVisible(false);
      }
    } catch (error) {
      // 错误已在 hook 中 dispatch 到 Redux，但 message 需在此显示
      message.error(error.message || '支付失败，请重试');
    }
  };



  const getPaymentMethodIcon = (methodId) => {
    const iconMap = {
      // 中国支付方式
      alipay: '🅰️',
      wechat: '💬',
      unionpay: '🏦',
      qq_pay: '🐧',
      jd_pay: '🛒',

      // 国际支付方式
      visa: '💳',
      mastercard: '💳',
      paypal: '🅿️',
      stripe: '💰',
      apple_pay: '🍎',
      google_pay: '🔍',
      amazon_pay: '📦',

      // 欧洲支付方式
      ideal: '🇳🇱',
      sofort: '🇩🇪',
      giropay: '🏛️',
      bancontact: '🇧🇪'
    };
    return iconMap[methodId] || '💳';
  };

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.header}>
        <Title level={2}>
          <WalletOutlined /> 订阅服务
        </Title>
        <Paragraph>
          选择适合您的订阅计划，享受跨国消息发送服务
        </Paragraph>
      </div>

      {isSubscriptionActive && (
        <Alert
          message="当前订阅状态"
          description={`您的${currentSubscription?.planName}订阅正在生效中，到期时间：${new Date(currentSubscription?.expiresAt).toLocaleDateString()}`}
          type="success"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card title="选择订阅计划" className={styles.planSection}>
            <Row gutter={[16, 16]}>
              {subscriptionPlans.map((plan) => (
                <Col span={8} key={plan.id}>
                  <Card
                    hoverable
                    className={`${styles.planCard} ${selectedPlan?.id === plan.id ? styles.selected : ''}`}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    <div className={styles.planHeader}>
                      <Title level={4}>{plan.name}</Title>
                      {plan.id === 'yearly' && (
                        <Badge.Ribbon text="最优惠" color="red">
                          <div />
                        </Badge.Ribbon>
                      )}
                    </div>
                    <div className={styles.planPrice}>
                      <Text className={styles.price}>${plan.price}</Text>
                      <Text type="secondary">/{plan.duration}</Text>
                    </div>
                    <Divider />
                    <div className={styles.planFeatures}>
                      {plan.features.map((feature, index) => (
                        <div key={index} className={styles.feature}>
                          <CheckCircleOutlined className={styles.checkIcon} />
                          <Text>{feature}</Text>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          <Card title="选择支付方式" className={styles.paymentMethodSection}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Title level={5}>
                  <GlobalOutlined /> 中国支付方式
                </Title>
                <Radio.Group
                  value={selectedPaymentMethod}
                  onChange={(e) => handlePaymentMethodSelect(e.target.value)}
                  className={styles.paymentMethods}
                >
                  {paymentMethods
                    .filter(method => method.region === 'CN')
                    .map(method => (
                      <Radio.Button key={method.id} value={method.id} className={styles.paymentMethod}>
                        <span className={styles.methodIcon}>{getPaymentMethodIcon(method.id)}</span>
                        {method.name}
                      </Radio.Button>
                    ))}
                </Radio.Group>
              </Col>
              <Col span={12}>
                <Title level={5}>
                  <GlobalOutlined /> 国际支付方式
                </Title>
                <Radio.Group
                  value={selectedPaymentMethod}
                  onChange={(e) => handlePaymentMethodSelect(e.target.value)}
                  className={styles.paymentMethods}
                >
                  {paymentMethods
                    .filter(method => method.region === 'GLOBAL')
                    .map(method => (
                      <Radio.Button key={method.id} value={method.id} className={styles.paymentMethod}>
                        <span className={styles.methodIcon}>{getPaymentMethodIcon(method.id)}</span>
                        {method.name}
                      </Radio.Button>
                    ))}
                </Radio.Group>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="订单摘要" className={styles.orderSummary}>
            {selectedPlan ? (
              <>
                <div className={styles.summaryItem}>
                  <Text>购买服务：</Text>
                  <Text strong>{selectedPlan.name}</Text>
                </div>
                <div className={styles.summaryItem}>
                  <Text>价格：</Text>
                  <Text strong>${selectedPlan.price}</Text>
                </div>
                <div className={styles.summaryItem}>
                  <Text>时长：</Text>
                  <Text>{selectedPlan.duration}</Text>
                </div>
                {selectedPaymentMethod && (
                  <div className={styles.summaryItem}>
                    <Text>支付方式：</Text>
                    <Text strong>
                      {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                    </Text>
                  </div>
                )}
                <Divider />
                <div className={styles.total}>
                  <Text strong>总计：${selectedPlan.price}</Text>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleProceedToPayment}
                  disabled={!selectedPaymentMethod}
                  className={styles.payButton}
                >
                  <CreditCardOutlined /> 立即支付
                </Button>
              </>
            ) : (
              <Text type="secondary">请选择订阅计划</Text>
            )}
          </Card>

          <Card title="安全保障" className={styles.securityInfo}>
            <Space direction="vertical">
              <div className={styles.securityItem}>
                <SafetyOutlined className={styles.securityIcon} />
                <Text>256位SSL加密</Text>
              </div>
              <div className={styles.securityItem}>
                <SafetyOutlined className={styles.securityIcon} />
                <Text>PCI DSS认证</Text>
              </div>
              <div className={styles.securityItem}>
                <SafetyOutlined className={styles.securityIcon} />
                <Text>7天无理由退款</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        title="确认支付"
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={null}
        width={500}
      >
        <Alert
          message={`您将支付 $${selectedPlan?.price} 购买 ${selectedPlan?.name}`}
          type="info"
          style={{ marginBottom: 16 }}
        />
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePaymentSubmit}
        >


          {paymentError && (
            <Alert
              message={paymentError}
              type="error"
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.Item
            label="持卡人姓名"
            name="cardholderName"
            rules={[{ required: true, message: '请输入持卡人姓名' }]}
          >
            <Input placeholder="请输入持卡人姓名" />
          </Form.Item>

          <Form.Item
            label="卡号"
            name="cardNumber"
            rules={[{ required: true, message: '请输入卡号' }]}
          >
            <Input placeholder="**** **** **** ****" maxLength={19} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="有效期"
                name="expiryDate"
                rules={[{ required: true, message: '请选择有效期' }]}
              >
                <Input placeholder="MM/YY" maxLength={5} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="CVV"
                name="cvv"
                rules={[{ required: true, message: '请输入CVV' }]}
              >
                <Input placeholder="***" maxLength={3} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="autoRenew" valuePropName="checked">
            <Radio>自动续费</Radio>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => setPaymentModalVisible(false)}>
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isProcessing}
              >
                确认支付
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}