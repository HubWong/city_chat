import { Divider, Image, Row, Col } from "antd";
import EmptyState from "../../../components/EmptyState";

const PhotoGallery = ({ photos }) => {
    
    const phoImgs = photos.find(item => item.description !== 'avatar')
   
    return (
        <div className="photo-gallery">
            <Divider orientation="left">相册</Divider>
            {!phoImgs && <EmptyState description="没有图片"/>}
            {phoImgs && <Image.PreviewGroup>
                <Row gutter={[16, 16]}>
                    {photos
                        ?.filter((a) => a.description !== "avatar")
                        .map((photo) => (
                            <Col xs={12} sm={8} md={6} key={photo.id}>
                                <Image
                                    src={photo.url}
                                    alt="用户照片"
                                    className="user-photo"
                                    placeholder={
                                        <div style={{ background: "#f0f2f5", height: "100%" }} />
                                    }
                                />
                            </Col>
                        ))}
                </Row>
            </Image.PreviewGroup>}
        </div>
    );
}

export default PhotoGallery
