import { Progress } from "antd";

export function FileProgress({ progress }) {
  return (
    <div>
      <Progress percent={progress} status="active" />
    </div>
  );
}
