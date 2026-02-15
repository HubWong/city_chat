import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './commonRtk';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Order', 'Subscription', 'Payment'],
  endpoints: (builder) => ({
    // 获取订阅计划
    getSubscriptionPlans: builder.query({
      query: () => '/plans',
      providesTags: ['Subscription'],
    }),
    
    // 获取当前用户订阅
    getCurrentSubscription: builder.query({
      query: () => '/subscription/current',
      providesTags: ['Subscription'],
    }),
    
    // 创建订阅
    createSubscription: builder.mutation({
      query: ({ planId, paymentMethodId, paymentDetails }) => ({
        url: '/subscription/create',
        method: 'POST',
        body: {
          planId,
          paymentMethodId,
          paymentDetails,
        },
      }),
      invalidatesTags: ['Subscription', 'Payment'],
    }),
    
    // 取消订阅
    cancelSubscription: builder.mutation({
      query: (subscriptionId) => ({
        url: `/subscription/${subscriptionId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
    
    // 更新订阅
    updateSubscription: builder.mutation({
      query: ({ subscriptionId, planId }) => ({
        url: `/subscription/${subscriptionId}`,
        method: 'PUT',
        body: { planId },
      }),
      invalidatesTags: ['Subscription'],
    }),
    
    // 获取支付历史
    getPaymentHistory: builder.query({
      query: ({ page = 1, limit = 10 }) => 
        `/payments?page=${page}&limit=${limit}`,
      providesTags: ['Payment'],
    }),
    
    // 创建支付
    createPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/create',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment'],
    }),
    
    // 验证支付
    verifyPayment: builder.mutation({
      query: ({ paymentId, verificationData }) => ({
        url: `/payments/${paymentId}/verify`,
        method: 'POST',
        body: verificationData,
      }),
      invalidatesTags: ['Payment', 'Subscription'],
    }),
    
   
   
    // 获取发票
    getInvoices: builder.query({
      query: ({ page = 1, limit = 10 }) => 
        `/invoices?page=${page}&limit=${limit}`,
      providesTags: ['Payment'],
    }),
    
    // 下载发票
    downloadInvoice: builder.mutation({
      query: (invoiceId) => ({
        url: `/invoices/${invoiceId}/download`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    // 检查订阅状态
    checkSubscriptionStatus: builder.query({
      query: () => '/subscription/status',
      providesTags: ['Subscription'],
    }),
    
    // 获取使用统计
    getUsageStats: builder.query({
      query: ({ startDate, endDate }) => 
        `/usage/stats?startDate=${startDate}&endDate=${endDate}`,
    }),
    
    // 申请退款
    requestRefund: builder.mutation({
      query: ({ paymentId, reason }) => ({
        url: `/payments/${paymentId}/refund`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Payment'],
    }),
    
    // 获取汇率信息
    getExchangeRates: builder.query({
      query: () => '/exchange-rates',
    }),
    
    // 验证优惠码
    validateCoupon: builder.mutation({
      query: (couponCode) => ({
        url: '/coupons/validate',
        method: 'POST',
        body: { code: couponCode },
      }),
    }),
    
    // 应用优惠码
    applyCoupon: builder.mutation({
      query: ({ subscriptionId, couponCode }) => ({
        url: `/subscription/${subscriptionId}/apply-coupon`,
        method: 'POST',
        body: { code: couponCode },
      }),
      invalidatesTags: ['Subscription'],
    }),
    
    // 支付宝支付
    createAlipayPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/alipay/create',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment'],
    }),
    
    // 微信支付
    createWechatPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/wechat/create',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment'],
    }),
    
    // 银联支付
    createUnionPayPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/unionpay/create',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment'],
    }),
    
    // PayPal支付
    createPayPalPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/paypal/create',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment'],
    }),
    
    // Stripe支付
    createStripePayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/stripe/create',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment'],
    }),
    
    // 信用卡支付（Visa/MasterCard）
    createCreditCardPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/creditcard/create',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment'],
    }),
    
    // 获取支付状态
    getPaymentStatus: builder.query({
      query: (paymentId) => `/payments/${paymentId}/status`,
      providesTags: ['Payment'],
    }),
    
    // 处理支付回调
    handlePaymentCallback: builder.mutation({
      query: ({ provider, callbackData }) => ({
        url: `/payments/${provider}/callback`,
        method: 'POST',
        body: callbackData,
      }),
      invalidatesTags: ['Payment', 'Subscription'],
    }),
    
    // 获取支付配置
    getPaymentConfig: builder.query({
      query: (provider) => `/payments/${provider}/config`,
    }),
    
    // 验证支付金额
    validatePaymentAmount: builder.mutation({
      query: ({ planId, currency, region }) => ({
        url: '/payments/validate-amount',
        method: 'POST',
        body: { planId, currency, region },
      }),
    }),
    
    // 获取支持的货币列表
    getSupportedCurrencies: builder.query({
      query: () => '/payments/currencies',
    }),
    
    
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useGetCurrentSubscriptionQuery,
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useGetPaymentHistoryQuery,
  useCreatePaymentMutation,
  useVerifyPaymentMutation,
  
  useGetInvoicesQuery,
  useDownloadInvoiceMutation,
  useCheckSubscriptionStatusQuery,
  useGetUsageStatsQuery,
  useRequestRefundMutation,
  useGetExchangeRatesQuery,
  useValidateCouponMutation,
  useApplyCouponMutation,
  useCreateAlipayPaymentMutation,
  useCreateWechatPaymentMutation,
  useCreateUnionPayPaymentMutation,
  useCreatePayPalPaymentMutation,
  useCreateStripePaymentMutation,
  useCreateCreditCardPaymentMutation,
  useGetPaymentStatusQuery,
  useHandlePaymentCallbackMutation,
  useGetPaymentConfigQuery,
  useValidatePaymentAmountMutation,
  useGetSupportedCurrenciesQuery,
  
} = paymentApi;