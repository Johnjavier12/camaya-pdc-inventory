import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {connect} from 'react-redux'

import { Typography, Row, Col, Card, DatePicker, Select, Table, Space, Button, Menu, Dropdown, message, Form, Modal, Input } from 'antd'
import { QrcodeOutlined, DownOutlined, PrinterOutlined } from '@ant-design/icons'
import moment from 'moment'
import BookingService from 'services/Booking/BookingService'
import useFetch from 'hooks/use-fetch'

import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function Page(props) {

    const [confirmPassengerForm] = Form.useForm();
    const [searchValue, setSearchValue] = useState('');
    const [confirmPassengerModal, setConfirmPassengerModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [schedules, setSchedules] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [getTripsByDateQuery, { isLoading: getTripsByDateQueryIsLoading, reset: getTripsByDateQueryReset }] = BookingService.getTripsByDate();
    const [getPassengersByDateQuery, { isLoading: getPassengersByDateQueryIsLoading, reset: getPassengersByDateQueryReset }] = BookingService.getPassengersByDate();
    const [filteredPassengers, setFilteredPassengers] = useState([]);
   
    const [cancelTripQuery, { isLoading: cancelTripQueryIsLoading, reset: cancelTripQueryReset }] = BookingService.cancelTrip();
    const [confirmTripQuery, { isLoading: confirmTripQueryIsLoading, reset: confirmTripQueryReset }] = BookingService.confirmTrip();
    const [boardPassengerQuery, { isLoading: boardPassengerQueryIsLoading, reset: boardPassengerQueryQueryReset }] = BookingService.boardPassengerAdmin();
    const [noShowPassengerQuery, { isLoading: noShowPassengerQueryIsLoading, reset: noShowPassengerQueryQueryReset }] = BookingService.noShowPassenger();

    // const {data, isLoading, error} = useFetch(`/api/one-bits/get-passengers-by-date2/${selectedDate.format('YYYY-MM-DD')}`);

    useEffect( () => {

        getTripsByDate();
        getPassengersByDate();

    }, [selectedDate, selectedSchedule])

    const getTripsByDate = () => {
        if (getTripsByDateQueryIsLoading) {
            return false;
        }

        getTripsByDateQuery({
            date: selectedDate
        }, {
            onSuccess: (res) => {
                console.log(res)
                setSchedules(res.data)
            },
            onError: (e) => {
                console.log(e)
            }
        })
    }

    const getPassengersByDate = () => {
        getPassengersByDateQuery({
            date: selectedDate,
            schedule: selectedSchedule
        }, {
            onSuccess: (res) => {
                console.log(res)
                setPassengers(res.data)
                setFilteredPassengers(res.data);
            },
            onError: (e) => {
                console.log(e)
            }
        })
    }

    const cancelTrip = (ref_no) => {
        let ans = confirm("Are you sure you want to cancel passenger trip?");

        if (ans) {
            // alert(ref_no);

            if (cancelTripQueryIsLoading) {
                return false;
            }

            cancelTripQuery({
                reference_number: ref_no,
            }, {
                onSuccess: (res) => {
                    message.success("Passenger trip cancelled.");
                    getPassengersByDate();
                },
                onError: (e) => {
                    message.error("Failed to cancel passenger trip.");
                }
            })
        }
    }

    const confirmTrip = (values) => {
        let ans = confirm("Are you sure you want to confirm passenger trip?");

        // console.log(values);
        // return false;

        if (ans) {
            // alert(ref_no);

            if (confirmTripQueryIsLoading) {
                return false;
            }

            confirmTripQuery({
                ...values
            }, {
                onSuccess: (res) => {
                    message.success("Passenger trip confirmed.");
                    getPassengersByDate();
                    confirmPassengerForm.resetFields();
                    setConfirmPassengerModal(false);
                },
                onError: (e) => {
                    message.danger("Failed to confirm passenger trip.");
                    confirmTripQueryReset();
                }
            })
        }
    }

    const handleSearch = (e) => {
        const searchInput = e.target.value;
        setSearchValue(searchInput);
    
        if(getPassengersByDateQueryIsLoading){
            return;
        }

        if(searchInput.trim() === ''){
            setFilteredPassengers(passengers);
        }
        else{
            
            const filteredPassengers = passengers.filter((passenger) =>
            `${passenger.first_name} ${passenger.last_name} ${passenger.ticket.group_reference_number} ${passenger.ticket.reference_number}`
                .toLowerCase()
                .includes(searchInput.toLowerCase())
            );
            setFilteredPassengers(filteredPassengers);
        }
       
    };

    const BoardTrip = (reference_number) => {
        let ans = confirm("Are you sure you want to board passenger trip?");

        if(ans) {
            if (boardPassengerQueryIsLoading) {
                return false;
            }

            boardPassengerQuery({
                reference_number: reference_number,
            }, {
                onSuccess: (res) => {
                    message.success(res.data.message);
                    console.log(res);
                    getPassengersByDate();
                },
                onError: (e) => {
                    console.log(e);
                    message.error(e.message);
                }
            })
        }
    };

    const noshowTrip = (reference_number) =>{
        let ans = confirm("Are you sure you want to set the status to no-show?");

        if(ans){
            if (noShowPassengerQueryIsLoading) {
                return false;
            }

            noShowPassengerQuery({
                reference_number: reference_number,
            }, {
                onSuccess: (res) => {
                    message.success(res.data.message);
                    console.log(res);
                    getPassengersByDate();
                },
                onError: (e) => {
                    console.log(e);
                    message.error(e.message);
                }
            })
        }
    }


    const DropdownMenu = ({record}) => {
        
        const menu = (
            <Menu
              items={[
                {
                  label: <Button type='link' disabled={record.trip.status === 'cancelled'} size="small" onClick={() => cancelTrip(record.ticket.reference_number)}>Cancel</Button>,
                  key: '0',
                },
                {
                    label: <Button type='link' size="small" disabled={(record.ticket.status != 'paid') || (record.trip.status === 'boarded') || (record.trip.status === 'no_show')}  onClick={() => BoardTrip(record.ticket.reference_number)}>Board</Button>,
                    key: '1',
                },
                {
                    label: <Button type='link' size="small" disabled={(record.ticket.status != 'paid') || (record.trip.status === 'boarded') || (record.trip.status === 'no_show')} onClick={() => noshowTrip(record.ticket.reference_number)}>No-show</Button>,
                    key: '2',
                }
                // {
                //   label: <Button type='link' disabled={record.trip.status === 'cancelled' || record.trip.status === 'checked_in'} size="small" onClick={() => {
                //     confirmPassengerForm.setFieldsValue({ reference_number: record.ticket.reference_number });
                //     setConfirmPassengerModal(true);
                //   }}>Confirm Trip</Button>,
                //   key: '1',
                // },
                // {
                //   type: 'divider',
                // },
                // {
                //   label: '3rd menu item',
                //   key: '3',
                // },
              ]}
            />
          );
        return <Dropdown overlay={menu} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Actions
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    }

  return (
    <>

        <Modal
            title="Confirm Passenger | Payment Details"
            visible={confirmPassengerModal}
            onCancel={() => setConfirmPassengerModal(false)}
            onOk={ () => confirmPassengerForm.submit() }
        >
            <Form
                form={confirmPassengerForm}
                layout='vertical'
                onFinish={confirmTrip}
                initialValues={{
                    mode_of_payment: 'cash',
                    status: 'checked_in'
                }}
            >

                <Form.Item name="reference_number" style={{display: 'none'}}>
                    <Input type="hidden" disabled />
                </Form.Item>

                <Form.Item name="mode_of_payment" label="Mode of payment">
                    <Select>
                        <Select.Option value="cash">Cash</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="remarks" label="Remarks">
                    <Input.TextArea placeholder='Remarks (e.g.: OR Number, Amount)' />
                </Form.Item>

                <Form.Item name="status" label="Status">
                    <Select>
                        <Select.Option value="checked_in">Checked-in</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>

        <h1 className="text-lg tracking-tight font-extrabold text-gray-900 sm:text-xl md:text-2xl">
          <span className="block xl:inline">Passenger Trips</span>
        </h1>

        <div>
            <Space>
            <DatePicker value={selectedDate} onChange={(e) => setSelectedDate(e)} />

            <Select style={{width: 400}} onChange={(e) => setSelectedSchedule(e)}>
                {
                    schedules && schedules.map( (i,k) => {
                        return <Select.Option key={k} value={i.id}>(TRIP-{i.id}) {i.origin_code}-{i.destination_code} {moment(i.trip_date+' '+i.start_time).format('hA')} - {moment(i.trip_date+' '+i.end_time).format('hA')} | {i.status}</Select.Option>
                    })
                }
            </Select>

            <Input placeholder='Search name or reference number'
                onChange={handleSearch} style={{padding: '4px', width: 300}}/>

            </Space>

            <Table className='mt-2' dataSource={filteredPassengers && filteredPassengers} rowKey="id" columns={[
                {
                    title: 'Booking ref #',
                    render: (text, record) => record.ticket.group_reference_number
                },
                {
                    title: 'Ticket ref #',
                    render: (text, record) => record.ticket.reference_number
                },
                {
                    title: 'First name',
                    render: (text, record) => record.first_name
                },
                {
                    title: 'Last name',
                    render: (text, record) => record.last_name
                },
                {
                    title: 'Age',
                    render: (text, record) => record.age
                },
                {
                    title: 'Nationality',
                    render: (text, record) => record.nationality
                },
                {
                    title: 'Trip',
                    render: (text, record) => `${record.origin_code}-${record.destination_code} ${moment(record.trip_date+" "+record.start_time).format('hA YYYY-MM-DD')}`
                },
                {
                    title: 'Ticket status',
                    render: (text, record) => record.ticket.status
                },
                {
                    title: 'Ticket type',
                    render: (text, record) => record.ticket.ticket_type
                },
                {
                    title: 'Seat #',
                    render: (text, record) => record.trip.seat_number
                },
                {
                    title: 'Trip status',
                    render: (text, record) => record.trip.status
                },
                {
                    title: 'Boarded at',
                    render: (text, record) => record.trip.boarded_at
                },
                {
                    title: 'Action',
                    render: (text, record) => <DropdownMenu record={record} />
                },
            ]} />
        </div>
    </>
  )
}

export default (Page);