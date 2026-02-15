import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentSubscription,
  selectPaymentMethods,
  selectIsProcessingPayment,
  selectPaymentError,
  selectIsSubscriptionActive,
  selectPayVisible,
  setPayModalVisible,
  setPayOrder,
  selectPayOrder,
} from '../store/slices/paymentSlice';

export const useReduxPay = () => {
  const dispatch = useDispatch();
  const currentSubscription = useSelector(selectCurrentSubscription);
  const paymentMethods = useSelector(selectPaymentMethods);
  const isProcessingPayment = useSelector(selectIsProcessingPayment);
  const paymentError = useSelector(selectPaymentError);
  const isSubscriptionActive = useSelector(selectIsSubscriptionActive);
  const order = useSelector(selectPayOrder)
  const payVisible = useSelector(selectPayVisible)

  const setPayVisible = (data) => {
    dispatch(setPayModalVisible(data))
  }

  const createOrder = (data) => {  //time left not count yet.
    console.log(data)

    if (data) {
      dispatch(setPayModalVisible(true))
    } else {
      dispatch(setPayModalVisible(false))
    }
    dispatch(setPayOrder(data))
  }

  return {
    payVisible,
    setPayVisible,
    createOrder,
    order
  }
}