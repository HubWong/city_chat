

import React from 'react'
import { useCreateCooperMutation, useUpdateCooperMutation, useCooperValidatedMutation } from '../../../services/cooperApi'

const useCooperApi = () => {
    const [createCooper] = useCreateCooperMutation()
    const [updateCooper] = useUpdateCooperMutation()
    const [cooperValidated] = useCooperValidatedMutation()
     
    const addOrUpdateCooper = async (data) => {
         
        if (data.id) { //update
            try {
                const res = await updateCooper({ cooperId: data.id, ...data }).unwrap();
                return res; // 应包含 { uid, name, tel, wchat?, address? }
            } catch (err) {
                console.error('loadCooper error:', err);
                return null;
            }
        } else {
            try {
                const res = await createCooper(data).unwrap();
                return res; // 应包含 { uid, name, tel, wchat?, address? }
            } catch (err) {
                console.error('loadCooper error:', err);
                return null;
            }
        }

    }

    const loadCooper = async () => {
        try {
            const res = await triggerGetCooper().unwrap()
            return res
        } catch (error) {
            return error
        }
    }

    const toggleValid = async ({id, valid}) => {
        console.log(id,valid)
        const res = await cooperValidated({id,valid}).unwrap()
        return res
    }

    return {
        addOrUpdateCooper,
        loadCooper,
        toggleValid
    }

}

export default useCooperApi
