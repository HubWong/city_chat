import { Card, Row, Col, Statistic, Progress, Spin, Empty } from "antd";
import { useGetConsoleDataQuery } from "../hook/adminApi";
import {
  TeamOutlined,
  UserAddOutlined,
  GlobalOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import "./dashboardPage.css";
import NatioinFlagEle from '@/components/NationFlagEle'
import {  useEffect } from "react";

const DashboardPage = () => {

  const { data: dataMeta, isLoading, error, isSuccess } = useGetConsoleDataQuery();

  useEffect(() => {
 
  }, [isSuccess, dataMeta?.data,isLoading])

  const renderCountryList = ({stats}) => {
    if (isLoading) return <Spin title="Loading..." />
 
    return (
      <div className="country-list">
        {isSuccess && stats?.map((item) => (
          <div key={item.ip_country} className="country-item">
            <span className="country-name">{item.ip_country}</span>
            <NatioinFlagEle cn={item.ip_country} />
            <Progress
              percent={
                (item.user_count / stats.reduce((a, b) => a + b.user_count, 0)) *
                100
              }
              strokeColor="#1890ff"
              showInfo={false}
            />
            <span className="country-count">{item.user_count}</span>
          </div>
        ))}
      </div>
    );
  };



  if (error) {
    return (
      <Card className="error-card">
        <Empty
          description={
            <span className="error-text">数据加载失败: {error.message}</span>
          }
        />
      </Card>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">数据总览</h2>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            title={
              <span className="card-header">
                <GlobalOutlined /> 用户地域分布
              </span>
            }
            variant={false}
            className="custom-card"
          >
            {dataMeta?.data?.stats && renderCountryList(dataMeta?.data)}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            title={
              <span className="card-header">
                <TeamOutlined /> 用户统计
              </span>
            }
            variant={false}
            className="custom-card"
          >
            <Statistic
              title="用户总数"
              value={dataMeta?.data.total_users || 0}
              prefix={<UserAddOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
            <Statistic
              title="注册用户"
              value={dataMeta?.data.total_users || 0}
              prefix={<UserAddOutlined />}
              valueStyle={{ color: "#52c41a" }}
              className="statistic-item"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            title={
              <span className="card-header">
                <DollarOutlined /> 员工数据
              </span>
            }
            variant={false}
            className="custom-card"
          >
            <Statistic
              title="员工总数"
              value={dataMeta?.data.total_users || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
            <Statistic
              title="充值用户"
              value={dataMeta?.data.role_vip_count || 0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#faad14" }}
              className="statistic-item"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
