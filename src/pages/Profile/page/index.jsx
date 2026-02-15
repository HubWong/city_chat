import { message } from "antd";
import { Link } from "react-router-dom";
import { useReduxAuth } from "../../../hooks/useReduxAuth";
import UserProfileForm from "../comp/UserProfileForm";
import { useAuthApi } from "../../../hooks/useAuthApi";
import { useGetMeQuery } from "../../../services/authApi";

export default function Profile() {
  const [api, contextHolder] = message.useMessage()
  const { data: myProfile, isSuccess, isError } = useGetMeQuery()

  const { updateMyCv } = useAuthApi()
  const { user: me } = useReduxAuth();

  const onProfileSubmit = async (data) => {
    try {
      delete data.avatar
      const resp = await updateMyCv(data);
      if (resp.success) {
        api.success('资料已更新')
      }
      else {
        api.error("更新失败：" + resp.message)
      }
    } catch (error) {
      api.error(error)
    }

  }

  return (
    <div className="profile-editor-container" style={{ margin: "0 auto" }}>
      {contextHolder}
      <div
        style={{
          justifyContent: "space-between",
          display: "flex",
          alignItems: "center",
        }}
      >



      </div>
      <UserProfileForm initialData={myProfile?.data} onSubmit={onProfileSubmit} />
      {me?.role === 'vip' && <p style={{ marginTop: "2em" }}>
        <Link to={"/center/user_photos"}>管理相册</Link>
      </p>}

      <div>
        <Link to={"/center/user_photos"}>管理相册</Link>
      </div>
    </div>
  );
}
