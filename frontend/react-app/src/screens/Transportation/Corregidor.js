import React, {useRef} from 'react'
import moment from 'moment-timezone'
moment.tz.setDefault('Asia/Manila');
import QrReader from 'react-qr-reader'
import UIfx from 'uifx'
import successSound from 'assets/success.mp3'
import failSound from 'assets/fail.mp3'
import {connect} from 'react-redux'
import * as action from 'store/actions'

import BookingService from 'services/Booking/BookingService'

import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

import CamayaLogo from 'assets/camaya-logo.png'
import InterfaceLayout from 'layouts/Main/InterfaceLayout';

import { Typography, Row, Col, Descriptions, Alert, Progress, Input, Select, Space, Tag, message, Card, Button, Modal, Table, Popconfirm, DatePicker } from 'antd'
import { LoadingOutlined, PrinterOutlined } from '@ant-design/icons';

// const relay = new USBRelay();

const ScanInput = (props) => {

    const ref = useRef(null);
    const [QRCode, setQRCode] = React.useState(null);

    React.useEffect(() => {
        if (ref.current) {
            ref.current.focus();
            setTimeout(() => ref.current.focus(), 1000);
        }
    },[]);

    const handleInputChange = (value) => {
        // console.log(value);
        setQRCode(value);
        if (value.length == 8) {
            const code = (value).toUpperCase();
            props.handleScan(code);
            setQRCode(null);
        }
    }

    return (
        <Input
            // prefix="G-"
            value={QRCode}
            maxLength={8}
            ref={ref}
            onChange={(e)=>handleInputChange(e.target.value)}
            onBlur={()=> (props.listModalOpen == false ? ref.current.focus() : null)}
            size="large"
            style={{width: 300, textTransform: 'uppercase'}}
            placeholder="Type Guest Ref no. here"
        />
    )
}

const ScanDescription = ({details, pass, timeLeft}) => {

    return (
        <>
        <Alert className="my-4" type="success" message={`Your ${pass&&pass.type} has been used.`} />
        <Descriptions
            bordered={true}
            column={2}
        >
            <Descriptions.Item span={2} label="Guest">{details.last_name}, {details.first_name} | {details.age} | {details.nationality}</Descriptions.Item>

            <Descriptions.Item label="Guest ref #">{details.reference_number}</Descriptions.Item>
            <Descriptions.Item label="Booking ref #">{details.booking_reference_number}</Descriptions.Item>
        </Descriptions>

        <span>This will disappear in {timeLeft} seconds.</span>
        <Progress percent={timeLeft * timeLeft} showInfo={false} />
        {/* <Alert className="my-4" type="warning" message={`Details will disappear in ${timeLeft} seconds.`} /> */}
        </>
    )
}

