import React, { useState } from 'react'

import { Row, Col , Input, Button, Table, Space, Menu, Dropdown, Modal, Form, message} from 'antd'
import { PlusOutlined, DownOutlined} from '@ant-design/icons'
import { Can } from '../../utils/Abilities/can'
import UserManagementService from '../../services/Pdc/UserManagementService'
import Permissions from './Permissions'
import moment from 'moment'

function Page(props) {

  const { data, status, refetch } = UserManagementService.getUserRoleForTable();

  const [roleModal, setRoleModalOpen] = useState(false);

  const [roleUpdateModal, setRoleUpdateModalOpen] = useState(false);

  const [createRoleQuery, { isLoading: createRoleQueryLoading}] = UserManagementService.createRole();

  const [updateRoleQuery, { isLoading: updateRoleQueryLoading}] = UserManagementService.updateRole();

  const [removeRoleQuery, { isLoading: removeRoleQueryLoading}] = UserManagementService.removedRole();

  const [isSubmit, setIsSubmit] = useState(false);

  const [roleID, setRoleID] = useState(null);

  const [roleName, setRoleName] = useState(null);

  const [roleUpdateForm] = Form.useForm();

  const [rolePermissionModal, setRolePermissionModalOpen] = useState(false);

  const [rolePermissionForm] = Form.useForm();
  
  const [searchStr, setSearchStr] = useState(null);

  const [filteredData, setFilteredData] = useState([]);

  const onCreateRole = values => {

      if(createRoleQueryLoading) return false;

          setIsSubmit(true);

          createRoleQuery({...values}, {
          onSuccess: (res) => {

              message.success('Role Successfully Created');

              refetch();

              setIsSubmit(false);
          },
          onError: (e) => {

              message.error('Error Creating Role');

              setIsSubmit(false);
          }
      })
  }

  const onUpdateRole = values => {

    if(updateRoleQueryLoading) return false;

        setIsSubmit(true);

        updateRoleQuery({...values, id: roleID}, {
        onSuccess: (res) => {

            message.success('Role Successfully Updated');

            refetch();

            setIsSubmit(false);
        },
        onError: (e) => {

            message.error('Error Updating Role');

            setIsSubmit(false);
        }
    })
  }

  

  const onRemoveRole = id => {

    if(removeRoleQueryLoading) return false;

      removeRoleQuery({id: id}, {
        onSuccess: (res) => {

              message.success('Role Successfuly Removed');

              refetch();
          },
          onError: (e) => {

              message.error('Error Removing Role');
          }
      })
  }

  const onSavePermission = () => { 
     
  }

  const DropdownMenu = ({record}) => {
    const menu = (
        <Menu
          items={[
              {
                key: '1',
                label: <Can do="update-role">
                  <Button type='link' onClick={() => {
                    roleUpdateForm.setFieldValue('role_name', record.name);
                    setRoleUpdateModalOpen(true);
                    setRoleID(record.id);
                    setRoleName(record.name);
                    }}>Update</Button>
                </Can>,
              },
              {
                key: '2',
                label: <Can do="remove-role">
                  <Button type='link' onClick={() => {

                    if(!confirm('Are you sure you want to remove this role?')) return false;

                    onRemoveRole(record.id)

                    }}>Remove</Button>
                </Can>,
              },
              {
                key: '3',
                label: <Can do="update-permission">
                  <Button type='link' onClick={() => {

                  rolePermissionForm.setFieldValue('role_name', record.name);
                  setRolePermissionModalOpen(true);
                  setRoleID(record.id);
                  setRoleName(record.name);
                  }}>Role Permissions</Button>
                </Can>,
              },
          ]}
        />
      );

    return <Dropdown overlay={menu} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
            <Space>
                ...
                <DownOutlined />
            </Space>
            </a>
        </Dropdown>
 }

 const handleSearch = (e) => {

  let searchStr = e.target.value.toLowerCase().trim();

  if(!searchStr) {
      setFilteredData(data);
  }
  
  let filterData = data.filter(v => {
      let name = v.name.toLowerCase();

      if(name.indexOf(searchStr) > -1) {
          return true;
      }
      return false;
  })

  setSearchStr(searchStr);
  setFilteredData(filterData);
}

  return (
    <Can do="view-role">
         <h1 className="text-lg tracking-tight font-extrabold text-gray-900 sm:text-xl md:text-2xl">
          <span className="block xl:inline">User Roles</span>
        </h1>

        
          <Space>
            <Can do="create-role">
              <Button type="dashed" danger onClick={() => setRoleModalOpen(true)}>Create Role <PlusOutlined /></Button>
            </Can>
            
          </Space>

          <Input placeholder='Search' onChange={handleSearch} style={{padding: '4px', width: 350,float: 'right'}}/>
        

        <Table className='mt-2'  loading={status === 'loading'} dataSource={!searchStr ? data : filteredData} rowKey="id" bordered columns={[
                {
                  title: '#',
                  dataIndex: 'id',
                  sorter: (a, b) => a.id - b.id,
                },
                {
                    title: 'Role Name',
                    dataIndex: 'name',
                },
                {
                    title: 'Created At',
                    render: (text, record) => moment(record.created_at).format('YYYY-MM-DD')
                },
                {
                    title: 'Updated At',
                    render: (text, record) => moment(record.updated_at).format('YYYY-MM-DD')
                },
                {
                  title: 'Actions',
                  align: 'center',
                  dataIndex: 'action',
                  render: (text, record) => <DropdownMenu record={record} />
              }
            ]}>

        </Table>

        <Modal title="Create Role" width={600} open={roleModal} onCancel={() => setRoleModalOpen(false)} footer={null}>
            
            <Form onFinish={onCreateRole} layout="vertical" autoComplete="off">
                
                <Row gutter={[5,0]}>
                    <Col md={24}>
                        <Form.Item name="role_name" label="Role Name" rules={[{ required: true, message: 'Role name is required' }]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                </Row>
                
                <Button type="dashed" size="large" htmlType="submit" loading={isSubmit} danger>Submit</Button>
                
            </Form>
        </Modal>

        <Modal title="Update Role" width={600} open={roleUpdateModal} onCancel={() => setRoleUpdateModalOpen(false)} footer={null}>
            
            <Form onFinish={onUpdateRole} form={roleUpdateForm} layout="vertical" autoComplete="off">
                
                <Row gutter={[5,0]}>
                    <Col md={24}>
                        <Form.Item name="role_name" label="Role Name" rules={[{ required: true, message: 'Role name is required' }]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                </Row>
                
                <Button type="dashed" size="large" htmlType="submit" loading={isSubmit} danger>Submit</Button>
                
            </Form>
        </Modal>

        <Modal title={roleName+" Permissions"} width={600} open={rolePermissionModal}     onCancel={() => { setRolePermissionModalOpen(false); window.location.reload() }} footer={null} 
        bodyStyle={{ height: '350px', overflow: 'auto' }}
        destroyOnClose={true}> 
            
            <Permissions roleID={roleID}/>
        </Modal>
    </Can>
  )
}

export default (Page);