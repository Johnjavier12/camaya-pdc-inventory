import React,{useEffect, useState} from 'react'
import Http from 'utils/Http'

import { Typography, Row, Col, Card , Input, Button, Table, Space, Menu, Dropdown, Modal, Form, Select, message} from 'antd'
import { PlusOutlined, DownOutlined} from '@ant-design/icons'

import ClientService from '../../services/Pdc/ClientService'
import PhaseService from '../../services/Pdc/PhaseService'
import { Can } from '../../utils/Abilities/can'
function Page(props) {

  const {data, status, refetch} = ClientService.getClients();

  const phaseData = PhaseService.getPhaseForSelect().data;

  const [phaseProperty, setPhaseProperty] = useState([]);

  const [createClientQuery, { isLoading: createClientQueryLoading}] = ClientService.createClients();

  const [updateClientQuery, { isLoading: updateClientQueryLoading}] = ClientService.updateClients();

  const [removeClientQuery, { isLoading: removeClientQueryLoading}] = ClientService.removeClients();

  const [createClientPropertyQuery, { isLoading: createClientPropertyQueryLoading}] = ClientService.createClientsProperty();

  const [OpenCreateModal, SetOpenCreateModal] = useState(false);

  const [openUpdateClient, setOpenUpdateClient] = useState(false);

  const [isSubmit, SetIsSubmit] = useState(false);

  const [OpenPropertyModal, SetOpenPropertyModal] = useState(false);

  const [client_id, setClientID] = useState(null);

  const [clientProperty, setClientProperty] = useState([]);

  const [clientName, setClientName] = useState(null);

  const [clientPropertyForm] = Form.useForm();

  const [updateClientForm] = Form.useForm();

  const { Title } = Typography;

  const [filteredClient, setFilteredClient] = useState([]);

  const [searchStr, setSearchStr] = useState(null);

  const getSelectedPhase = async (phase_id) => {

     const {data} = await Http.get(`/api/phase/get-phase-property/${phase_id}`);

     const result = data.map(row => {
                return {
                    block_number: row.block_number,
                    block_lot_number: row.block_lot_number,
                    label: `Blk ${row.block_number} - lot ${row.block_lot_number}`,
                    value: row.id
                }
            });

        setPhaseProperty(result);
  }

  const getClientProperty = async (client_id) => {

    const {data} = await Http.get(`/api/client/get-client-property/${client_id}`);

    setClientProperty(data);
 }

  const getSelectedProperty = (values) => {

    const selected = phaseProperty.filter(item => {
        return item.value === values;
    })

    clientPropertyForm.setFieldValue('block_number', selected[0].block_number);
    clientPropertyForm.setFieldValue('block_lot_number', selected[0].block_lot_number);
  }

  const onFinish = values => {

       if(createClientQueryLoading) return false;

        SetIsSubmit(true);

        createClientQuery({...values}, {
        onSuccess: (res) => {
  
            message.success('Client Successfuly Created');

            refetch();

            SetIsSubmit(false);
        },
        onError: (e) => {
            let errors = Object.values(e);

            if(errors.length > 0) {
                errors.forEach(v => {
                    message.error(v);
                })
            }

            SetIsSubmit(false);
        }
    })
  }

  const onUpdate = values => {

    if(updateClientQueryLoading) return false;

    SetIsSubmit(true);

    updateClientQuery({...values,clientID: client_id}, {
        onSuccess: (res) => {

            message.success('Client Successfuly Updated');

            refetch();

            SetIsSubmit(false);
        },
        onError: (e) => {

            message.error('Error Updating Client');

            SetIsSubmit(false);
        }
    })
  }

  const onRemove = clientID => {

    if(removeClientQueryLoading) return false;

    removeClientQuery({clientID: clientID}, {
        onSuccess: (res) => {

            message.success('Client Successfuly Removed');

            refetch();

        },
        onError: (e) => {

            message.error('Error Removing Client');

        }
    })
  }

  const SubmitClientProperty = values => {
    if(createClientPropertyQueryLoading) return false;

        SetIsSubmit(true);

        createClientPropertyQuery({...values,client_id: client_id}, {
        onSuccess: (res) => {
            message.success('Property Successfuly Added');
            getClientProperty(client_id)
            SetIsSubmit(false);
        },
        onError: (e) => {
            message.error('Error Adding Property');

            SetIsSubmit(false);
        }
    })
  }

  const DropdownMenu = ({record}) => {
    const menu = (
        <Menu
          items={[
              {
                key: '1',
                label: <Can do="update-client-registration">
                        <Button type='link' onClick={() => {
                        updateClientForm.setFieldValue('client_number', record.client_number)
                        updateClientForm.setFieldValue('first_name', record.first_name)
                        updateClientForm.setFieldValue('middle_name', record.middle_name)
                        updateClientForm.setFieldValue('last_name', record.last_name)
                        updateClientForm.setFieldValue('suffix', record.suffix)
                        updateClientForm.setFieldValue('email', record.email)
                        updateClientForm.setFieldValue('contact_number', record.contact_number)
                        setOpenUpdateClient(true)
                        setClientID(record.id)

                        }}>Update</Button>
                    </Can>,
              },
              {
                key: '2',
                label: <Can do="remove-client-registration">
                        <Button type='link' onClick={() => {
                        if(!confirm('Are you sure you want to remove this client?')) return false;
                            
                        onRemove(record.id);

                    }}>Remove</Button>
                    </Can>,
              },
              {
                key: '3',
                label: <Can do="assign-property-to-client-registration">
                        <Button type='link' onClick={() => {
                        SetOpenPropertyModal(true)
                        setClientID(record.id)
                        getClientProperty(record.id)
                        setClientName(`${record.first_name} ${record.last_name}`)

                        }}>Create/View Property</Button>
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
        setFilteredClient(data);
    }
    
    let filterData = data.filter(v => {
        let clientNumber = v.client_number.toLowerCase();
        let firstName = v.first_name.toLowerCase();
        let email = v.email.toLowerCase();

        if(
            clientNumber.indexOf(searchStr) > -1 ||
            firstName.indexOf(searchStr) > -1 ||
            email.indexOf(searchStr) > -1
        ) {
            return true;
        }

        return false;
    })
    setSearchStr(searchStr);
    setFilteredClient(filterData);
  }

  return (
    <Can do="view-client-registration">
        <h1 className="text-lg tracking-tight font-extrabold text-gray-900 sm:text-xl md:text-2xl">
          <span className="block xl:inline">Client Registration</span>
        </h1>

          <Can do="create-client-registration">
            <Space>

                <Button type="dashed" danger onClick={() => SetOpenCreateModal(true)}>Add Client <PlusOutlined /></Button>

            </Space>
          </Can>
          

          <Input placeholder='Search' onChange={handleSearch} style={{padding: '4px', width: 350,float: 'right'}}/>

          <Table className='mt-2'  loading={status === 'loading'} dataSource={!searchStr ? data : filteredClient} rowKey="id" bordered columns={[
                {
                    title: '#',
                    render: (text, record) => record.id
                },
                {
                    title: 'Client Number',
                    render: (text, record) => record.client_number
                },
                {
                    title: 'First Name',
                    dataIndex: 'first_name',
                    sorter: (a, b) => a.first_name.length - b.first_name.length,
                    render: (text, record) => record.first_name
                },
                {
                    title: 'Middle Name',
                    dataIndex: 'middle_name',
                    sorter: (a, b) => a.middle_name.length - b.middle_name.length,
                    render: (text, record) => record.middle_name
                },
                {
                    title: 'Last Name',
                    dataIndex: 'last_name',
                    sorter: (a, b) => a.last_name.length - b.last_name.length,
                    render: (text, record) => record.last_name
                },
                {
                    title: 'Suffix',
                    dataIndex: 'suffix',
                    sorter: (a, b) => a.suffix.length - b.suffix.length,
                    render: (text, record) => record.suffix
                },
                {
                    title: 'Email Address',
                    dataIndex: 'email',
                    sorter: (a, b) => a.email.length - b.email.length,
                    render: (text, record) => record.email
                },
                {
                    title: 'Contact Number',
                    dataIndex: 'updated_at',
                    sorter: (a, b) => a.contact_number.length - b.contact_number.length,
                    render: (text, record) => record.contact_number
                },
                {
                  title: 'Actions',
                  align: 'center',
                  dataIndex: 'action',
                  render: (text, record) => <DropdownMenu record={record} />
               }
            ]}>

        </Table>

        <Modal title="Create Client" width={800} open={OpenCreateModal} onCancel={() => SetOpenCreateModal(false)} footer={null}>
            
            <Form onFinish={onFinish} layout="vertical" autoComplete="off">
                
                <Row gutter={[5,5]}>
                    <Col md={12}>
                        <Form.Item name="client_number" label="Client Number" rules={[{ required: true, message: 'Client Number is required' }]}>
                            <Input size="large" />
                        </Form.Item>
                    </Col>
                    
                    <Col md={12}>
                        <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: 'First name is required' }]}>
                            <Input size="large" />
                        </Form.Item>
                    </Col>

                    <Col md={12}>
                        <Form.Item name="middle_name" label="Middle Name">
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={12}>
                        <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Last name is required' }]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={12}>
                        <Form.Item name="suffix" label="Suffix Name">
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={12}>
                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email is required',type: 'email'}]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={12}>
                        <Form.Item name="contact_number" label="Contact Number" rules={[
                            { required: true, message: 'Contact Number is required'},
                            {
                                pattern: /^(09|\+639)\d{9}$/,
                                message: 'Please enter a valid Philippine mobile number',
                            },
                            ]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    {/* <Col md={12}>
                      <Form.Item name="phase_id" label="Phase" rules={[{ required: true, message: 'Phase is required' }]}>
                              <Select placeholder=" - " size="large" options={phaseData} onChange={getSelectedPhase}></Select>
                          </Form.Item>
                    </Col>

                    <Col md={12}>
                      <Form.Item name="property_id" label="Phase Property" rules={[{ required: true, message: 'Phase Property is required' }]}>
                              <Select placeholder=" - " size="large" options={phaseProperty}></Select>
                          </Form.Item>
                    </Col> */}

                </Row>
                
                <Button type="dashed" size="large" htmlType="submit" loading={isSubmit} danger>Submit</Button>
                
            </Form>
        </Modal>

        <Modal title="Update Client" width={800} open={openUpdateClient} onCancel={() => setOpenUpdateClient(false)} footer={null}>
            
            <Form onFinish={onUpdate} form={updateClientForm} layout="vertical" autoComplete="off">
                
                <Row gutter={[5,5]}>

                   <Col md={12}>
                        <Form.Item name="client_number" label="Client Number">
                            <Input size="large" readOnly/>
                        </Form.Item>
                    </Col>

                    <Col md={12}>
                        <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: 'First name is required' }]}>
                            <Input size="large" />
                        </Form.Item>
                    </Col>

                    <Col md={12}>
                        <Form.Item name="middle_name" label="Middle Name">
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={12}>
                        <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Last name is required' }]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={12}>
                        <Form.Item name="suffix" label="Suffix Name">
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={12}>
                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email is required',type: 'email'}]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={8}>
                        <Form.Item name="contact_number" label="Contact Number" rules={[
                            { required: true, message: 'Contact Number is required'},
                            {
                                pattern: /^(09|\+639)\d{9}$/,
                                message: 'Please enter a valid Philippine mobile number',
                            },
                            ]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                </Row>
                
                <Button type="dashed" size="large" htmlType="submit" loading={isSubmit} danger>Update</Button>
                
            </Form>
        </Modal>

        <Modal title={<Title level={4}>Client: {clientName}</Title>} width={1300} open={OpenPropertyModal} onCancel={() => SetOpenPropertyModal(false)} footer={null}>

            <Row gutter={[5,5]}>

            <Col md={6}>

                <Card title="Add Client Property" bordered={true}>

                    <Form onFinish={SubmitClientProperty} layout="vertical" form={clientPropertyForm}>
                        <Row gutter={[5,5]}>
                                <Col md={24}>
                                    <Form.Item name="phase_id" label="Phase" rules={[{ required: true, message: 'Phase is required' }]}>
                                            <Select placeholder=" - " size="large" options={phaseData} onChange={getSelectedPhase}></Select>
                                        </Form.Item>
                                    </Col>

                                    <Col md={24}>
                                    <Form.Item name="property_id" label="Phase Property" rules={[{ required: true, message: 'Phase Property is required' }]}>
                                            <Select placeholder=" - " size="large" options={phaseProperty} onChange={getSelectedProperty}>

                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    
                                    <Col md={24}>
                                        <Form.Item name="block_number" label="Blk #">
                                            <Input size="large" readOnly/>
                                        </Form.Item>
                                    </Col>

                                    <Col md={24}>
                                        <Form.Item name="block_lot_number" label="Lot #">
                                            <Input size="large" readOnly/>
                                        </Form.Item>
                                    </Col>
                            </Row>

                            <Button type="dashed" size="large" htmlType="submit" danger loading={isSubmit}>Submit</Button>
                    </Form>

                    
                </Card>

                </Col>

                <Col md={18}>
                    <Card title="Lists of client property" bordered={true}>

                    <Table className='mt-2' dataSource={clientProperty ?? []} rowKey="id" bordered columns={[
                                {
                                    title: '#',
                                    dataIndex: 'id',
                                },
                                {
                                    title: 'Property #',
                                    dataIndex: 'property_id',
                                    render: (text, record) => record.property_id
                                },
                                {
                                    title: 'Phase #',
                                    dataIndex: 'phase_id',
                                    render: (text, record) => record.phase_id
                                },
                                {
                                    title: 'Phase Name',
                                    dataIndex: 'phase_name',
                                    render: (text, record) => record.phase_name
                                },
                                {
                                    title: 'Blk #',
                                    dataIndex: 'block_lot_number',
                                    render: (text, record) => record.block_lot_number
                                },
                                {
                                    title: 'Lot #',
                                    dataIndex: 'block_number',
                                    render: (text, record) => record.block_number
                                },
                            ]}>

                        </Table>

                    </Card>
                </Col>

            </Row>
            
        </Modal>
    </Can>
  )
}

export default (Page);