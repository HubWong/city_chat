/**
 * together with payment api
 */

import { paymentApi } from "./paymentApi";
import { useReduxPay } from "../hooks/useReduxPay";
import { OrderModel } from "@/shared/model/appModels";

export const orderApi = paymentApi.injectEndpoints({
    endpoints: builder => ({
        createOrder: builder.mutation({
            query: (data) => ({
                url: `/orders/`,
                method: 'POST',
                body: data.toJSON()
            }),
            providesTags: ['Order']
        })
    })
})

export const {
    useCreateOrderMutation
} = orderApi


export const useOrderApi = () => {
    const [createOder] = useCreateOrderMutation()
    const { createOrder } = useReduxPay()

    /**
     * chain :eth,base etc.
    currency:'usdt/usdc' 
    */   
    
    const createNewOrder = async ({ order_for, amount, chain, currency }) => {
        try {
            const data = new OrderModel()
            data.amount = amount
            data.chain = chain
            data.order_for = order_for
            data.currency = currency
            const res = await createOder(data).unwrap()
            if (res.success) {
                createOrder(res.data)
            }
            return res
        } catch (error) {
            console.error(error)
        }
    }
    return { createNewOrder }
}
