import { useState } from "react";
import { useLazySearchUsersQuery, useDownUserCvMutation } from "./userApi";
 
export function useUserApi() {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  const [trigger, result] = useLazySearchUsersQuery();

  const {
    data,
    isFetching,
    isLoading,
    isSuccess,
  } = result;
   
  const onSearch = async (searchCriteria = {}) => {
    const { keyword, gender, minAge, maxAge } = searchCriteria;
    const page = pagination.current;
    const limit = pagination.pageSize;
   
    try {
      const response = await trigger({        
        keyword,        
        gender,
        minAge,
        maxAge,
        page,
        limit
      }).unwrap();
      return response;
    } catch (error) {
      console.error('Failed to search users:', error);
      throw error;
    }
  };

  const [downUserCv] = useDownUserCvMutation()
  const downUserCvReq = async (cvId) => {
    console.log('will down cvId', cvId)
    try {
      const res = await downUserCv(cvId).unwrap()
      return res
    } catch (error) {
      console.error(error)
    }
  }
  const onPageChange = (newPagination) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // 可选：当分页变化时自动重新搜索（如果保留上次搜索条件）
  // 但通常需要保存上次的搜索条件，这里简化处理，假设外部调用 onSearch 时传入完整条件

  return {
    downUserCvReq,

    users: data?.data || [],
    total: data?.total || 0,
    pagination,
    loading: isLoading || isFetching,
    onPageChange,
    isSuccess,
    onSearch,
  };
}
