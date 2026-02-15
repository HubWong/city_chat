import { useState } from "react";
import {
  Card,
  Image,
  List,
  Pagination,
  Modal,
  message,
  Space,
  Tag,
} from "antd";
import { useGetPhotoListQuery } from "../hook/adminApi";
import {
  DeleteOutlined,
  EyeOutlined
} from "@ant-design/icons";
import { useAdminApi } from "../hook/useAdminApi";
const PhotoItem = ({ photo, onDel, onView }) => (
  <Card
    hoverable
    cover={<Image src={photo.url} alt={photo.title} />}
    actions={[
      <EyeOutlined key="view" onClick={() => onView(photo.url)} />,
      <DeleteOutlined key="delete" onClick={() => onDel(photo.id)} />,
    ]}
  >
    <Card.Meta
      title={photo.title}
      description={
        <Space>
          <Tag color="blue">{photo.size}</Tag>
          <Tag color="green">{photo.format}</Tag>
        </Space>
      }
    />
  </Card>
);

const UserPhotoMg = () => {
  const [page, setPage] = useState(1);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const { data, isLoading, isError, error } = useGetPhotoListQuery(page);
  const { delUserPhoto } = useAdminApi();
  const [api, contextHolder] = message.useMessage();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const { data: photos = [], total = 0 } = data || {};

  const handlePreview = (url) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "确认删除照片吗？",
      content: "删除后将无法恢复",
      onOk: async () => {
        const r = await delUserPhoto(id);
        if (r) api.success("照片已删除");
        else {
          api.error('failed deleting')
        }
      },
    });
  };

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <h2 style={{ marginBottom: 24 }}>照片管理</h2>

      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 5,
          xxl: 6,
        }}
        dataSource={photos}
        renderItem={(photo) => (
          <List.Item>
            <PhotoItem
              photo={photo}
              onDel={(d) => handleDelete(d)}
              onView={handlePreview}
            />
          </List.Item>
        )}
      />

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <Pagination
          current={page}
          total={total}
          onChange={setPage}
          showSizeChanger={false}
        />
      </div>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="预览" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default UserPhotoMg;
