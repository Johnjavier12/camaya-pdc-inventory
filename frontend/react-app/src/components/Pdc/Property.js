import React, {useState} from 'react'
import Http from 'utils/Http'
import { Can } from '../../utils/Abilities/can'
import { Typography, Row, Col, Card , Input, Button, Table, Space, Menu, Dropdown, Modal, Form, message} from 'antd'
import { PlusOutlined, DownOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'

import PhaseService from '../../services/Pdc/PhaseService'
import moment from 'moment'

function Page(props) {

  const { data, status, refetch} = PhaseService.getPhase();

  const [createPhaseQuery, { isLoading: createPhaseQueryLoading}] = PhaseService.createPhase();

  const [updatePhaseQuery, { isLoading: updatePhaseQueryLoading}] = PhaseService.updatePhase();

  const [removePhaseQuery, { isLoading: removePhaseQueryLoading}] = PhaseService.removePhase();

  const [createPhasePropertyQuery, { isLoading: createPhasePropertyQueryLoading}] = PhaseService.createPhaseProperty();

  const [updatePhasePropertyQuery, { isLoading: updatePhasePropertyQueryLoading}] = PhaseService.updatePhaseProperty();

  const [removePhasePropertyQuery, { isLoading: removePhasePropertyQueryLoading}] = PhaseService.deletePhaseProperty();
  
  const [OpenCreateModal, SetOpenCreateModal] = useState(false);

  const [openPhaseUpdateModal, setOpenPhaseUpdateModal] = useState(false);
  
  const [OpenPropertyModal, SetOpenPropertyModal] = useState(false);

  const [openPropertyUpdateModal, setOpenPropertyUpdateModal] = useState(false);

  const [isSubmit, SetIsSubmit] = useState(false);

  const [phaseId, SetPhaseId] = useState(null);

  const [propertyId, setPropertyId] = useState(null);

  const [phaseProperty, setPhaseProperty] = useState([]);

  const [phaseName, setPhaseName] = useState(null);

  const [phaseUpdateForm] = Form.useForm();

  const [propertyUpdateForm] = Form.useForm();

  const { Title } = Typography;

  const [searchStr, setSearchStr] = useState(null);

  const [filteredData, setFilteredData] = useState([]);

  const getPhaseProperty = async (phase_id) => {

    const {data} = await Http.get(`/api/phase/get-phase-property/${phase_id}`);
    
    setPhaseProperty(data)
 }

  const onFinish = values => {

      if(createPhaseQueryLoading) return false;

       SetIsSubmit(true);

       createPhaseQuery({...values}, {
        onSuccess: (res) => {

            message.success('Phase Successfully Created');

            refetch();

            SetIsSubmit(false);
        },
        onError: (e) => {

            message.error('Error Creating Phase');

            SetIsSubmit(false);
        }
    })

  }

  const onUpdate = values => {

    if(updatePhaseQueryLoading) return false;

        SetIsSubmit(true);

        updatePhaseQuery({...values, phaseID: phaseId}, {
        onSuccess: (res) => {

            message.success('Phase Successfully Updated');

            refetch();

            SetIsSubmit(false);
        },
        onError: (e) => {

            message.error('Error Updating Phase');

            SetIsSubmit(false);
        }
    })
  }

  const onRemove = phaseID => {

    if(removePhaseQueryLoading) return false;

        removePhaseQuery({phaseID: phaseID}, {
        onSuccess: (res) => {

            message.success('Phase Successfully Deleted');

            refetch();
        },
        onError: (e) => {

            message.error('Error Deleting Phase');
        }
    })
  }

  const CreatePhaseProperty = values => {

    if(createPhasePropertyQueryLoading) return false;

        SetIsSubmit(true);

        createPhasePropertyQuery({...values,phase_id: phaseId}, {
        onSuccess: (res) => {

            message.success('Property Successfuly Created');

            SetIsSubmit(false);
            getPhaseProperty(phaseId)
        },
        onError: (e) => {

            message.error('Error Creating Phase Property');

            SetIsSubmit(false);
        }
    })
  }

  const onUpdateProperty = values => {

    if(updatePhasePropertyQueryLoading) return false;

        SetIsSubmit(true);

        updatePhasePropertyQuery({...values, property_id: propertyId, phase_id: phaseId}, {
        onSuccess: (res) => {

            message.success('Property Successfully Updated');

            getPhaseProperty(phaseId)

            SetIsSubmit(false);
        },
        onError: (e) => {

            message.error('Error Updating Property');

            SetIsSubmit(false);
        }
    })
  }

  const onRemoveProperty = propertyId => {

    if(removePhasePropertyQueryLoading) return false;

     removePhasePropertyQuery({property_id: propertyId}, {
        onSuccess: (res) => {

            message.success('Property Successfully Deleted');

            getPhaseProperty(phaseId)
        },
        onError: (e) => {

            message.error('Error Deleting Property');
        }
    })
  }

  const DropdownMenu = ({record}) => {
    const menu = (
        <Menu
          items={[
              {
                key: '1',
                label: <Can do="update-property">
                    <Button type='link' onClick={() => {
                    phaseUpdateForm.setFieldValue('phase_name', record.phase_name)
                    phaseUpdateForm.setFieldValue('phase_code', record.phase_code)
                    setOpenPhaseUpdateModal(true)
                    SetPhaseId(record.id)

                    }}>Update</Button>
                </Can>,
              },
              {
                key: '2',
                label: <Can do="remove-property">
                    <Button type='link' onClick={() => {
                    if(!confirm('Are you sure you want to delete this phase?')) return false;
                    onRemove(record.id)
                    }}>Remove</Button>
                </Can>,
              },
              {
                key: '3',
                label: <Can do="create-property">
                    <Button type='link' onClick={() => {
                    SetOpenPropertyModal(true)
                    SetPhaseId(record.id)
                    getPhaseProperty(record.id)
                    setPhaseName(record.phase_name)

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
        setFilteredData(data);
    }
    
    let filterData = data.filter(v => {
        let phaseName = v.phase_name.toLowerCase();
        let phaseCode = v.phase_code.toLowerCase();

        if(
            phaseName.indexOf(searchStr) > -1 ||
            phaseCode.indexOf(searchStr) > -1
        ) {
            return true;
        }

        return false;
    })

    setSearchStr(searchStr);
    setFilteredData(filterData);
  }

  return (
    <Can do="view-property">
        <h1 className="text-lg tracking-tight font-extrabold text-gray-900 sm:text-xl md:text-2xl">
          <span className="block xl:inline">Property</span>
        </h1>

            <Can do="create-phase-property">
                <Space>
                <Button type="dashed" danger onClick={() => SetOpenCreateModal(true)}>Create Phase <PlusOutlined /></Button> 
                </Space>
            </Can>
            

            <Input placeholder='Search' onChange={handleSearch} style={{padding: '4px', width: 350,float: 'right'}}/>

            <Table className='mt-2'  loading={status === 'loading'} dataSource={!searchStr ? data : filteredData} rowKey="id" bordered columns={[
                {
                    title: '#',
                    dataIndex: 'id',
                    sorter: (a, b) => a.id - b.id,
                },
                {
                    title: 'Phase Name',
                    dataIndex: 'phase_name',
                    sorter: (a, b) => a.phase_name.length - b.phase_name.length,
                    render: (text, record) => record.phase_name
                },
                {
                    title: 'Phase Code',
                    dataIndex: 'phase_code',
                    sorter: (a, b) => a.phase_code.length - b.phase_code.length,
                    render: (text, record) => record.phase_code
                },
                {
                    title: 'Created At',
                    dataIndex: 'created_at',
                    sorter: (a, b) => a.created_at - b.created_at,
                    render: (text, record) => moment(record.created_at).format('YYYY-MM-DD')
                },
                {
                    title: 'Updated At',
                    dataIndex: 'updated_at',
                    sorter: (a, b) => a.updated_at - b.updated_at,
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

        <Modal title="Create Phase" width={600} open={OpenCreateModal} onCancel={() => SetOpenCreateModal(false)} footer={null}>
            
            <Form onFinish={onFinish} layout="vertical" autoComplete="off">
                
                <Row gutter={[5,0]}>
                    <Col md={24}>
                        <Form.Item name="phase_name" label="Phase Name" rules={[{ required: true, message: 'Phase name is required' }]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={24}>
                        <Form.Item name="phase_code" label="Phase Code" rules={[{ required: true, message: 'Phase code is required' }]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                </Row>
                
                <Button type="dashed" size="large" htmlType="submit" loading={isSubmit} danger>Submit</Button>
                
            </Form>
        </Modal>

        <Modal title="Update Phase" width={600} open={openPhaseUpdateModal} onCancel={() => setOpenPhaseUpdateModal(false)} footer={null}>
            
            <Form onFinish={onUpdate} form={phaseUpdateForm} layout="vertical" autoComplete="off">
                
                <Row gutter={[5,0]}>
                    <Col md={24}>
                        <Form.Item name="phase_name" label="Phase Name" rules={[{ required: true, message: 'Phase name is required' }]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={24}>
                        <Form.Item name="phase_code" label="Phase Code" rules={[{ required: true, message: 'Phase code is required' }]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                </Row>
                
                <Button type="dashed" size="large" htmlType="submit" loading={isSubmit} danger>Update</Button>
                
            </Form>
        </Modal>

        <Modal title="Update Phase Property" centered open={openPropertyUpdateModal} onCancel={() => setOpenPropertyUpdateModal(false)} footer={null}>
            
            <Form onFinish={onUpdateProperty} form={propertyUpdateForm} layout="vertical" autoComplete="off">
                
             <Row gutter={[5,0]}>
                    <Col md={24}>
                        <Form.Item name="block_number" label="Block #" rules={[{ required: true, message: 'Block # is required' }]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={24}>
                        <Form.Item name="block_lot_number" label="Block Lot #" rules={[{ required: true, message: 'Block Lot # is required' }]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={24}>
                        <Form.Item name="address" label="Address">
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={24}>
                        <Form.Item name="street" label="Street">
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                </Row>
                
                <Button type="dashed" size="large" htmlType="submit" loading={isSubmit} danger>Update</Button>
                
            </Form>
        </Modal>

        <Modal title={<Title level={4}>Phase: {phaseName}</Title>} width={1400} open={OpenPropertyModal} onCancel={() => SetOpenPropertyModal(false)} footer={null}>

           <Row gutter={[5,5]}>
               <Col md={6}>
                        <Card title="Add property" bordered={true}>

                            <Form onFinish={CreatePhaseProperty} layout="vertical" autoComplete="off">
                                
                                <Row gutter={[5,0]}>
                                    <Col md={24}>
                                        <Form.Item name="block_number" label="Block #" rules={[{ required: true, message: 'Block # is required' }]}>
                                            <Input size="large"/>
                                        </Form.Item>
                                    </Col>

                                    <Col md={24}>
                                        <Form.Item name="block_lot_number" label="Block Lot #" rules={[{ required: true, message: 'Block Lot # is required' }]}>
                                            <Input size="large"/>
                                        </Form.Item>
                                    </Col>

                                    <Col md={24}>
                                        <Form.Item name="address" label="Address">
                                            <Input size="large"/>
                                        </Form.Item>
                                    </Col>

                                    <Col md={24}>
                                        <Form.Item name="street" label="Street">
                                            <Input size="large"/>
                                        </Form.Item>
                                    </Col>

                                </Row>
                                
                                <Button type="dashed" size="large" htmlType="submit" loading={isSubmit} danger>Submit</Button>
                                
                            </Form>

                        </Card>
                </Col>

               <Col md={18}>
                  <Card title="Lists of phase property" bordered={true}>

                    <Table className='mt-2' dataSource={phaseProperty ?? []} rowKey="id" bordered columns={[
                            {
                                title: '#',
                                dataIndex: 'id',
                                sorter: (a, b) => a.id - b.id,
                            },
                            {
                                title: 'Block #',
                                dataIndex: 'block_number',
                                sorter: (a, b) => a.block_number - b.block_number,
                                render: (text, record) => record.block_number
                            },
                            {
                                title: 'Block Lot #',
                                dataIndex: 'block_lot_number',
                                sorter: (a, b) => a.block_lot_number - b.block_lot_number,
                                render: (text, record) => record.block_lot_number
                            },
                            {
                                title: 'Address',
                                render: (text, record) => record.address
                            },
                            {
                                title: 'Street',
                                render: (text, record) => record.street
                            },
                            {
                                title: 'Created At',
                                dataIndex: 'created_at',
                                sorter: (a, b) => a.created_at - b.created_at,
                                render: (text, record) => moment(record.created_at).format('YYYY-MM-DD')
                            },
                            {
                                title: 'Updated At',
                                dataIndex: 'updated_at',
                                sorter: (a, b) => a.updated_at - b.updated_at,
                                render: (text, record) => moment(record.updated_at).format('YYYY-MM-DD')
                            },
                            {
                                title: 'Actions',
                                align: 'center',
                                render: (text, record) => {
                                    return (
                                        <Space size="small">
                                            <Button type="dashed" size="small" onClick={() => {

                                                propertyUpdateForm.setFieldValue('block_number', record.block_number)
                                                propertyUpdateForm.setFieldValue('block_lot_number', record.block_lot_number)
                                                propertyUpdateForm.setFieldValue('address', record.address)
                                                propertyUpdateForm.setFieldValue('street', record.street)

                                                setPropertyId(record.id)
                                                setOpenPropertyUpdateModal(true)
    
                                            }} danger><EditOutlined/></Button>
                                            <Button type="dashed" danger size="small" onClick={() => {
    
                                                if(!confirm('Are you sure you want to delete this property')) return false

                                                onRemoveProperty(record.id)
    
                                            }}><DeleteOutlined/></Button>
                                        </Space>
                                    );
                                }
                            }
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