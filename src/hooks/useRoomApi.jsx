import { useState } from "react"
import { useLazySearchRoomsQuery, useCreateRoomMutation, useEditRoomMutation } from "../services/roomApi"

export const useRoomApi = () => {
    const [createRoom] = useCreateRoomMutation()
    const [editRoom] = useEditRoomMutation()

    const createOrUpdateRoom = async (data) => {
        console.log(data)
        try {
            if (data.id) {
                console.log('update room', data)
                const res = await editRoom({id:data.id,data}).unwrap()
                return res
            } else {
                const res = await createRoom(data).unwrap()
                return res
            }

        } catch (error) {
            console.log(error)
            return
        }
    }

    // 分页状态
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });

    const [trigger, result] = useLazySearchRoomsQuery()
    const {
        data,
        isFetching,
        isLoading,
        isSuccess,
    } = result;

    // ✅ 搜索房间（必须传入 current 和 pageSize）
    const searchRoom = async (searchData = {}) => {
        // ✅ 不要使用 pagination 作为默认值！

        const {
            query = null,
            isPublic = true,
            city = null,
            current,      // ⚠️ 必须传入
            pageSize      // ⚠️ 必须传入
        } = searchData;

        // ✅ 验证必需参数
        if (current === undefined || pageSize === undefined) {
            console.error('[useRoomApi] searchRoom 缺少 current 或 pageSize 参数');
            throw new Error('searchRoom 必须传入 current 和 pageSize');
        }

        const params = {
            query,
            isPublic,
            city,
            page: current,    // 后端使用 page
            limit: pageSize   // 后端使用 limit
        };


        try {
            const response = await trigger(params).unwrap();

            // ✅ 更新分页状态
            setPagination({
                current: current,
                pageSize: pageSize
            });

            return response;
        } catch (error) {
            console.error('[useRoomApi] ❌ 搜索失败:', error);
            throw error;
        }
    };

    // ✅ 分页变化（只更新状态）
    const onPageChange = (page, pageSize) => {
        
        setPagination({
            current: page,
            pageSize: pageSize || pagination.pageSize,
        });
    };

    return {
        rooms: data?.data || [],
        total: data?.total || 0,
        pagination,
        loading: isLoading || isFetching,
        onPageChange,
        isSuccess,
        searchRoom,
        createOrUpdateRoom
    }
}