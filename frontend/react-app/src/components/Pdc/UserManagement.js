import React, { useState } from "react";

import {
 
  Row,
  Col,
 
  Table,
  Input,
  Space,
  Button,
  Tag,
  Dropdown,
  Menu,
  Modal,
  Form,
  Select,
  message,
} from "antd";
import { PlusOutlined, DownOutlined } from "@ant-design/icons";
import { Can } from '../../utils/Abilities/can'
import UserManagementService from "../../services/Pdc/UserManagementService";
import moment from "moment";

function Page(props) {
  const { data, status, refetch } = UserManagementService.getUsers();

  const { data: userRole, status: userLoadingStatus } =
    UserManagementService.getUserRole();

  const [createUserQuery, { isLoading: createUserQueryLoading }] =
    UserManagementService.createUserAccount();

  const [updateUserQuery, { isLoading: updateUserQueryLoading }] =
    UserManagementService.updateUserAccount();

  const [removeUserQuery, { isLoading: removeUserQueryLoading }] =
    UserManagementService.removeUserAccount();

  const [
    updatePasswordUserQuery,
    { isLoading: updatePasswordUserQueryLoading },
  ] = UserManagementService.updateUserPassword();

  const [OpenCreateModal, SetOpenCreateModal] = useState(false);

  const [OpenUpdateModal, SetOpenUpdateModal] = useState(false);

  const [OnChangePassModal, SetOnChangePassModal] = useState(false);

  const [isSubmit, SetIsSubmit] = useState(false);

  const [clientID, setClientID] = useState(null);

  const [UpdateForm] = Form.useForm();

  const [ChangePasswordForm] = Form.useForm();

  const [searchStr, setSearchStr] = useState(null);

  const [filteredData, setFilteredData] = useState([]);

  const onFinish = (values) => {
    if (createUserQueryLoading) return false;

    SetIsSubmit(true);

    createUserQuery(
      { ...values },
      {
        onSuccess: (res) => {
          message.success("Account Successfuly Created");

          refetch();

          SetIsSubmit(false);
        },
        onError: (e) => {
          message.error("Error Creating Account");

          SetIsSubmit(false);
        },
      }
    );
  };

  const onUpdate = (values) => {
    if (updateUserQueryLoading) return false;

    SetIsSubmit(true);

    updateUserQuery(
      { ...values, clientID: clientID },
      {
        onSuccess: (res) => {
          message.success("Account Successfuly Updated");

          refetch();

          SetIsSubmit(false);
        },
        onError: (e) => {
          message.error("Error Updating Account");

          SetIsSubmit(false);
        },
      }
    );
  };

  const onRemove = (clientID) => {
    if (removeUserQueryLoading) return false;

    removeUserQuery(
      { clientID: clientID },
      {
        onSuccess: (res) => {
          message.success("Account Successfuly Removed");

          refetch();
        },
        onError: (e) => {
          message.error("Error Removeing Account");
        },
      }
    );
  };

  const onChangePassword = () => {
    if (updatePasswordUserQueryLoading) return false;

    SetIsSubmit(true);

    updatePasswordUserQuery(
      { clientID: clientID },
      {
        onSuccess: (res) => {
          ChangePasswordForm.setFieldValue("new_password", res.data.password);
          message.success("Password Successfuly Changed!");

          SetIsSubmit(false);
        },
        onError: (e) => {
          message.error("Error Updating Password");

          SetIsSubmit(false);
        },
      }
    );
  };

  const DropdownMenu = ({ record }) => {
    const menu = (
      <Menu
        items={[
          {
            key: "1",
            label: (
              <Can do="update-user">
                <Button
                  type="link"
                  onClick={() => {
                    UpdateForm.setFieldValue("email", record.email);
                    UpdateForm.setFieldValue("first_name", record.first_name);
                    UpdateForm.setFieldValue("middle_name", record.middle_name);
                    UpdateForm.setFieldValue("last_name", record.last_name);
                    UpdateForm.setFieldValue("user_type", record.user_type);
                    UpdateForm.setFieldValue("is_active", record.is_active);
                    UpdateForm.setFieldValue("role_id", record.role_id);

                    SetOpenUpdateModal(true);
                    setClientID(record.id);
                  }}
                >
                  Update
                </Button>
              </Can>
            ),
          },
          {
            key: "2",
            label: (
              <Can do="remove-user">
                <Button
                  type="link"
                  onClick={() => {
                    if (!confirm("Are you sure you want to remove this account?"))
                      return false;

                    onRemove(record.id);
                  }}
                >
                  Remove
                </Button>
              </Can>
            ),
          },
          {
            key: "3",
            label: (
              <Can do="generate-user-password">
                  <Button
                  type="link"
                  onClick={() => {
                    ChangePasswordForm.setFieldValue("email", record.email);
                    setClientID(record.id);
                    SetOnChangePassModal(true);
                  }}
                >
                  Generate Password
                </Button>
              </Can>
            ),
          },
        ]}
      />
    );

    return (
      <Dropdown overlay={menu} trigger={["click"]}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            ...
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    );
  };

  const handleSearch = (e) => {

    let searchStr = e.target.value.toLowerCase().trim();

    if(!searchStr) {
        setFilteredData(data);
    }
    
    let filterData = data.filter(v => {
        let firstName = v.first_name.toLowerCase();
        let lastName = v.last_name.toLowerCase();
        let email = v.email.toLowerCase();

        if(
          firstName.indexOf(searchStr) > -1 ||
          lastName.indexOf(searchStr) > -1 || 
          email.indexOf(searchStr) > -1
        ) {
            return true;
        }

        return false;
    })

    setSearchStr(searchStr);
    setFilteredData(filterData);
  }

  return (
    <Can do="view-user">
      <h1 className="text-lg tracking-tight font-extrabold text-gray-900 sm:text-xl md:text-2xl">
        <span className="block xl:inline">User Management</span>
      </h1>

      <Space>
        <Can do="create-user">
          <Button type="dashed" onClick={() => SetOpenCreateModal(true)} danger>
            Create User Account
            <PlusOutlined />
          </Button>
        </Can>
      </Space>

      <Input
        placeholder="Search"
        style={{ padding: "4px", width: 350, float: "right" }}
        onChange={handleSearch}
      />

      <Table
        className="mt-2"
        loading={status === "loading"}
        dataSource={!searchStr ? data : filteredData}
        rowKey="id"
        bordered
        columns={[
          {
            title: "First Name",
            dataIndex: "first_name",
            sorter: (a, b) => a.first_name.length - b.first_name.length,
            render: (text, record) => record.first_name,
          },
          {
            title: "Middle Name",
            dataIndex: "middle_name",
            sorter: (a, b) => a.middle_name.length - b.middle_name.length,
            render: (text, record) => record.middle_name,
          },
          {
            title: "Last Name",
            dataIndex: "last_name",
            sorter: (a, b) => a.last_name.length - b.last_name.length,
            render: (text, record) => record.last_name,
          },
          {
            title: "Email",
            dataIndex: "email",
            sorter: (a, b) => a.email.length - b.email.length,
            render: (text, record) => record.email,
          },
          {
            title: "Created At",
            dataIndex: "created_at",
            sorter: (a, b) => a.created_at - b.created_at,
            render: (text, record) => moment(record.created_at).format('YYYY-MM-DD'),
          },
          {
            title: "Updated At",
            dataIndex: "updated_at",
            sorter: (a, b) => a.updated_at - b.updated_at,
            render: (text, record) => moment(record.updated_at).format('YYYY-MM-DD'),
          },
          {
            title: "Account Status",
            dataIndex: "is_active",
            align: "center",
            render: (text, record) => {
              return record.is_active === 1 ? (
                <Tag color="#87d068">Active</Tag>
              ) : (
                <Tag color="#f50">In-Active</Tag>
              );
            },
          },
          {
            title: "Actions",
            align: "center",
            dataIndex: "action",
            render: (text, record) => <DropdownMenu record={record} />,
          },
        ]}
      ></Table>

      <Modal
        title="Create User"
        width={600}
        open={OpenCreateModal}
        onCancel={() => SetOpenCreateModal(false)}
        footer={null}
      >
        <Form onFinish={onFinish} layout="vertical" autoComplete="off">
          <Row gutter={[10, 0]}>
            <Col md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Type your email address here." },
                  { type: "email" },
                ]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                name="middle_name"
                label="Middle Name"
                rules={[{ required: true, message: "Middle name is required" }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                name="role_id"
                label="User Role"
                rules={[{ required: true, message: "User role is required" }]}
              >
                <Select
                  placeholder=" - "
                  size="large"
                  options={userRole}
                  loading={userLoadingStatus === "loading"}
                ></Select>
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                name="user_type"
                label="User Type"
                rules={[{ required: true, message: "User type is required" }]}
              >
                <Select placeholder=" - " size="large">
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="client">Client</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col md={24}>
              <Form.Item
                name="is_active"
                label="Account Status"
                rules={[
                  { required: true, message: "Account Status is required" },
                ]}
              >
                <Select
                  placeholder=" - "
                  size="large"
                  options={[
                    { label: "Active", value: 1 },
                    { label: "In-Active", value: 0 },
                  ]}
                ></Select>
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="dashed"
            size="large"
            htmlType="submit"
            loading={isSubmit}
            danger
          >
            Submit
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Update User"
        width={600}
        open={OpenUpdateModal}
        onCancel={() => SetOpenUpdateModal(false)}
        footer={null}
      >
        <Form
          onFinish={onUpdate}
          layout="vertical"
          autoComplete="off"
          form={UpdateForm}
        >
          <Row gutter={[10, 0]}>
            <Col md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Type your email address here." },
                  { type: "email" },
                ]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                name="middle_name"
                label="Middle Name"
                rules={[{ required: true, message: "Middle name is required" }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                name="role_id"
                label="User Role"
                rules={[{ required: true, message: "User role is required" }]}
              >
                <Select
                  placeholder=" - "
                  size="large"
                  options={userRole}
                  loading={userLoadingStatus === "loading"}
                ></Select>
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                name="user_type"
                label="User Type"
                rules={[{ required: true, message: "User type is required" }]}
              >
                <Select placeholder=" - " size="large">
                  <Option value="admin">Admin</Option>
                  <Option value="client">Client</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col md={24}>
              <Form.Item
                name="is_active"
                label="Account Status"
                rules={[
                  { required: true, message: "Account Status is required" },
                ]}
              >
                <Select
                  placeholder=" - "
                  size="large"
                  options={[
                    { label: "Active", value: 1 },
                    { label: "In-Active", value: 0 },
                  ]}
                ></Select>
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="dashed"
            size="large"
            htmlType="submit"
            loading={isSubmit}
            danger
          >
            Submit
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Update Password"
        width={600}
        open={OnChangePassModal}
        onCancel={() => SetOnChangePassModal(false)}
        footer={null}
      >
        <Form
          onFinish={onChangePassword}
          form={ChangePasswordForm}
          layout="vertical"
          autoComplete="off"
        >
          <Row gutter={[10, 0]}>
            <Col md={24}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Type your email address here." },
                  { type: "email" },
                ]}
              >
                <Input size="large" readOnly />
              </Form.Item>
            </Col>

            <Col md={24}>
              <Form.Item name="new_password" label="New Password">
                <Input
                  size="large"
                  placeholder="New password will show here."
                  readOnly
                />
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="dashed"
            size="large"
            htmlType="submit"
            loading={isSubmit}
            danger
          >
            Reset Password
          </Button>
        </Form>
      </Modal>
    </Can>
  );
}

export default Page;
