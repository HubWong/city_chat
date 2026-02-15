import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

import {
    setCurrentSubscription,
    setPaymentProcessing,
    setPaymentError,
} from '../../store/slices/paymentSlice';

import {
    useCreateAlipayPaymentMutation,
    useCreateWechatPaymentMutation,
    useCreateUnionPayPaymentMutation,
    useCreatePayPalPaymentMutation,
    useCreateStripePaymentMutation,
    useCreateCreditCardPaymentMutation,
    useValidatePaymentAmountMutation
} from '../../services/paymentApi';
import { useWebCxt } from '../../services/WebCxt';


export const usePaymentApi = () => {
    const dispatch = useDispatch();
    const {user:currentUser} = useWebCxt();
    

    // RTK Query mutations
    const [validatePaymentAmount] = useValidatePaymentAmountMutation();
    const [createAlipayPayment] = useCreateAlipayPaymentMutation();
    const [createWechatPayment] = useCreateWechatPaymentMutation();
    const [createUnionPayPayment] = useCreateUnionPayPaymentMutation();
    const [createPayPalPayment] = useCreatePayPalPaymentMutation();
    const [createStripePayment] = useCreateStripePaymentMutation();
    const [createCreditCardPayment] = useCreateCreditCardPaymentMutation();

    const getExpirationDate = useCallback((planId) => {
        const now = new Date();
        switch (planId) {
            case 'monthly':
                return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
            case 'halfyear':
                return new Date(now.setMonth(now.getMonth() + 6)).toISOString();
            case 'yearly':
                return new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();
            default:
                return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
        }
    }, []);

    const processPayment = useCallback(
        async ({
            selectedPlan,
            selectedPaymentMethod,
            paymentDetails,
            returnUrl,
            cancelUrl,
        }) => {
            dispatch(setPaymentProcessing(true));
            dispatch(setPaymentError(null));

            try {
                // 1. 验证金额
                await validatePaymentAmount({
                    planId: selectedPlan.id,
                    currency: selectedPlan.currency,
                    region: selectedPaymentMethod, // 注意：你原始代码中传的是 region，但这里传的是 methodId；需确认 API 要求
                }).unwrap();

                const paymentData = {
                    planId: selectedPlan.id,
                    amount: selectedPlan.price,
                    currency: selectedPlan.currency,
                    userId: currentUser.id,
                    paymentDetails,
                    returnUrl,
                    cancelUrl,
                };

                let paymentResult;

                // 2. 调用对应支付 API
                switch (selectedPaymentMethod) {
                    case 'alipay':
                        paymentResult = await createAlipayPayment(paymentData).unwrap();
                        break;
                    case 'wechat':
                        paymentResult = await createWechatPayment(paymentData).unwrap();
                        break;
                    case 'unionpay':
                    case 'qq_pay':
                    case 'jd_pay':
                        paymentResult = await createUnionPayPayment(paymentData).unwrap();
                        break;
                    case 'paypal':
                        paymentResult = await createPayPalPayment(paymentData).unwrap();
                        break;
                    case 'stripe':
                    case 'apple_pay':
                    case 'google_pay':
                    case 'amazon_pay':
                        paymentResult = await createStripePayment(paymentData).unwrap();
                        break;
                    case 'visa':
                    case 'mastercard':
                    case 'ideal':
                    case 'sofort':
                    case 'giropay':
                    case 'bancontact':
                        paymentResult = await createCreditCardPayment(paymentData).unwrap();
                        break;
                    default:
                        throw new Error('不支持的支付方式');
                }

                // 3. 处理支付结果
                if (paymentResult.redirectUrl) {
                    // 需要重定向
                    return { type: 'redirect', url: paymentResult.redirectUrl };
                } else if (paymentResult.status === 'completed') {
                    // 支付成功，创建订阅
                    const subscription = {
                        id: paymentResult.subscriptionId || Date.now().toString(),
                        planId: selectedPlan.id,
                        planName: selectedPlan.name,
                        userId: currentUser.id,
                        startDate: new Date().toISOString(),
                        expiresAt: getExpirationDate(selectedPlan.id),
                        status: 'active',
                        autoRenew: paymentDetails.autoRenew || false,
                    };

                    dispatch(setCurrentSubscription(subscription));
                    return { type: 'success', result: paymentResult };
                } else {
                    // 其他情况（如 pending）
                    return { type: 'pending' };
                }
            } catch (error) {
                const errorMessage = error.message || '支付处理失败，请重试';
                dispatch(setPaymentError(errorMessage));
                throw error; // 让调用者可以 catch 并显示 message
            } finally {
                dispatch(setPaymentProcessing(false));
            }
        },
        [
            dispatch,
            validatePaymentAmount,
            createAlipayPayment,
            createWechatPayment,
            createUnionPayPayment,
            createPayPalPayment,
            createStripePayment,
            createCreditCardPayment,
            currentUser,
            getExpirationDate,
        ]
    );

    return {
        processPayment,
        
    };
}