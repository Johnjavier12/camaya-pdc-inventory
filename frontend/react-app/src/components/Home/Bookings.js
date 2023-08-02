import React, { useState, useEffect } from 'react'
import { DatePicker, Select, Table, Button, Dropdown, Menu, Space, Form, Modal, Input, Tag, message } from 'antd'
import moment from 'moment'
import BookingService from 'services/Booking/BookingService'
import {CalendarOutlined, DownOutlined} from '@ant-design/icons'

function Page() {

    const [selectedDate, setSelectedDate] = useState(moment());
    const [bookings, setBookings] = useState([]);
    const [confirmBookingModal, setConfirmBookingModal] = useState(false);

    const [getBookingsQuery, { isLoading: getBookingsQueryIsLoading, reset: getBookingsQueryReset }] = BookingService.getBookings();
    const [confirmBookingQuery, { isLoading: confirmBookingQueryIsLoading, reset: confirmBookingQueryReset }] = BookingService.confirmBooking();
    const [filteredBookings, setFilteredBookings] = useState([]);

    const [confirmBookingForm] = Form.useForm();
    const [updateBookingForm] = Form.useForm();
    const [updateBookingModal, setUpdateBookingModal] = useState(false);
    // const [updateBookingQuery, { isLoading: updateBookingQueryIsLoading, reset: updateBookingQueryReset }] = BookingService.updatePassengerDetails();
    // const [getPassengersByReferenceNumber, { isLoading: getPassengersByReferenceNumberIsLoading, reset: getPassengersByReferenceNumberQueryReset }] = BookingService.getPassengersByReferenceNumber();
    


    const handleSearch = (e) => {
        const searchInput = e.target.value;
        
        if(getBookingsQueryIsLoading){
            return;
        }

        if(searchInput.trim() === ''){
            setFilteredBookings(bookings);
        }
        else{
            
            const filteredBookings = bookings.filter((booking) =>
            `${booking.booking_reference_number}`
                .toLowerCase()
                .includes(searchInput.toLowerCase())
            );
            setFilteredBookings(filteredBookings);
        }
       
    };

    useEffect( () => {

        if (selectedDate) {
            getBookings();
        }

    }, [selectedDate]);

    const getBookings = () => {
        getBookingsQuery({
            date: selectedDate
        }, {
            onSuccess: (res) => {
                console.log(res)
                setBookings(res.data);
                setFilteredBookings(res.data);
            },
            onError: (e) => {
                console.log(e)
            }
        })
    }

    const updateTrip = (values) => {
        let ans = confirm("Are you sure you want to confirm passenger booking?");

        if(ans){

        }
    }

    const confirmTrip = (values) => {
        let ans = confirm("Are you sure you want to confirm passenger booking?");

        // console.log(values);
        // return false;

        if (ans) {
            // alert(ref_no);

            if (confirmBookingQueryIsLoading) {
                return false;
            }

            confirmBookingQuery({
                ...values
            }, {
                onSuccess: (res) => {
                    if (res.data){
                        message.success("Booking trip confirmed.");
                        getBookings();
                        confirmBookingForm.resetFields();
                        setConfirmBookingModal(false);
                    }  
                },
                onError: (e) => {
                    message.error("Failed to confirm booking trip.");
                    confirmBookingQueryReset();
                }
            })
        }
    }

    const DropdownMenu = ({record}) => {
        
        const menu = (
            <Menu
              items={[
                // {
                //   label: <Button type='link' disabled={record.trip.status === 'cancelled'} size="small" onClick={() => cancelTrip(record.ticket.reference_number)}>Cancel Trip</Button>,
                //   key: '0',
                // },
                {
                  label: <Button type='link' disabled={record.ticket_status === 'cancelled' || record.ticket_status === 'voided' || record.payment_status === 'paid'} size="small" onClick={() => {
                    confirmBookingForm.setFieldsValue({ group_reference_number: record.booking_reference_number });
                    setConfirmBookingModal(true);
                  }}>Confirm Booking</Button>,
                  key: '0',
                },
                // {
                //   type: 'divider',
                // },
                // {
                //   label: <Button type='link' onClick={() => {
                //     updateBookingForm.setFieldsValue({ group_reference_number: record.booking_reference_number });
                //     setUpdateBookingModal(true);
                //   }}>View</Button>,
                //   key: '1',
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

    return <>

        <h1 className="text-lg tracking-tight font-extrabold text-gray-900 sm:text-xl md:text-2xl">
          <span className="block xl:inline">Passenger Bookings</span>
        </h1>

        <div>
            <Space>
                <DatePicker value={selectedDate} onChange={(e) => setSelectedDate(e)} />

                <Input placeholder='Search by book reference number'
                        onChange={handleSearch} style={{padding: '4px', width: 300}}/>

            </Space>
       
        {/* <Select style={{width: 400}} onChange={(e) => setSelectedSchedule(e)}>
            {
                schedules && schedules.map( (i,k) => {
                    return <Select.Option key={k} value={i.id}>(TRIP-{i.id}) {i.origin_code}-{i.destination_code} {moment(i.trip_date+' '+i.start_time).format('hA')} - {moment(i.trip_date+' '+i.end_time).format('hA')} | {i.status}</Select.Option>
                })
            }
        </Select> */}


        <Modal
            title="Confirm Booking | Payment Details"
            visible={confirmBookingModal}
            onCancel={() => setConfirmBookingModal(false)}
            onOk={ () => confirmBookingForm.submit() }
            confirmLoading={confirmBookingQueryIsLoading}
        >
            <Form
                form={confirmBookingForm}
                layout='vertical'
                onFinish={confirmTrip}
                initialValues={{
                    mode_of_payment: 'cash',
                    status: 'checked_in'
                }}
            >

                <Form.Item name="group_reference_number" style={{display: 'none'}}>
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

        

        <Table className='mt-2' dataSource={filteredBookings ?? []} rowKey="booking_reference_number" columns={[
                {
                    title: 'Booking Ref. #',
                    render: (text, record) => record.booking_reference_number
                },
                {
                    title: 'Ticket Status',
                    render: (text, record) => record.ticket_status
                },
                {
                    title: 'Payment Status',
                    render: (text, record) => record.payment_status
                },
                {
                    title: 'Trip Date',
                    render: (text, record) => <div style={{width:110, display: 'flex', alignItems:'center'}}><CalendarOutlined className='mr-1'/> {record.trip_date}</div>
                },
                {
                    title: 'Trip #',
                    render: (text, record) => record.trips.map( i => {
                        return <Tag>{i.trip_number} ({i.origin_code}-{i.destination_code})</Tag>
                    })
                    //.join(', ')
                },
                {
                    title: 'Total Booking Amount',
                    render: (text, record) => "PHP " + record.total_booking_amount
                },
                {
                    title: 'Total Ticket Count',
                    render: (text, record) => record.total_ticket_count
                },
                {
                    title: 'Actions',
                    render: (text, record) => <DropdownMenu record={record} />
                },
            ]} />
        </div>
    
    </>
}

export default (Page);