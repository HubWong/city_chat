import { createSlice } from "@reduxjs/toolkit";
import { paymentPlans, paymentList } from "@/shared/config/index";

const initialState = {
  payVisible:false,
  subscriptionPlans: paymentPlans,
  currentSubscription: null,
  paymentMethods: paymentList,
  isProcessingPayment: false,
  paymentError: null,
  order:null
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPayModalVisible:(state, {payload})=>{
      state.payVisible = payload
    },
    setPayOrder:(state,{payload})=>{
      state.order =payload
    },
    setCurrentSubscription: (state, { payload }) => {
      state.currentSubscription = payload;
    },
    setPaymentProcessing: (state, { payload }) => {
      state.isProcessingPayment = payload;
    },
    setPaymentError: (state, { payload }) => {
      state.paymentError = payload;
    },
    clearPaymentError: (state) => {
      state.paymentError = null;
    },
    updateSubscriptionStatus: (state, { payload }) => {
      if (state.currentSubscription) {
        state.currentSubscription = {
          ...state.currentSubscription,
          ...payload,
        };
      }
    },
  },
});

export const {
  setPayModalVisible,
  setPayOrder,
  setCurrentSubscription,
  setPaymentProcessing,
  setPaymentError,
  clearPaymentError,
  updateSubscriptionStatus,
} = paymentSlice.actions;

export default paymentSlice.reducer;

// Selectors
export const selectPayVisible = (state)=>state.payment.payVisible
export const selectPayOrder = (state)=>state.payment.order
export const selectSubscriptionPlans = (state) =>
  state.payment.subscriptionPlans;
export const selectCurrentSubscription = (state) =>
  state.payment.currentSubscription;
export const selectPaymentMethods = (state) => state.payment.paymentMethods;
export const selectIsProcessingPayment = (state) =>
  state.payment.isProcessingPayment;
export const selectPaymentError = (state) => state.payment.paymentError;

// Helper selectors
export const selectIsSubscriptionActive = (state) => {
  const subscription = state.payment.currentSubscription;
  if (!subscription) return false;
  return new Date(subscription.expiresAt) > new Date();
};

export const selectPaymentMethodsByRegion = (region) => (state) => {
  return state.payment.paymentMethods.filter(
    (method) => method.region === region || method.region === "GLOBAL"
  );
};
