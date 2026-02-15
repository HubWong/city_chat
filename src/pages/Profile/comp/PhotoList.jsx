// components/PhotoList.jsx
import { Upload } from "antd";
import { Grid, Tag,Button, Tooltip } from "antd";
import { UploadOutlined,  LockOutlined, UnlockOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

const UploadButton = ({ isDisabled, maxCount, currentCount }) => (
    !isDisabled && (
        <Button icon={<UploadOutlined />} disabled={isDisabled}>
            上传图片 ({currentCount}/{maxCount})
        </Button>
    )
);
const PrivateToggleTag = ({ isPrivate, onClick, loading = false }) => {
    return (
        <Tooltip title={isPrivate ? "设为公开" : "设为私有"}>
            <Tag
                icon={isPrivate ? <LockOutlined /> : <UnlockOutlined />}
                color={isPrivate ? "red" : "default"}
                style={{
                    cursor: "pointer",
                    userSelect: "none",
                    marginLeft: 4,
                    padding: "0 6px",
                }}
                onClick={(e) => {
                    e.stopPropagation(); // 防止触发 preview
                    !loading && onClick?.();
                }}
            >
                {isPrivate ? "私有" : "公开"}
            </Tag>
        </Tooltip>
    );
};

export const PhotoList = ({
    fileList,
    beforeUpload,
    customRequest,
    handleRemove,
    handlePreview,
    isUploadDisabled,
    maxCount,
}) => {
    const screens = useBreakpoint();
    const itemRender = (originNode, file) => {
        // originNode 是默认的 <div><img /><span>name</span></div>
        // 我们在其右下角叠加私有标签
        return (
            <div style={{ position: "relative" }}>
                {originNode}
                {file.status === "done" && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 4,
                            right: 4,
                            zIndex: 2,
                        }}
                    >
                        <PrivateToggleTag
                            isPrivate={file.is_private}
                            onClick={() => onTogglePrivate(file)}
                        />
                    </div>
                )}
            </div>
        );
    };
    return (
        <Upload
            keyProp="key"
            listType={screens.xs ? "picture" : "picture-card"}
            fileList={fileList}
            beforeUpload={beforeUpload}
            customRequest={customRequest}
            onRemove={handleRemove}
            onPreview={handlePreview}
            itemRender={itemRender} // 👈 关键：注入自定义渲染
            multiple
            accept="image/*"
            disabled={isUploadDisabled}
        >
            <UploadButton
                isDisabled={isUploadDisabled}
                maxCount={maxCount}
                currentCount={fileList.length}
            />
        </Upload>
    );
};