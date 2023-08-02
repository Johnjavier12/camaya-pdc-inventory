import React, { useState } from 'react'
import Http from 'utils/Http'

import { Typography, Row, Col, Card , Input, Button, Table, Space, Menu, Dropdown, Modal, Form, Select, InputNumber, message, Radio} from 'antd'
import { PlusOutlined, DownOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
import { Can } from '../../utils/Abilities/can'
import ClientService from '../../services/Pdc/ClientService'

function Page(props) {
  
  const {data: clientBankData, status: clientStatus, refetch} = ClientService.getClientBank();

  const {data: clients, status: clientloading} = ClientService.getClientsForSelect();

  const [createClientBankQuery, { isLoading: createClientBankQueryLoading}] = ClientService.createClientsBank();

  const [updateClientBankQuery, { isLoading: updateClientBankQueryLoading}] = ClientService.updateClientsBank();

  const [removeClientBankQuery, { isLoading: removeClientBankQueryLoading}] = ClientService.removeClientsBank();

  const [createClientPdcQuery, { isLoading: createClientPdcQueryLoading}] = ClientService.createClientsPdc();

  const [updateClientPdcQuery, { isLoading: updateClientPdcQueryLoading}] = ClientService.updateClientsPdc();

  const [removeClientPdcQuery, { isLoading: removeClientPdcQueryLoading}] = ClientService.removeClientsPdc();

  const [openBankModal, setOpenBankModal] = useState(false);

  const [openUpdateBankModal, setOpenUpdateBankModal] = useState(false);

  const [isSubmit, setIsSubmit] = useState(false);

  const [clientProperty, setClientProperty] = useState([]);

  const [clientBankID, setClientBankID] = useState(null);

  const [clientID, setClientID] = useState(null);

  const [clientAccountNumber, setClientAccountNumber] = useState(null);

  const [clientBankName, setClientBankName] = useState(null);

  const [clientName, setClientName] = useState(null);

  const [openPdcModal,setOpenPdcModal] = useState(false);

  const [bankUpdateForm] = Form.useForm();

  const [pdcForm] = Form.useForm();

  const [pdcSavingType, setPdcSavingType] = useState(null);

  const [clientPdc, setClientPdc] = useState([]);

  const [pdcEditModal, setpdcEditModal] = useState(false);

  const { Title } = Typography;

  const [pdcEditForm] = Form.useForm();

  const [pdcID, setPdcID] = useState(null);

  const [searchStr, setSearchStr] = useState(null);

  const [filteredData, setFilteredData] = useState([]);

  const bankLists = [
    { label: 'Bank of the Philippine Islands', value: 'BPI' },
    { label: 'Philippine National Bank', value: 'PNB' },
    { label: 'BDO Unibank Inc', value: 'BDO' },
    { label: 'Metrobank', value: 'Metrobank' },
    { label: 'LandBank', value: 'LandBank' },
  ];

  const pdcLocation = [
    { label: 'ON HAND', value: 'ON HAND' },
    { label: 'PVB', value: 'PVB' },
    { label: 'CBS', value: 'CBS' },
    { label: 'PBB', value: 'PBB' },
    { label: 'MBTC', value: 'MBTC' },
  ];

  const getClientProperty = async (client_id) => {

    const {data} = await Http.get(`/api/client/get-client-property/${client_id}`);

    const result = data.map(row => {
       return {
        label: `${row.phase_name} - Block ${row.block_number} - lot ${row.block_lot_number}`,
        value: row.id
       }
    })

    setClientProperty(result);
 }

 const getClientPdc = async (client_bank_id) => {

    const {data} = await Http.get(`/api/client/get-client-pdc/${client_bank_id}`);

    setClientPdc(data);
 }

 const handleSelectedClient = client_id => {
   getClientProperty(client_id);
 }

  const submitClientBank = values => {

    if(createClientBankQueryLoading) return false;

        setIsSubmit(true);

        createClientBankQuery({...values}, {
          onSuccess: (res) => {
            
              message.success('Client Bank Successfuly Created')

              refetch()

              setIsSubmit(false);
          },
          onError: (e) => {

              message.success('Error Creating Client Bank')

              setIsSubmit(false);
          }
    })
  }

  const updateClientBank = values => {

    if(updateClientBankQueryLoading) return false;

        setIsSubmit(true);

        updateClientBankQuery({...values, clientBankID: clientBankID}, {
        onSuccess: (res) => {

            message.success('Client Bank Successfuly Updated')

            refetch()

            setIsSubmit(false);
        },
        onError: (e) => {

            message.success('Error Updating Client Bank')

            setIsSubmit(false);
        }
    })
     
  }

  const removeClientBank = clientBankID => {

    if(removeClientBankQueryLoading) return false;

        removeClientBankQuery({clientBankID: clientBankID}, {
        onSuccess: (res) => {

            message.success('Client Bank Successfuly Deleted')

            refetch()
        },
        onError: (e) => {

            message.success('Error Deleting Client Bank')

        }
    })
     
  }

  const getSelectedType = e => {
     setPdcSavingType(e.target.value)
  }

  const createClientPdc = values => {
    if(createClientPdcQueryLoading) return false;

        setIsSubmit(true);

        createClientPdcQuery({...values, client_id: clientID, client_bank_id: clientBankID}, {
        onSuccess: (res) => {
            
            message.success('Client PDC Successfuly Created')

            getClientPdc(clientBankID)

            setIsSubmit(false);
        },
        onError: (e) => {

            message.success('Error Creating Client PDC')

            setIsSubmit(false);
        }
    })
  }

  const updateClientPDC = values => {

    if(updateClientPdcQueryLoading) return false;

        setIsSubmit(true);

        updateClientPdcQuery({...values, pdcID: pdcID}, {
        onSuccess: (res) => {

            message.success('PDC Successfuly Updated')

            getClientPdc(clientBankID)

            setIsSubmit(false);
        },
        onError: (e) => {

            message.success('Error Updating Client PDC')

            setIsSubmit(false);
        }
    })

  }

  const removeClientPdc = pdcID => {

    if(removeClientPdcQueryLoading) return false;

      removeClientPdcQuery({pdcID: pdcID}, {
        onSuccess: (res) => {

            message.success('PDC Successfuly Deleted')

            getClientPdc(clientBankID)
        },
        onError: (e) => {

            message.success('Error Deleting Client PDC')

        }
    })
     
  }

  const DropdownMenu = ({record}) => {
    const menu = (
        <Menu
          items={[
              {
                key: '1',
                label: <Can do="update-pdc-registration">
                    <Button type='link' onClick={() => {
                    bankUpdateForm.setFieldValue('account_number', record.account_number)
                    bankUpdateForm.setFieldValue('amount', record.amount)
                    bankUpdateForm.setFieldValue('bank_name', record.bank_name)
                    bankUpdateForm.setFieldValue('bank_branch', record.bank_branch)
                    bankUpdateForm.setFieldValue('remarks', record.remarks)
                    setOpenUpdateBankModal(true)
                    setClientBankID(record.id)

                    }}>Update</Button>
                </Can>,
              },
              {
                key: '2',
                label: <Can do="remove-pdc-registration">
                    <Button type='link' onClick={() => {
                    if(!confirm('Are you sure you want to delete this bank?')) return false;
                    removeClientBank(record.id);
                    }}>Remove</Button>
                </Can>,
              },
              {
                key: '3',
                label: <Can do="create-pdc-registration">
                    <Button type='link' onClick={() => {
                    const clientName = `${record.first_name} ${record.last_name}`;

                    pdcForm.setFieldValue('client_name', clientName);
                    pdcForm.setFieldValue('client_account_number', record.account_number);
                    setOpenPdcModal(true)
                    setClientName(clientName)
                    setClientID(record.client_id)
                    setClientAccountNumber(record.account_number)
                    setClientBankName(record.bank_name)
                    setClientBankID(record.id)
                    getClientPdc(record.id)

                }}>Register/View PDC</Button>
                </Can>,
              }
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
        setFilteredData(clientBankData);
    }
    
    let filterData = clientBankData.filter(v => {
        let clientNumber = v.client_number.toLowerCase();
        let clientName = `${v.first_name.toLowerCase()} ${v.last_name.toLowerCase()}`;
        let accountNumber = v.account_number.toLowerCase();

        if(
            clientNumber.indexOf(searchStr) > -1 ||
            clientName.indexOf(searchStr) > -1 ||
            accountNumber.indexOf(searchStr) > -1
        ) {
            return true;
        }

        return false;
    })
    setSearchStr(searchStr);
    setFilteredData(filterData);
  }

  return (
    <Can do="view-pdc-registration">
        <h1 className="text-lg tracking-tight font-extrabold text-gray-900 sm:text-xl md:text-2xl">
          <span className="block xl:inline">Pdc Registration</span>
        </h1>

        <Can do="create-client-bank-in-pdc-registration">
            <Space>
                <Button type="dashed" danger onClick={() => setOpenBankModal(true)}>Add Client Bank<PlusOutlined /></Button>
            </Space>
        </Can>
        

        {/* <Button type="dashed" className="mb-3 ml-2" danger onClick={() => alert('Export')} style={{float: 'right'}}>Export<FileExcelOutlined /></Button> */}

        <Input placeholder='Search' onChange={handleSearch} style={{padding: '4px', width: 350,float: 'right'}}/>

        <Table className='mt-2'  loading={clientStatus === 'loading'} dataSource={!searchStr ? clientBankData : filteredData} rowKey="id" bordered columns={[
                {
                    title: 'Client No.',
                    render: (text, record) => record.client_number
                },
                {
                    title: 'Account Number',
                    render: (text, record) => record.account_number
                },
                {
                    title: 'Client Name',
                    render: (text, record) => `${record.first_name} ${record.last_name}`
                },
                {
                    title: 'Phase Code',
                    render: (text, record) => record.phase_code
                },
                {
                    title: 'Block #',
                    render: (text, record) => record.block_number
                },
                {
                    title: 'Lot #',
                    render: (text, record) => record.block_lot_number
                },
                {
                    title: 'Amount',
                    render: (text, record) => record.amount
                },
                {
                  title: 'Bank Name',
                  render: (text, record) => record.bank_name
                },
                {
                    title: 'Bank Branch',
                    render: (text, record) => record.bank_branch
                },
                {
                  title: 'Remarks',
                  render: (text, record) => record.remarks
              },
                {
                  title: 'Actions',
                  align: 'center',
                  dataIndex: 'action',
                  render: (text, record) => <DropdownMenu record={record} />
               }
            ]}>

        </Table>

        <Modal title="Create Client Bank" width={700} open={openBankModal} onCancel={() => setOpenBankModal(false)} footer={null}>
            
            <Form onFinish={submitClientBank} layout="vertical" autoComplete="off">
                
                <Row gutter={[5,5]}>
                    <Col md={24}>
                        <Form.Item name="client_id" label="Client" rules={[{ required: true, message: 'Client is required' }]}>
                            <Select placeholder=" - " size="large" options={clients} loading={clientloading === 'loading'} onChange={handleSelectedClient}></Select>
                        </Form.Item>
                    </Col>

                    <Col md={24}>
                        <Form.Item name="property_id" label="Client Property" rules={[{ required: true, message: 'Property is required' }]}>
                            <Select placeholder=" - " size="large" options={clientProperty}></Select>
                        </Form.Item>
                    </Col>

                    <Col md={24}>
                        <Form.Item name="account_number" label="Account Number" rules={[{ required: true, message: 'Account Number is required' }]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={24}>
                        <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Amount is required'}]}>
                            <InputNumber style={{width: '100%'}} size="large"/>
                        </Form.Item>    
                    </Col>

                    <Col md={24}>
                        <Form.Item name="bank_name" label="Bank Name" rules={[{ required: true, message: 'Bank name is required' }]}>
                            <Select placeholder=" - " size="large" options={bankLists}></Select>
                        </Form.Item>
                    </Col>

                    <Col md={24}>
                        <Form.Item name="bank_branch" label="Bank Branch" rules={[{ required: true, message: 'Bank Branch is required'}]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={24}>
                        <Form.Item name="remarks" label="Remarks">
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                </Row>
                
                <Button type="dashed" size="large" htmlType="submit" loading={isSubmit} danger>Submit</Button>
                
            </Form>
        </Modal>

        <Modal title="Update Client Bank" width={700} open={openUpdateBankModal} onCancel={() => setOpenUpdateBankModal(false)} footer={null}>
            
            <Form onFinish={updateClientBank} form={bankUpdateForm} layout="vertical" autoComplete="off">
                
                <Row gutter={[5,5]}>

                    <Col md={24}>
                        <Form.Item name="account_number" label="Account Number" rules={[{ required: true, message: 'Account Number is required' }]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={24}>
                        <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Amount is required'}]}>
                            <InputNumber style={{width: '100%'}} size="large"/>
                        </Form.Item>    
                    </Col>

                    <Col md={24}>
                        <Form.Item name="bank_name" label="Bank Name" rules={[{ required: true, message: 'Bank name is required' }]}>
                            <Select placeholder=" - " size="large" options={bankLists}></Select>
                        </Form.Item>
                    </Col>

                    <Col md={24}>
                        <Form.Item name="bank_branch" label="Bank Branch" rules={[{ required: true, message: 'Bank Branch is required'}]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Col md={24}>
                        <Form.Item name="remarks" label="Remarks">
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                </Row>
                
                <Button type="dashed" size="large" htmlType="submit" loading={isSubmit} danger>Update</Button>
                
            </Form>
        </Modal>

        <Modal title={
               <Title level={5}>Client Name: {clientName} <br/> Bank Name: {clientBankName} <br/> Account Number: {clientAccountNumber}</Title>
        } width={1500} open={openPdcModal} onCancel={() => setOpenPdcModal(false)} footer={null}>


            <Row gutter={[5,0]}>
                 <Col md={6}>
                     <Card title="Register PDC">
                         
                            <Form onFinish={createClientPdc} form={pdcForm} layout="vertical" autoComplete="off">
                                <Row gutter={[5,5]}>
                                    <Col md={24}>
                                        <Form.Item name="client_name" label="Client Name">
                                            <Input size="large" readOnly/>
                                        </Form.Item>
                                    </Col>
                                    <Col md={24}>
                                        <Form.Item name="client_account_number" label="Account Number">
                                            <Input size="large" readOnly/>
                                        </Form.Item>
                                    </Col>
                                    <Col md={24}>
                                         <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Type is required'}]}>
                                            <Radio.Group buttonStyle="solid" onChange={getSelectedType}>
                                                <Radio.Button value="range">Range</Radio.Button>
                                                <Radio.Button value="percheck">Per Check</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>

                                    {
                                      (pdcSavingType && pdcSavingType === 'range') ?
                                        <>
                                            <Col md={24}>
                                               <Form.Item name="check_number_from" label="Check Number From" rules={[
                                                { required: true, message: 'Check Number From is required'},
                                               ]}>
                                                    <Input type="number" size="large"/>
                                                </Form.Item>
                                            </Col>
                                            <Col md={24}>
                                                <Form.Item name="check_number_to" label="Check Number To" rules={[
                                                    { required: true, message: 'Check Number To is required'},
                                                ]}>
                                                    <Input type="number" size="large"/>
                                                </Form.Item>
                                            </Col>

                                            <Col md={24}>
                                                <Form.Item name="check_date_from" label="Start Check Date" rules={[{ required: true, message: 'Check Date From is required'}]}>
                                                    <Input size="large" type="date"/>
                                                </Form.Item>
                                            </Col>

                                            <Col md={24}>
                                                <Form.Item name="date_recieved" label="Date Received">
                                                    <Input size="large" type="date" rules={[{ required: true, message: 'Date received is required!'}]}/>
                                                </Form.Item>
                                            </Col>

                                            <Col md={24}>
                                                <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Amount is required'}]}>
                                                    {/* <Input size="large"/> */}
                                                    <InputNumber style={{width: '100%'}} size="large"/>
                                                </Form.Item>
                                            </Col>

                                            <Col md={24}>
                                                <Form.Item name="pdc_location" label="PDC Location" rules={[{ required: true, message: 'PDC Location is required'}]}>
                                                   <Select placeholder=" - " size="large" options={pdcLocation}></Select>
                                                </Form.Item>
                                            </Col>
                                        </>
                                        : null
                                    }

                                   {
                                      (pdcSavingType && pdcSavingType === 'percheck') ?
                                          <>
                                             <Col md={24}>
                                                    <Form.Item name="check_number" label="Check Number" rules={[{ required: true, message: 'Check Number is required'}]}>
                                                        <Input type="number" size="large"/>
                                                    </Form.Item>
                                            </Col>

                                            <Col md={24}>
                                                    <Form.Item name="check_date" label="Check Date" rules={[{ required: true, message: 'Check Date is required'}]}>
                                                        <Input size="large" type="date"/>
                                                    </Form.Item>
                                            </Col>
                                            
                                            <Col md={24}>
                                                <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Amount is required'}]}>
                                                    {/* <Input size="large"/> */}
                                                    <InputNumber style={{width: '100%'}} size="large"/>
                                                </Form.Item>
                                            </Col>

                                            <Col md={24}>
                                                <Form.Item name="date_received" label="Date Received">
                                                    <Input size="large" type="date"/>
                                                </Form.Item>
                                            </Col>

                                            <Col md={24}>
                                                <Form.Item name="pdc_location" label="PDC Location" rules={[{ required: true, message: 'PDC Location is required'}]}>
                                                    <Select placeholder=" - " size="large" options={pdcLocation}></Select>
                                                </Form.Item>
                                            </Col>
                                          </>
                                          
                                        : null
                                    }
                                </Row>

                                <Button type="dashed" size="large" htmlType="submit" loading={isSubmit} danger>Submit</Button>
                            </Form>
                         

                     </Card>
                 </Col>

                 <Col md={18}>
                     <Card title="Lists of client PDC">
                     <Table className='mt-2' dataSource={clientPdc ?? []} rowKey="id" bordered columns={[
                        {
                            title: 'PDC No.',
                            sorter: (a, b) => a.pdc_number - b.pdc_number,
                            render: (text, record) => record.pdc_number
                        },
                        {
                            title: 'Check No.',
                            render: (text, record) => record.check_number
                        },
                        {
                            title: 'Check Date',
                            render: (text, record) => record.check_date
                        },
                        {
                            title: 'Amount',
                            render: (text, record) => record.amount
                        },
                        {
                            title: 'Date Received',
                            render: (text, record) => record.date_recieved
                        },
                        {
                            title: 'PDC Location',
                            render: (text, record) => record.pdc_location
                        },
                        {
                            title: 'Payment Details',
                            render: (text, record) => record.payment_details
                        },
                        {
                            title: 'Status',
                            render: (text, record) => record.status
                        },
                        {
                            title: 'Actions',
                            align: 'center',
                            render: (text, record) => {
                                return (
                                    <Space size="small">
                                        <Button type="dashed" disabled={record.status === 'TRANSACTED' ?? false} size="small" onClick={() => {

                                            pdcEditForm.setFieldValue('check_number', record.check_number)
                                            pdcEditForm.setFieldValue('check_date', record.check_date)
                                            pdcEditForm.setFieldValue('amount', record.amount)
                                            pdcEditForm.setFieldValue('date_recieved', record.date_recieved)
                                            pdcEditForm.setFieldValue('pdc_location', record.pdc_location)
                                            pdcEditForm.setFieldValue('payment_details', record.payment_details)

                                            setPdcID(record.id)
                                            setpdcEditModal(true)

                                        }} danger><EditOutlined/></Button>
                                        <Button type="dashed" disabled={record.status === 'TRANSACTED' ?? false} danger size="small" onClick={() => {

                                            if(!confirm('Are you sure you want to delete this PDC')) return false

                                            removeClientPdc(record.id)

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

        <Modal title="Edit PDC" centered open={pdcEditModal} onCancel={() => setpdcEditModal(false)} footer={null}>
           <Form onFinish={updateClientPDC} form={pdcEditForm} layout="vertical" autoComplete="off">
                
                <Row gutter={[5,5]}>

                    <Col md={12}>
                        <Form.Item name="check_number" label="Check Number" rules={[{ required: true, message: 'Check Number is required' }]}>
                            <Input size="large" readOnly/>
                        </Form.Item>
                    </Col>
                    <Col md={12}>
                        <Form.Item name="check_date" label="Check Date" rules={[{ required: true, message: 'Check Date is required' }]}>
                            <Input size="large" type="date"/>
                        </Form.Item>
                    </Col>

                    <Col md={12}>
                        <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Amount is required' }]}>
                            {/* <Input size="large"/> */}
                            <InputNumber style={{width: '100%'}} size="large"/>
                        </Form.Item>
                    </Col>
                    <Col md={12}>
                        <Form.Item name="date_recieved" label="Date Received">
                            <Input size="large" type="date"/>
                        </Form.Item>
                    </Col>

                    <Col md={12}>
                        <Form.Item name="pdc_location" label="PDC Location" rules={[{ required: true, message: 'PDC Location is required' }]}>
                            <Select placeholder=" - " size="large" options={pdcLocation}></Select>
                        </Form.Item>
                    </Col>
                    <Col md={12}>
                        <Form.Item name="payment_details" label="Payment Details">
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                </Row>
                
                <Button type="dashed" size="large" htmlType="submit" loading={isSubmit} danger>Update</Button>
                
            </Form>
        </Modal>
    </Can>
  )
}

export default (Page);