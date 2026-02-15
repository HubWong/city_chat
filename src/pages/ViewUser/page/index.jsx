// UserListPage.js
import { useState, useRef, useEffect } from "react";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Pagination, Spin, message, Button, Collapse, Form, Space, Input, Select, Slider } from "antd";
import { ResumeList } from "../comp/ResumeList";
import CountdownPanel from "../comp/CountDwonPanel";
import { useUserApi } from "../hook/useUserApi"; // 假设该 hook 支持传入 searchParams
import { useAuthApi } from '../../../hooks/useAuthApi';
import EmptyState from "../../../components/EmptyState";
import { useReduxAuth } from "../../../hooks/useReduxAuth";
import ProfileModal from "../comp/ProfileModal";
import "./index.css";

const { Option } = Select;

const initParams = {
  keyword: "",
  gender: -1,
  minAge: 18,
  maxAge: 80,
}

const UserListPage = () => {
  const [ageRange, setAgeRange] = useState([18, 80]);

  const lastSearchRef = useRef(initParams);

  const [form] = Form.useForm();
  const { users, total, pagination, loading, isSuccess, onPageChange, onSearch } = useUserApi();
  const { downMyCv } = useAuthApi();

  const [showForm, setShowForm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { toggleLoginForm } = useReduxAuth();
  const { isTokenExp, user } = useReduxAuth()
  const [api, contextHolder] = message.useMessage();


  const handleSearch = async (values) => {

    const newParams = {
      keyword: values.keyword || null,
      gender: values.gender ? parseInt(values.gender) : -1,
      minAge: ageRange[0],
      maxAge: ageRange[1]
    };

    lastSearchRef.current = newParams
    await onSearch(newParams)
  };


  const resetFilters = () => {
    form.resetFields();
    setAgeRange([18, 80]);

    lastSearchRef.current = initParams;
    onSearch(initParams);
  };

  useEffect(() => {

    if (pagination.current === 1) {
      onSearch(lastSearchRef.current);
    }
  }, []); // 初始加载

  // 当分页变化时，自动重新搜索（使用上次条件）
  useEffect(() => {
    if (pagination.current > 1 || total > 0) {
      // 避免首次加载重复触发（可根据需求调整）
      onSearch(lastSearchRef.current);
    }
  }, [pagination.current, pagination.pageSize]);

  const onDownCv = async () => {
    const res = await downMyCv();
    if (res) {
      api.success("已下架");
    } else {
      api.error("失败");
    }
  };

  const handleFormSaved = (savedResume) => {
    api.info("资料保存成功！");
    setShowForm(false);
    setOpenEdit(false);
  };

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const addOneDaySimple = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date;
  };

  const renderUserActions = () => {
    if (!user) return null;
    return (
      <div className="user-actions">
        <button className="edit-button" onClick={() => onEditCv()}>
          编辑我的简历
        </button>
        {user?.onShow && (
          <button className="delete-button" onClick={() => onDownCv()}>
            下架我的简历
          </button>
        )}
        {user && (
          <div className="expiry-info">
            <CountdownPanel targetDate={addOneDaySimple(user.created_at)} />
          </div>
        )}
      </div>
    );
  };

  const onEditCv = () => {
     
    if (!user) {
      toggleLoginForm();
    } else {
      setOpenEdit(true);
    }
  };

  const onCreateCv = () => {
    if (!user || isTokenExp()) {
      toggleLoginForm();
    } else {
      setShowForm(true);
    }
  };

  const renderCreateButton = () => {
    if (user) return null;
    return (
      <button
        className="create-button"
        onClick={onCreateCv}
        disabled={loading}
      >
        创建我的简历
      </button>
    );
  };

  const renderMainContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      );
    }

    if (!isSuccess || users.length === 0) {
      return <EmptyState title="暂无用户" subTitle="请邀请好友加入相亲角" />;
    }

    return (
      <>
        <ResumeList resumes={users} />
        <div style={{ margin: "20px auto", textAlign: "center" }}>
          <Pagination
            current={pagination.current}
            total={total}
            pageSize={pagination.pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>
      </>
    );
  };

  const isModalOpen = showForm || openEdit;
  
  const handleModalClose = () => {
    setShowForm(false);
    setOpenEdit(false);
  };

  const FilterForm = () => (
    <Form form={form} layout="vertical" onFinish={handleSearch}>
      <Space size="middle" wrap className="filter-form">
        <Form.Item name="keyword" label="关键词">
          <Input placeholder="昵称或简介" prefix={<SearchOutlined />} allowClear />
        </Form.Item>

        <Form.Item name="gender" label="性别">
          <Select placeholder="不限" style={{ width: 120 }} allowClear>
            <Option value="-1">请选择</Option>
            <Option value="1">男</Option>
            <Option value="0">女</Option>
          </Select>
        </Form.Item>

        <Form.Item label="年龄范围">
          <Slider
            range
            min={18}
            max={80}
            value={ageRange}
            onChange={setAgeRange}
            tooltip={{ formatter: (value) => `${value}岁` }}
          />
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button onClick={resetFilters}>重置</Button>
        </Space>
      </Space>
    </Form>
  );

  return (
    <div className="user-list-container">
      {contextHolder}

      <div className="resume-list-page">
        <header className="page-header">
          <h1>相亲角</h1>
          <p>寻找你的另一半，从这里开始</p>

          <div className="action-buttons">
            {renderUserActions()}
            {renderCreateButton()}
          </div>
        </header>

        <div className="filter-section">
          <div className="filter-toggle">
            <Button
              type="text"
              icon={<FilterOutlined />}
              onClick={() => setIsFilterVisible((prev) => !prev)}
              className="filter-button-mobile"
            >
              筛选
            </Button>
          </div>

          <div className="filter-content">
            <div className="filter-desktop">
              <FilterForm />
            </div>

            <div className="filter-mobile">
              <Collapse
                activeKey={isFilterVisible ? ["1"] : []}
                onChange={(key) => setIsFilterVisible(key.includes("1"))}
                bordered={false}
                items={[
                  {
                    key: "1",
                    label: "",
                    children: <FilterForm />,
                    showArrow: false,
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <main>{renderMainContent()}</main>
      </div>

      {isModalOpen && (
        <ProfileModal
          open={isModalOpen}
          onOk={handleFormSaved}          
          handleCancel={handleModalClose}
        />
      )}
    </div>
  );
};

export default UserListPage;