const ListModal = (props) => {

    const [search, setSearch] = React.useState('');

    const corregidorGuestsQuery = BookingService.corregidorGuests(moment(props.selectedDate).format('YYYY-MM-DD'));

    // React.useEffect( () => {
    //     if (search) {
    //     }
    // }, [search]);

    const handleRedemption = (data) => {
        props.handleScan(data.guest_reference_number);
    }

    return <Modal
            visible={props.listModalOpen}
            onCancel={()=>props.setListModalOpen(false)}
            footer={null}
            width={900}
            title={<>Guest {moment(props.selectedDate).format('YYYY-MM-DD')}</>}
        >
            <Space>
                <Input type="search" style={{width: '100%'}} placeholder='Search Guest' onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())} />
                <ExcelFile filename={`Corregidor_Guests_${moment(props.selectedDate).format('YYYY-MM-DD')}_${moment().format('YYYY-MM-DD HH:mm:ss')}`} element={<Button><PrinterOutlined/></Button>}>
                    <ExcelSheet data={corregidorGuestsQuery.data} name="corregidor_guests">
                        <ExcelColumn label="Booking #" value="booking_reference_number"/>
                        <ExcelColumn label="Guest #" value="guest_reference_number"/>
                        {/* <ExcelColumn label="Guest" value={ col =>`${col.guest.first_name} ${col.guest.last_name} `}/> */}
                        <ExcelColumn label="First name" value={ col =>`${col.guest.first_name || ''}`}/>
                        <ExcelColumn label="Last name" value={ col =>`${col.guest.last_name || ''}`}/>
                        <ExcelColumn label="Status" value={ col => col.status }/>
                    </ExcelSheet>
                </ExcelFile>
            </Space>

            <Table
                rowKey="id"
                columns={[
                    {
                        title: 'Booking #',
                        render: (text, record) => record.booking_reference_number
                    },
                    {
                        title: 'Guest #',
                        render: (text, record) => record.guest_reference_number
                    },
                    {
                        title: 'First name',
                        render: (text, record) => record.guest?.first_name ?? ''
                    },
                    {
                        title: 'Last name',
                        render: (text, record) => record.guest?.last_name ?? ''
                    },
                    {
                        title: 'Guest type',
                        render: (text, record) => record.guest?.type ?? ''
                    },
                    {
                        title: 'Action',
                        render: (text, record) => 
                        <Popconfirm title="Are you sure" disabled={record.status == 'consumed' || record.booking.status == 'pending'} okText="Yes" cancelText="No" onConfirm={()=>handleRedemption(record)}>
                            {
                                record.status == 'consumed' ? 'Boarded' : (record.booking.status == 'pending' ? 'Pending' : <Button>Redeem</Button>)
                            }
                        </Popconfirm>
                    }
                ]}
                    loading={corregidorGuestsQuery.isFetching || corregidorGuestsQuery.isLoading}
                    dataSource={corregidorGuestsQuery.data ? corregidorGuestsQuery.data.filter(
                        (i) => {
                            if ((i.guest.first_name && i.guest.last_name)
                                && (i.guest.first_name.toLowerCase()+" "+i.guest?.last_name.toLowerCase()).indexOf(search) >= 0) {
                                return true
                            }
                        }
                    ) : []
                }
                />
    </Modal>
}

