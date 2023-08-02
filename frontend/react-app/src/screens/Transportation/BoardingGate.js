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
import ScheduleService from 'services/Transportation/ScheduleService'
import MagicLeafLogo from 'assets/magic-leaf-logo.png'

import InterfaceLayout from 'layouts/Main/InterfaceLayout';

import { Typography, Row, Col, Descriptions, Alert, Progress, Input, Select, Space, Tag, message, Card } from 'antd'

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
        if (value.length == 12) {
            const code = (value).toUpperCase();
            if (!props.selectedTrip) {
                message.info('Select a trip to use the boarding gate interface.');
            } else {
                props.handleScan(code);
            }
            setQRCode(null);
        }
    }

    return (
        <Input
            // prefix="G-"
            value={QRCode}
            maxLength={12}
            ref={ref}
            onChange={(e)=>handleInputChange(e.target.value)}
            onBlur={()=>ref.current.focus()}
            size="large"
            style={{width: 300, textTransform: 'uppercase'}}
            placeholder="Type Ticket Ref no. here"
        />
    )
}

const ScanDescription = ({details, timeLeft}) => {

    if (!details) {
        return <></>
    }

    return (
        <>
        <Alert className="my-4" type="success" message={`Your ticket has been used.`} />
        <Descriptions
            bordered={true}
            column={2}
        >
            <Descriptions.Item span={2} label="Seat #"><h1>{details.trip.seat_number} <Tag color="purple">Boarded</Tag></h1></Descriptions.Item>
            <Descriptions.Item span={2} label="Passenger">{details.last_name}, {details.first_name} | {details.age} | {details.nationality}</Descriptions.Item>

            <Descriptions.Item label="Vehicle">{details.trip.schedule.transportation.name}</Descriptions.Item>
            <Descriptions.Item label="Trip date">{details.trip.schedule.trip_date}</Descriptions.Item>
            <Descriptions.Item label="Origin">{details.trip.schedule.route.origin.name}</Descriptions.Item>
            <Descriptions.Item label="Destination">{details.trip.schedule.route.destination.name}</Descriptions.Item>

            <Descriptions.Item label="Ticket ref #">{details.ticket.reference_number}</Descriptions.Item>
            <Descriptions.Item label="Booking ref #">{details.ticket.group_reference_number}</Descriptions.Item>
        </Descriptions>

        <span>This will disappear in {timeLeft} seconds.</span>
        <Progress percent={timeLeft * timeLeft} showInfo={false} />
        {/* <Alert className="my-4" type="warning" message={`Details will disappear in ${timeLeft} seconds.`} /> */}
        </>
    )
}

