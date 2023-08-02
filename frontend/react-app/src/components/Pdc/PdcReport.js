import React, { useState } from 'react'

import { Row, Col , Input, Button, Table, Form, Select, message} from 'antd'
import { SearchOutlined, FileExcelOutlined} from '@ant-design/icons'

import ClientService from '../../services/Pdc/ClientService'
import ReportService from '../../services/Pdc/ReportService'

import { currencyFormat } from 'utils/Common'
import { Can } from '../../utils/Abilities/can'
import { pdcStatus } from '../../services/Pdc/StaticData'

function Page(props) {

  const [filterData, setfilterData] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState(null);

  const [selectedClient, setSelectedClient] = useState(null);

  const {data: clientsData, status: clientLoading} = ClientService.getClientsForSelect();

  const [pdcReportQuery, {isLoading: pdcReportQueryLoading}] = ReportService.filterPdcReport();

  const [filterFormData] = Form.useForm();

  const filterType = [
    { label: 'By Client' , value: 'client'},
    { label: 'By Date' , value: 'date'},
    { label: 'By Status' , value: 'status'},
  ];

  const getSelectedFilter = value => {
     setSelectedFilter(value)
  }

  const applyFilter = values => {

     if(!selectedFilter) return false;

     if(selectedFilter === 'client') {
        let clientName = clientsData.filter(d => d.value === values.client)
        
        values.client = clientName[0].label;

        setSelectedClient(clientName[0].label);
     }

     if(pdcReportQueryLoading) return false;

      pdcReportQuery({...values}, {
          onSuccess: (res) => {
             setfilterData(res.data);
          },
          onError: (e) => {
              console.log(e);
          }
      })
  }

  const exportData = () => {

     if(!selectedFilter) return false;

        ReportService.downloadReport({ 
          filterType: selectedFilter,
          status: filterFormData.getFieldValue('status'),
          client: selectedClient,
          date: filterFormData.getFieldValue('date')
        });

    }

  const FilterForm = () => {

     if(!selectedFilter) return null;

     if(selectedFilter === 'client') {
       return (
        <Col md={5}>
            <Form.Item name="client">
                  <Select style={{width: '100%'}} placeholder=" - " size="large" loading={clientLoading === 'loding'} options={clientsData}></Select>
            </Form.Item>
        </Col> 
       );
     }

     if(selectedFilter === 'date') {
        return (
          <Col md={5}>
            <Form.Item name="date">
                  <Input type="date" size="large"/>
            </Form.Item>
          </Col> 
        );
     }

     if(selectedFilter === 'status') {
       return (
        <Col md={5}>
            <Form.Item name="status">
                <Select style={{width: '100%'}} placeholder=" - " size="large" options={pdcStatus}></Select>
            </Form.Item>
        </Col> 
       );
     }

  } 

  return (
    <Can do="view-pdc-report">
         <h1 className="text-lg tracking-tight font-extrabold text-gray-900 sm:text-xl md:text-2xl">
          <span className="block xl:inline">Pdc Report</span>
        </h1>

        <Form onFinish={applyFilter} form={filterFormData} layout="vertical" autoComplete="off">

          <Row gutter={[5,0]}>

                <Col md={5}>
                     <Form.Item name="filterType" rules={[{ required: true, message: 'Filter type is required' }]}>
                         <Select style={{width: '100%'}} placeholder="Select Filter" onChange={getSelectedFilter} size="large" options={filterType}></Select>
                    </Form.Item>
                </Col>
              
              <FilterForm />

            <Col md={5}>
              <Button type="dashed" danger htmlType="submit">Apply Filter<SearchOutlined /></Button>
            </Col>

          </Row>

        </Form>


        <Can do="export-pdc-report">
          <Button type="dashed" className="mb-3" danger onClick={exportData} style={{float: 'right'}}>Export<FileExcelOutlined /></Button>
        </Can>
        
        <Table className='mt-2' dataSource={filterData ?? []} loading={pdcReportQueryLoading} rowKey="id" bordered columns={[
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
            ]}>

        </Table>
    </Can>
  )
}

export default (Page);