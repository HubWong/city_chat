import React, { useState, useEffect } from "react";
import { Upload, Card, Grid, Tag, Button, message, Modal } from "antd";
import { UploadOutlined, CrownFilled } from "@ant-design/icons";
import {
  useGetUserPhotosQuery,

} from "../hook/photoApi";
import { PhotoPreviewModal } from "../comp/PhotoPreviewModal";
import { PhotoList } from "../comp/PhotoList";
import { imageResize } from "../../../services/toolFuncs";
import { useFileApi } from "../hook/useFileApi";
import "./albumPage.css";

const { useBreakpoint } = Grid;

const AlbumPage = () => {
  const {
    data: photos,
    isLoading: photosLoading,
    success,
  } = useGetUserPhotosQuery();

  const [api, contextHolder] = message.useMessage();
  const isVIP = false;
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null); // 用于保存当前预览的文件对象
  
  const maxCount = isVIP ? 10 : 5;

  useEffect(() => {
    if (photos?.data) {

      setFileList(
        photos.data.map((item) => ({
          ...item,
          uid: item.id,
          key: item.id,
          status: "done",
          name: item.url.split("/").pop(),
        }))
      );
    }
  }, [photosLoading, success]);

  const { upload, del_photo } = useFileApi();

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("只能上传图片文件");
      return false;
    }
    file.uid = `upload_${Date.now()}`;
    return true;
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      // 添加上传中状态
      setFileList((prev) => [
        ...prev,
        {
          uid: file.uid,
          name: file.name,
          status: "uploading",
          percent: 0,
          key: file.uid,
          thumbUrl: URL.createObjectURL(file),
        },
      ]);

      const imageContent = await imageResize(file, 800);
      const formData = new FormData();
      formData.append("file", imageContent);
      formData.append("type", "photo");

      const response = await upload(formData);
      if (response.data.success) {
        const data = response.data.data;
        onSuccess(data, file);
        setFileList((prev) =>
          prev.map((item) =>
            item.uid === file.uid
              ? {
                ...item,
                key: data.id,
                url: data.url,
                thumbUrl: data.url,
                status: "done",
              }
              : item
          )
        );
        api.success(`图片上传成功！`);
      } else {
        onError(new Error(response.data.message || "上传失败"));
      }
    } catch (error) {
      onError(error);
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      api.error(`${file.name} 上传失败！`);
    }
  };

  const handleRemove = (file) => {
    return new Promise((resolve, reject) => {
      if (file.status === "uploading") {
        api.warning("上传中，无法删除");
        reject(false);
        return;
      }

      Modal.confirm({
        title: "确认删除",
        content: "确定要删除这张图片吗？",
        onOk: async () => {
          try {
            const res = await del_photo(file.key);
            if (res?.success) {
              setFileList((prev) => prev.filter((item) => item.key !== file.key));
              api.success("删除成功");
              resolve(true);
            } else {
              api.error("删除失败：" + (res?.message || "未知错误"));
              reject(false);
            }
          } catch (error) {
            console.error("删除出错:", error);
            api.error("删除失败，请重试");
            reject(false);
          }
        },
        onCancel: () => reject(false),
      });
    });
  };

  const isUploadDisabled = fileList.length >= maxCount;

  const handlePreview = (file) => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };



  return (
    <Card
      title={
        <>
          我的相册
          {isVIP && (
            <Tag icon={<CrownFilled />} color="gold">
              VIP
            </Tag>
          )}
        </>
      }
      extra={
        <span>
          已使用 {fileList.length}/{maxCount}
        </span>
      }
    >

      <PhotoList
        fileList={fileList}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        handleRemove={handleRemove}
        handlePreview={handlePreview}
        isUploadDisabled={isUploadDisabled}
        maxCount={maxCount}
      />

      <PhotoPreviewModal
        visible={previewVisible}
        file={previewFile}
        onClose={() => setPreviewVisible(false)}
        onRemove={handleRemove}
      />

      {contextHolder}
    </Card>
  );
}

export default AlbumPage;