function Page(props) {

    // console.log(props);

    const [QRCode, setQRCode] = React.useState(null);
    const [details, setDetails] = React.useState({});
    const [errorDetails, setErrorDetails] = React.useState({});
    const [scanAndCheck, {isLoading: scanAndCheckIsLoading, error: scanAndCheckError}] = BookingService.boardPassenger();
    const [selectedTrip, setSelectedTrip] = React.useState(props.selectedTrip);
    const [tripStats, setTripStats] = React.useState({
        boarded: 0,
        checked_in: 0,
    });

    const successSfx = new UIfx(successSound);
    const failSfx = new UIfx(failSound);

    // const [timer, setTimer] = React.useState(null);
    const [timeLeft, setTimeLeft] = React.useState(null);

    const scheduleListQuery = ScheduleService.list(moment().format('YYYY-MM-DD'));

    const clearDetails = () => {
        console.log('details cleared');
        setDetails({});
        setErrorDetails({});
        setQRCode(null);
    }

    React.useEffect(() => {
        // console.log(props.selectedTrip);
        const exists = _.find(scheduleListQuery.data, i => i.trip_number == props.selectedTrip);

        if (!exists && scheduleListQuery.data) {
            props.dispatch(action.updateSelectedTrip(null));
        }
    },[scheduleListQuery.data]);

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

    React.useEffect(() => {
        // console.log('test');
        if (selectedTrip && scheduleListQuery.data) {
            const _trip = _.find(scheduleListQuery.data, i => i.trip_number == selectedTrip);
            // console.log(_trip);
            if (_trip) {
                setTripStats({
                    boarded: _trip.boarded,
                    checked_in: _trip.checked_in,
                });
            }
        }
        
    },[selectedTrip, scheduleListQuery.data]);

    function incrementBoardedAndCheckedIn() {
        setTripStats(prevState => ({
            ...prevState,
            boarded: prevState.boarded + 1,
            checked_in: prevState.checked_in - 1,
        }));
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
                    reference_number: code,
                    interface: 'boarding_gate',
                    trip_number: selectedTrip, // Trip number here
                    mode: 'boarding',
                }, {
                    onSuccess: (res) => {
                        console.log(res);
                        successSfx.play();
                        setDetails(res.data);
                        setTimeLeft(10);
                        incrementBoardedAndCheckedIn();
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

    const handleError = (e) => {
        console.log(e);
    }

    const handleLoad = (e) => {
        console.log(e);
    }

    const handleTripChange = (val) => {
        setSelectedTrip(val);
        props.dispatch(action.updateSelectedTrip(val));
    }
    
    return (
        <InterfaceLayout {...props}>
            <Typography.Title level={2}><img src={MagicLeafLogo} style={{width: 50, verticalAlign:'text-bottom'}} />Boarding Gate</Typography.Title>

            <Space style={{ display: 'flex', justifyContent: 'space-between'}}>
                <Select size="large" value={selectedTrip} onChange={(val) => handleTripChange(val)} placeholder="Select trip" style={{width: 600}}>
                    <Select.Option value={null}>
                        No trip selected
                    </Select.Option>
                    {
                        scheduleListQuery.data &&
                            Object.keys(_.groupBy(scheduleListQuery.data, i => i.transportation.name)).map( (vehicle) => {
                                return  <Select.OptGroup key={vehicle} label={vehicle}>
                                        {
                                            _.groupBy(scheduleListQuery.data, i => i.transportation.name)[vehicle].map( (i, key) => {
                                                return <Select.Option key={vehicle+key} value={i.trip_number}>
                                                            <Space>
                                                                <strong className="text-primary">{i.start_time} - {i.end_time}</strong>
                                                                <div>[{i.origin} - {i.destination}]</div>
                                                                <span>{i.transportation.name}</span>
                                                                <span>{i.trip_number}</span>
                                                            </Space>
                                                            <div>
                                                                <Space>
                                                                    <div>{i.trip_date}</div>
                                                                    <Tag>{i.status}</Tag>
                                                                </Space>
                                                            </div>
                                                            
                                                        </Select.Option>
                                            })
                                        }
                                        </Select.OptGroup>
                            })
                    }
                </Select>
                <Card className="mb-2" size="small">
                    <Space>
                        {
                            scheduleListQuery.isLoading ?
                            'Loading...' :
                            <>
                                <div>Checked-in: {tripStats.checked_in}</div>
                                <div>Boarded: {tripStats.boarded}</div>
                            </>
                        }
                    </Space>
                </Card>
            </Space>

            <Typography.Title level={3}>Scan your QR Code at the camera</Typography.Title>
            <Row>
                <Col xl={10}>
                    <div style={{width: 500, borderRadius: 12, overflow:'hidden', position:'relative'}}>
                        {/* {
                            timeLeft > 0 && 
                            <div style={{fontSize: '2rem', position: 'absolute', zIndex: '999', background: 'rgba(255,255,255,0.75)', width: '100%', height: '100%', display: 'flex', alignItems:'center', justifyContent:'center'}}>
                                Scan in {timeLeft} seconds
                            </div>
                        } */}
                        <QrReader
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            onLoad={handleLoad}
                            showViewFinder={false}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <Typography.Title className="mt-3" level={3}>Status: {QRCode ? <span className="text-info">Scanned ({QRCode})</span> : <span className="text-warning">Waiting for scan</span>}</Typography.Title>
                    <ScanInput handleScan={handleScan} selectedTrip={selectedTrip} />
                </Col>
                <Col xl={14}>
                    { (!QRCode) &&<Typography.Title>Your details will appear in this section.</Typography.Title>}
                    { scanAndCheckIsLoading && <>Fetching details...</> }
                    {
                        (!scanAndCheckIsLoading) && 
                        <div>
                            {
                                details.id ? 
                                    <>
                                        <Typography.Title level={2} className="text-success">Scan Success!</Typography.Title>
                                        <Typography.Title level={3} className="text-success">Welcome aboard!</Typography.Title>
                                        <ScanDescription details={details} timeLeft={timeLeft} />                            
                                    </>
                                : ''
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
        selectedTrip: state.Trip.selectedTrip,
    }
}

export default connect(mapStateToProps)(Page);