function Page(props) {

    // console.log(props);

    const [QRCode, setQRCode] = React.useState(null);
    const [details, setDetails] = React.useState({});
    const [passStats, setPassStats] = React.useState({
        available: 0,
        used: 0
    });
    const [errorDetails, setErrorDetails] = React.useState({});

    const [listModalOpen, setListModalOpen] = React.useState(false);


    const [scanAndCheck, {isLoading: scanAndCheckIsLoading, error: scanAndCheckError}] = BookingService.scanAndCheck();
    const [corregidorPassesQuery, {isLoading: corregidorPassesQueryIsLoading, error: corregidorPassesQueryError}] = BookingService.corregidorPasses();

    const [selectedDate, setSelectedDate] = React.useState(moment());

    const successSfx = new UIfx(successSound);
    const failSfx = new UIfx(failSound);

    // const [timer, setTimer] = React.useState(null);
    const [timeLeft, setTimeLeft] = React.useState(null);

    const clearDetails = () => {
        console.log('details cleared');
        setDetails({});
        setErrorDetails({});
        setQRCode(null);
    }

    React.useEffect( () => {
        updateStats();
    }, []);

    React.useEffect( () => {
        updateStats();
    }, [selectedDate]);

    React.useEffect( () => {
        if (listModalOpen) {
            
        }
    }, [listModalOpen]);

    React.useEffect(() => {

        let timer;

        if (timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft( prev => prev - 1);
                // timer();
            }, 1000);
        }

        if (timeLeft <= 0) {
            clearDetails();
        }

        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer);
    },[timeLeft]);

    const updateStats = () => {
        corregidorPassesQuery({
            date: selectedDate
        }, {
            onSuccess: (res) => {
                console.log(res);
                setPassStats(res.data);
            },
            onError: (e) => {
                console.log(e);
            }
        });
    }

    const handleScan =  (code) => {
        // console.log(data);
        if (code) {            
            setQRCode(code);

            if (QRCode !== code) {
                // setTimer(null);
                // clearTimeout(timer);
                setDetails({});
                setErrorDetails({});

                scanAndCheck({
                    code: code,
                    interface: 'boarding_gate',
                    // trip_number: selectedTrip, // Trip number here
                    type: 'Corregidor Access',
                    mode: 'access',
                }, {
                    onSuccess: (res) => {
                        // console.log(res);
                        updateStats();
                        successSfx.play();
                        setDetails({
                            data: res.data.details,
                            pass: res.data.pass,
                            stat: res.data.stat
                        });
                        setTimeLeft(10);
                        // setTimer(setTimeout(() => clearDetails(), 10000));
                    },
                    onError: (e) => {
                        console.log(e);
                        failSfx.play(1);
                        setErrorDetails(e);
                        setTimeLeft(10);
                        // setTimer(setTimeout(() => clearDetails(), 10000));
                    }
                })
            } else {
                console.log('Same code...');
            }
        }
    }
    
    return (
        <InterfaceLayout {...props}>
            <Typography.Title level={2}><img src={CamayaLogo} style={{width: 180, verticalAlign:'text-bottom'}} />Corregidor</Typography.Title>

            {
                listModalOpen && <ListModal listModalOpen={listModalOpen} selectedDate={selectedDate} handleScan={handleScan} setListModalOpen={setListModalOpen} />
            }

            <Typography.Title level={3}>Scan your QR Code</Typography.Title>
            <Row gutter={[8,8]}>
                <Col xl={10}>
                    {
                        listModalOpen == false ? <ScanInput handleScan={handleScan} listModalOpen={listModalOpen} /> : ''
                    }
                    <Card size='small' title={<>
                            Guests of 
                            <DatePicker className='ml-2' value={selectedDate} onChange={ e => setSelectedDate(e)} allowClear={false} />
                        </>} className='mt-4'>
                        <Row gutter={[16, 16]}>
                            <Col xl={24}>
                                <strong>Total bookings:</strong> {corregidorPassesQueryIsLoading ? <LoadingOutlined/> : passStats.available}
                            </Col>
                            <Col xl={24}>
                                <div className='ml-2'>Adult: {corregidorPassesQueryIsLoading ? <LoadingOutlined/> : passStats.adult}</div>
                                <div className='ml-2'>Kid: {corregidorPassesQueryIsLoading ? <LoadingOutlined/> : passStats.kid}</div>
                                <div className='ml-2'>Infant: {corregidorPassesQueryIsLoading ? <LoadingOutlined/> : passStats.infant}</div>
                            </Col>
                            <Col xl={24} className='mt-2'>
                                <strong>Boarded:</strong> {corregidorPassesQueryIsLoading ? <LoadingOutlined/> : passStats.used}
                            </Col>
                            <Col xl={24} className='mt-2'>
                                <strong>No show:</strong> {corregidorPassesQueryIsLoading ? <LoadingOutlined/> : '-'}
                            </Col>
                        </Row>
                    </Card>
                    <Button type="primary" className='mt-2' onClick={()=>setListModalOpen(true)}>Guest List</Button>
                </Col>
                <Col xl={14}>
                    { (!QRCode) &&<Typography.Title>Your details will appear in this section.</Typography.Title>}
                    { scanAndCheckIsLoading && <>Fetching details...</> }
                    {
                        (!scanAndCheckIsLoading && (details.pass && details.pass.type)) && 
                        <div>
                            <Typography.Title level={2} className="text-success">Scan Success!</Typography.Title>
                            <Typography.Title level={3} className="text-success">Welcome aboard!</Typography.Title>
                            {
                                (details.pass) && <ScanDescription pass={details.pass} details={details.data} timeLeft={timeLeft} />
                            }
                        </div>
                    }
                    { (errorDetails && errorDetails.message) && 
                        <>
                            <Typography.Title className="text-danger">{errorDetails.message}</Typography.Title>

                            <span>This will disappear in {timeLeft} seconds.</span>
                            <Progress percent={timeLeft * timeLeft} showInfo={false} />
                            {/* <Alert className="my-4" type="warning" message={`This will disappear in ${timeLeft} seconds.`} /> */}
                        </>
                    }
                </Col>
            </Row>
        </InterfaceLayout>
    )
    
}

const mapStateToProps = (state) => {
    return {
        data: []
    }
}

export default connect(mapStateToProps)(Page);