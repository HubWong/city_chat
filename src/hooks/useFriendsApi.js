import { useAddRelationMutation,useToggleFollowingMutation } from "../services/friendApi";


/* "follow", "unfollow", "add_friend", "accept_friend", 
    "reject_friend", "remove_friend", "block", "unblock"
  */
export const RelationRequestType = {
  follow:"follow",
  unfollow:'unfollow',
  add_friend:'add_friend',
  accept_friend:'accept_friend',
  reject_friend:'reject_friend',
  remove_friend:'remove_friend',
  block:"block",
  unblock:'unblock',
  like:'like',
  
}

export const useFriendsApi = () => {
  const [addRelation] = useAddRelationMutation();
  const relationRequest = async (toUserId,action) => {
    try {
      const res = await addRelation({ toUid: toUserId,action }).unwrap();
       
      return res;
    } catch (error) {

      return false;
    }
  };

  const [toggleFollowing]=useToggleFollowingMutation()
  const toggleFollowingRequest =async (toUserId)=>{
    try {
      const resp = await toggleFollowing(toUserId).unwrap()
      return resp
    } catch (error) {
      console.log(error)
    }
  }


 
  return { relationRequest,toggleFollowingRequest }
};
