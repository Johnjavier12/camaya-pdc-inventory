import React, { useState, useEffect } from 'react'
import { Can } from '../../utils/Abilities/can'

import { Typography, Row, Col, Card , Input, Button, Table, Space, Modal, Form, Select, InputNumber, message, Badge} from 'antd'
import { EditOutlined, SearchOutlined, FileExcelOutlined, LoadingOutlined} from '@ant-design/icons'

import DashboardService from '../../services/Pdc/DashboardService'
import ClientService from '../../services/Pdc/ClientService'
import { currencyFormat } from 'utils/Common'
import { pdcStatus } from '../../services/Pdc/StaticData'
import PdcLocationChart from './Charts/PdcLocationChart'
import YearlyPdcLocation from './Charts/YearlyPdcLocation'

function Page(props) {

  const {data: clientsData, status: clientLoading} = ClientService.getClientsForSelect();

  const [updateClientPdcStatus, { isLoading: updateClientPdcStatusLoading}] = DashboardService.updatePdcStatus();

  const [updateClientPdcStatusMultiple, { isLoading: updateClientPdcStatusMultipleLoading}] = DashboardService.updatePdcStatusMultiple();

  const [filterDailyChecks, { isLoading: filterDailyChecksLoading}] = DashboardService.filterDailyChecks();

  const [filterData, setfilterData] = useState([]);

  const [dailyCheckLoader, setdailyCheckLoader] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState(null);

  const [pdcStatusModal, setPdcStatusModal] = useState(false);

  const [isSubmit, setIsSubmit] = useState(false);

  const [pdcStatusModalForMultiple, setPdcStatusModalForMultiple] = useState(false);

  const [selectedChecks, setSelectedChecks] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [selectedClientName, setClientName] = useState(null);

  const [selectedPdcStatus, setPdcStatus] = useState(null);

  const [pdcStatusForm] = Form.useForm();

  const { Text } = Typography;

  const [pdcLocaltionLabels, setPdcLocaltionLabels] = useState([]);

  const [pdcLocaltionValues, setPdcLocaltionValues] = useState([]);

  const [pdcLocationLoading, setPdLocationLoading] = useState(false);

  const [pdcYearlyData, setPdcYearlyData] = useState([]);

  const [pdcYearlyLoading, setPdcYearlyLoading] = useState(false);

  const filterType = [
    { label: 'Client' , value: 'client'},
    { label: 'Status' , value: 'status'}
  ];

  const getSelectedFilter = value => {
    setSelectedFilter(value)
  }

  const getSelectedClient = value => {

    let client = clientsData.filter(v => v.value === value);

    setClientName(client[0].label)
  }

  const getSelectedStatus = value => {
    setPdcStatus(value)
  }

  const filterChecks = () => {

    if(filterDailyChecksLoading) return false;

      filterDailyChecks({ filterType: selectedFilter, client: selectedClientName, status:  selectedPdcStatus}, {
        onSuccess: (res) => {
            setfilterData(res.data)
        },
        onError: (e) => {

          console.log(e);
        }
    })
  }

  const fetchData = async () => {
  
    if (!selectedFilter) {

      let data = await DashboardService.getDailyChecks();

      setfilterData(data)

    } else {

      filterChecks();

    }

    setdailyCheckLoader(false);
 }

 const applyFilter = values => {

    if(!values.filterType) return false;

    fetchData();
 }

  useEffect(() => { 

       setdailyCheckLoader(true);

       fetchData();
  }, [])

  const updatePdcStatus = values => {

    if(updateClientPdcStatusLoading) return false;

        setIsSubmit(true);

        updateClientPdcStatus({...values}, {
        onSuccess: (res) => {
            
            message.success('Pdc Status Successfuly Updated')

            fetchData();

            setIsSubmit(false);
            setPdcStatusModal(false);
        },
        onError: (e) => {

            message.error('Error Updating PDC')

            setIsSubmit(false);
        }
    })
  }

  const updatePdcStatusMultiple = values => {
    
     const postData = {...values, items: selectedChecks}

     if(updateClientPdcStatusMultipleLoading) return false;

     setIsSubmit(true);

        updateClientPdcStatusMultiple(postData, {
        onSuccess: (res) => {
            
          message.success('Pdc Status Successfuly Updated')

          fetchData();

          setSelectedRowKeys([]);
          setSelectedChecks([]);
          setIsSubmit(false);
          setPdcStatusModalForMultiple(false);
        },
        onError: (e) => {

          message.error('Error Updating PDC')

          setIsSubmit(false);
        }
    })
  }

  const onSelectRows = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedChecks({data: selectedRows, keys: selectedRowKeys});
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectRows,
    getCheckboxProps: (record) => ({
      disabled: record.status === 'TRANSACTED'
    }),
  };

  const exportExcel = () => {

      DashboardService.downloadDailyChecks({ filterType: selectedFilter, client: selectedClientName, status:  selectedPdcStatus});
  }

  const ShowFormBaseOnFilter = () => {

     if(!selectedFilter) return null;

     if(selectedFilter === 'client') {
        return (
          <Col md={5}>
              <Form.Item name="client">
                  <Select style={{width: '100%'}} placeholder=" - " onChange={getSelectedClient} size="large" loading={clientLoading === 'loading'} options={clientsData}></Select>
              </Form.Item>
              
          </Col>
        );
     }

     if(selectedFilter === 'status') {
        return (
          <Col md={5}>
            <Form.Item name="status">
              <Select style={{width: '100%'}} placeholder=" - " onChange={getSelectedStatus} size="large" options={pdcStatus}></Select>
            </Form.Item>
          </Col>
        );
     }

  }

  const fetchPdcPerlocation = async () => {

      let data = await DashboardService.getPdcAmountLocation();

      let labels = data.map(label => label.pdc_location);

      let values = data.map(value => value.total_amount);

      setPdcLocaltionLabels(labels)
      setPdcLocaltionValues(values)
      setPdLocationLoading(false)
      
  }

  const fetchPdcYearly = async (year) => {

    let data = await DashboardService.getPdcYearly(year);

    setPdcYearlyData(data);
    setPdcYearlyLoading(false);
  }

  const getYearOptions = () => {
    
      let current_year = new Date().getFullYear();
      let end_year = new Date().getFullYear() + 20;
      let options = [];
      for( let i = current_year; i <= end_year; i++  ) {
          options.push({value: i, label: i});
      }
      return options;
  }

  const defaultYear = new Date().getFullYear();

  const selectedYear = value => {
     setPdcYearlyLoading(true);

     fetchPdcYearly(value);
  }

  useEffect(() => {
    setPdcYearlyLoading(true);

    fetchPdcYearly(defaultYear);
  }, []);

  useEffect(() => {
    setPdLocationLoading(true)

    fetchPdcPerlocation();
  }, [])

  return (
    <Can do="view-dashboard">
        <h1 className="text-lg tracking-tight font-extrabold text-gray-900 sm:text-xl md:text-2xl">
          <span className="block xl:inline">Dashboard</span>
        </h1>
     
            <Row gutter={[16,16]}>

              <Col md={10}>

              <Card style={{boxShadow:'-4px 15px 24px 10px rgba(0,0,0,0.05)', border: 'none'}}>
                
                <h1 className="text-lg tracking-tight font-bold text-gray-500 sm:text-lg md:text-lg">
                   <span className="block xl:inline">PDC Per Location</span>
                </h1>

                  <PdcLocationChart loading={pdcLocationLoading.toString()} labels={pdcLocaltionLabels} values={pdcLocaltionValues}/>

              </Card>
     
              </Col>

              
              <Col md={14}>

              <Card style={{boxShadow:'-4px 15px 24px 10px rgba(0,0,0,0.05)', border: 'none'}}>
                <h1 className="text-lg tracking-tight font-bold text-gray-500 sm:text-lg md:text-lg">
                    <span className="block xl:inline">Yearly PDC Per Location</span>
                </h1>

                <Select
                    defaultValue={defaultYear}
                    style={{ width: 160 }}
                    options = {getYearOptions()}
                    onChange={selectedYear}
                />

                  <YearlyPdcLocation loading={pdcYearlyLoading.toString()} data={pdcYearlyData}/>

                </Card>
              </Col>

              <Col sm={24}>
                <Card style={{boxShadow:'-4px 15px 24px 10px rgba(0,0,0,0.05)', border: 'none'}}>
                  <h1 className="text-lg tracking-tight font-bold text-gray-500 sm:text-lg md:text-lg">
                    <span className="block xl:inline">Daily Checks</span>
                  </h1>
    
              <Form onFinish={applyFilter} layout="vertical" autoComplete="off">
                  <Row gutter={[5,0]}>
                    
                        <Col md={5}>
                           <Form.Item name="filterType" rules={[{ required: true, message: 'Filter type is required' }]}>
                              <Select style={{width: '100%'}} placeholder="Select Filter" onChange={getSelectedFilter} size="large" options={filterType}></Select>
                           </Form.Item>
                        </Col>
                          
                          <ShowFormBaseOnFilter />
                        
                        <Col md={5}>
                            <Button type="dashed" htmlType="submit" danger loading={filterDailyChecksLoading}>Apply Filter<SearchOutlined /></Button>
                        </Col>

                     </Row>

                  </Form>
                  
                  <Can do="update-daily-check-status-in-dashboard">
                    <Button type="dashed" className="mb-3 ml-3" danger onClick={() => {

                      if(!selectedChecks.keys.length) {
                        message.warning('No items selected!');
                        return false;
                      }

                      setPdcStatusModalForMultiple(true);

                      }} style={{float: 'right'}}> Update Status <Badge style={{marginLeft: '4px'}} count={selectedChecks.keys.length ?? 0} /></Button>

                  </Can>
                  
                  <Can do="export-daily-checks-in-dashboard">
                    <Button type="dashed" className="mb-3" danger onClick={exportExcel} style={{float: 'right'}}>Export<FileExcelOutlined /></Button>
                  </Can>
                 
                  <Table className='mt-2' dataSource={filterData} loading={dailyCheckLoader} rowKey="id" bordered columns={[
                          {
                              title: 'PDC No.',
                              sorter: (a, b) => a.id - b.id,
                              render: (text, record) => record.pdc_number
                          },
                          {
                              title: 'Client No.',
                              render: (text, record) => record.client_number
                          },
                          {
                              title: 'Client Name',
                              render: (text, record) => `${record.first_name} ${record.last_name}`
                          },
                          {
                            title: 'Amount',
                            render: (text, record) => currencyFormat(parseFloat(record.amount).toFixed(2))
                          },
                          {
                            title: 'Check Date',
                            render: (text, record) => record.check_date
                          },
                          {
                            title: 'Check No.',
                            render: (text, record) => record.check_number
                          },
                          {
                            title: 'Status',
                            render: (text, record) => record.status
                          },
                          {
                            title: 'Transaction Date',
                            render: (text, record) => record.transaction_date
                          },
                          {
                            title: 'Action',
                            align: 'center',
                            render: (text, record) => {
                              return (
                                <Space size="small">
                                    <Button type="dashed" disabled={record.status === 'TRANSACTED' ?? false} size="small" onClick={() => {

                                        pdcStatusForm.setFieldValue('client_name', `${record.first_name} ${record.last_name}`);
                                        pdcStatusForm.setFieldValue('check_number', record.check_number);
                                        pdcStatusForm.setFieldValue('check_date', record.check_date);
                                        pdcStatusForm.setFieldValue('amount_paid', record.amount);
                                        pdcStatusForm.setFieldValue('check_number', record.check_number);
                                        pdcStatusForm.setFieldValue('pdc_id', record.id);
                                        pdcStatusForm.setFieldValue('client_id', record.client_id);
                                        pdcStatusForm.setFieldValue('bank_id', record.client_bank_id);
                                        
                                        setPdcStatusModal(true);

                                      }} danger><EditOutlined/></Button>

                                  </Space>
                              );
                            }
                          },
                      ]}
                      
                      expandable={{
                        expandedRowRender: (record) => (
                          <Row gutter={[10,20]}>
                              <Col md={8} style={{boxShadow:'-4px 15px 24px 10px rgba(0,0,0,0.05)', border: 'none'}}>
                                  <Card title="Check Details">
                                       <Space.Compact direction="vertical">

                                          <p>Bank: <strong>{record.bank_name}</strong></p>
                                          <p>Account Number: <strong>{record.account_number}</strong></p>
                                          <p>Payment Details: <strong>{record.payment_details}</strong></p>
                                          <p>Remarks: <strong>{record.remarks}</strong></p>

                                       </Space.Compact>
                                  </Card>
                              </Col>
                              <Col md={16} style={{boxShadow:'-4px 15px 24px 10px rgba(0,0,0,0.05)', border: 'none'}}>
                                  <Card title="Client Payment History">
                                    <Table className='mt-2' dataSource={record.payment_history ?? []} rowKey="id" bordered columns={[
                                          {
                                              title: '#',
                                              sorter: (a, b) => a.id - b.id,
                                              render: (text, record) => record.id
                                          },
                                          {
                                              title: 'Phase',
                                              render: (text, record) => record.phase_code
                                          },
                                          {
                                              title: 'Block',
                                              render: (text, record) => record.block_number
                                          },
                                          {
                                            title: 'Lot',
                                            render: (text, record) => record.block_lot_number
                                          },
                                          // {
                                          //   title: 'Bank',
                                          //   render: (text, record) => record.bank_name
                                          // },
                                          // {
                                          //   title: 'Account Number',
                                          //   render: (text, record) => record.account_number
                                          // },
                                          {
                                            title: 'Check Date',
                                            render: (text, record) => record.check_date
                                          },
                                          {
                                            title: 'Check Number',
                                            render: (text, record) => record.check_number
                                          },
                                          {
                                            title: 'Amount',
                                            render: (text, record) => record.amount_paid
                                          },
                                          {
                                            title: 'Status',
                                            render: (text, record) => record.status
                                          },
                                      ]}>
                                      
                                    </Table>
                                  </Card>
                              </Col>
                          </Row>
                        ),
                        rowExpandable: (record) => record.id !== 'Not Expandable',
                      }}

                      rowSelection={rowSelection}

                      summary={(pageData) => {
                        let totalAmount = 0.00;

                        pageData.forEach(({amount}) => {
                           totalAmount += parseFloat(amount);
                        })

                        return (
                          <>
                            <Table.Summary.Row>
                              <Table.Summary.Cell index={0} colSpan={5}>Grand Total</Table.Summary.Cell>
                              <Table.Summary.Cell index={1}>
                                <Text type="danger">{currencyFormat(totalAmount.toFixed(2))}</Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={2} colSpan={5}></Table.Summary.Cell>
                            </Table.Summary.Row>
                          </>
                        );
                      }}
                      >

                  </Table>
                </Card> 
              </Col>

            </Row>
        
          <Modal title="Update PDC Status" centered open={pdcStatusModal} onCancel={() => setPdcStatusModal(false)} footer={null}>

           <Form onFinish={updatePdcStatus} form={pdcStatusForm} layout="vertical" autoComplete="off">
                
                <Row gutter={[5,5]}>

                 <Col md={24}>
                        <Form.Item name="client_name" label="Client Name">
                            <Input size="large" readOnly/>
                        </Form.Item>
                    </Col>

                    <Col md={12}>
                        <Form.Item name="check_number" label="Check Number">
                            <Input size="large" readOnly/>
                        </Form.Item>
                    </Col>

                    <Col md={12}>
                        <Form.Item name="check_date" label="Check Date">
                            <Input size="large" type="date" readOnly/>
                        </Form.Item>
                    </Col>

                    <Col md={24}>
                        <Form.Item name="amount_paid" label="Amount">
                            <InputNumber style={{width: '100%'}} size="large" readOnly/>
                        </Form.Item>
                    </Col>
                    

                    <Col md={12}>       
                        <Form.Item name="status" label="PDC Status"  rules={[{ required: true, message: 'Status is required'}]}>
                           <Select placeholder=" - " size="large" options={pdcStatus}></Select>
                        </Form.Item>
                    </Col>
                    
                    <Col md={12}>
                        <Form.Item name="transaction_date" label="Transaction Date" rules={[{ required: true, message: 'Transaction date is required'}]}>
                            <Input size="large" type="date"/>
                        </Form.Item>
                    </Col>

                    <Col md={24}>       
                        <Form.Item name="payment_details" label="Payment Details" rules={[{ required: true, message: 'Payment details is required'}]}>
                            <Input size="large"/>
                        </Form.Item>
                    </Col>

                    <Form.Item name="pdc_id">
                        <Input size="large" hidden/>
                    </Form.Item>
                    <Form.Item name="client_id">
                        <Input size="large" hidden/>
                    </Form.Item>
                    <Form.Item name="bank_id">
                        <Input size="large" hidden/>
                    </Form.Item>

                </Row>
                
                <Button type="dashed" size="large" htmlType="submit" loading={isSubmit} danger>Submit</Button>
                
            </Form>
        </Modal>

        <Modal title="Update PDC Status" width={1300} centered open={pdcStatusModalForMultiple} onCancel={() => setPdcStatusModalForMultiple(false)} footer={null}>
              <Row gutter={[5,5]}>
                   <Col md={8}>
                      <Card title="Update Status Form">
                        <Form onFinish={updatePdcStatusMultiple} layout="vertical" autoComplete="off">
                            <Row gutter={[5,5]}>
                            <Col md={12}>       
                                  <Form.Item name="status" label="PDC Status"  rules={[{ required: true, message: 'Status is required'}]}>
                                    <Select placeholder=" - " size="large" options={pdcStatus}></Select>
                                  </Form.Item>
                              </Col>
                              
                              <Col md={12}>
                                  <Form.Item name="transaction_date" label="Transaction Date" rules={[{ required: true, message: 'Transaction date is required'}]}>
                                      <Input size="large" type="date"/>
                                  </Form.Item>
                              </Col>

                              <Col md={24}>       
                                  <Form.Item name="payment_details" label="Payment Details" rules={[{ required: true, message: 'Payment details is required'}]}>
                                      <Input size="large"/>
                                  </Form.Item>
                              </Col>
                            </Row>

                            <Button type="dashed" size="large" htmlType="submit" loading={isSubmit} danger>Submit</Button>
                        </Form>
                      </Card>
                   </Col>

                   <Col md={16}>
                        <Card title="Selected Items">

                            <Table className='mt-2' dataSource={selectedChecks.data ?? []} rowKey="id" bordered columns={[
                                  {
                                      title: 'PDC No.',
                                      sorter: (a, b) => a.id - b.id,
                                      render: (text, record) => record.pdc_number
                                  },
                                  {
                                      title: 'Client No.',
                                      render: (text, record) => record.client_number
                                  },
                                  {
                                      title: 'Client Name',
                                      render: (text, record) => `${record.first_name} ${record.last_name}`
                                  },
                                  {
                                    title: 'Amount',
                                    render: (text, record) => currencyFormat(parseFloat(record.amount).toFixed(2))
                                  },
                                  {
                                    title: 'Check Date',
                                    render: (text, record) => record.check_date
                                  },
                                  {
                                    title: 'Check No.',
                                    render: (text, record) => record.check_number
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