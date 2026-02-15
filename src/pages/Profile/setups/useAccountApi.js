import { useAddOrUpdateMutation } from "../../../services/accountApi"

export const useAccountApi = () => {
    const [addOrUpdate] = useAddOrUpdateMutation()
    const addOrUpdateAccount = async (data) => {
        try {
            const res = addOrUpdate(data).unwrap()
            return res
        } catch (error) {
            return {success:false,message:error}
        }
    }
    return {
        addOrUpdateAccount
    }
}