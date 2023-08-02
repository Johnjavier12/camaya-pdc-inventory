import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {connect} from 'react-redux'

import { Typography, Table, Form, DatePicker, Button, Row, Col, Space } from 'antd'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { queryCache } from 'react-query'
import _ from 'lodash'

import ReportService from 'services/Booking/ReportService'
import useFetch from 'hooks/use-fetch'

import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


function Page(props) {
    const [form] = Form.useForm();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const reportQuery = ReportService.getSales;
    const downloadReport = ReportService.salesDownload;

    const reportList = reportQuery(startDate, endDate);


    const columns = [        
        {
            title: 'Booking Reference No.',
            dataIndex: 'group_reference_number',
            className: 'border-bottom',
        },
        {
            title: 'Trip Details',
            dataIndex: 'trip_details',
            className: 'border-bottom',    
        },
        {
            title: 'Total Ticket Count',
            dataIndex: 'total_ticket_count',
            className: 'border-bottom',
        },
        {
            title: 'Payment Provider',
            dataIndex: 'payment_provider',
            className: 'border-bottom',
        },
        {
            title: 'Payment Reference No.',
            dataIndex: 'payment_reference_number',
            className: 'border-bottom',
        },
        {
            title: 'Amount',
            dataIndex: 'total_booking_amount',
            className: 'border-bottom',
        }
    ];

    const onFilter = (values) => {
        if (!values.date) {
            setStartDate('');
            setEndDate('');

            return;
        }

        setStartDate(values.date[0].format('YYYY-MM-DD'));
        setEndDate(values.date[1].format('YYYY-MM-DD'));
    }

    const onDownload = () => {        
        downloadReport(startDate, endDate);
    }    

    const onReload = () => {
        if (! startDate || ! endDate) {
            return;
        }

        queryCache.invalidateQueries(['reports', '1bits-sales-report', startDate, endDate]);
    }

    
    return (
        <>
            <Typography.Title level={4}>Sales Report</Typography.Title>

            <Row justify="center" className="my-3">
                    <Col>
                        <Form
                            form={form}
                            onFinish={onFilter}
                            layout="inline"
                        >
                            <Form.Item name="date" label="Select Date">
                                <DatePicker.RangePicker />
                            </Form.Item>
                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        View Report
                                    </Button>
                                    <Button type="primary" icon={<ReloadOutlined />} onClick={onReload} />
                                    <Button type="primary"
                                        disabled={reportList?.data 
                                            && reportList?.data.length  
                                            ? false 
                                            : true
                                        }
                                        icon={<DownloadOutlined />}
                                        onClick={onDownload}
                                        >
                                        Download
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>

                <Table
                    loading={reportList.status === 'loading'}
                    columns={columns}
                    dataSource={reportList?.data || []}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    bordered
                />
        </>
  )
}

export default (Page);