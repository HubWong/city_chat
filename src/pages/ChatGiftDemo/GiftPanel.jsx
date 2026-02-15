import { useState } from "react";
import { Card, Col, Button, Row } from "antd";
import {GIFT_TYPES} from "./ChatGiftDemo";
const GiftPanel = ({ onSend }) => {
  const [selected, setSelected] = useState(null);
   
  return (
    <Card title="选择礼物" variant={false}>
      <Row gutter={[16, 16]}>
        {Object.entries(GIFT_TYPES).map(([key, gift]) => (
          <Col span={8} key={key}>
            <Button
              block
              type={selected === key ? "primary" : "default"}
              onClick={() => setSelected(key)}
              style={{ height: 80 }}
            >
              <div style={{ fontSize: 20 }}>{gift.icon}</div>
              {gift.name} ({gift.price}币)
            </Button>
          </Col>
        ))}
      </Row>
      <Button
        type="primary"
        block
        disabled={!selected}
        onClick={() => onSend(selected)}
        style={{ marginTop: 16 }}
      >
        赠送
      </Button>
    </Card>
  );
};

export default GiftPanel;
