import React, {useRef} from 'react'

import QrReader from 'react-qr-reader'
import UIfx from 'uifx'
import successSound from 'assets/success.mp3'
import failSound from 'assets/fail.mp3'

import BookingService from 'services/Booking/BookingService'
import CamayaLogo from 'assets/camaya-logo.png'
import InterfaceLayout from 'layouts/Main/InterfaceLayout';

import { Typography, Row, Col, Descriptions, Alert, Progress, Input } from 'antd'

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
            onBlur={()=>ref.current.focus()}
            size="large"
            style={{width: 300, textTransform: 'uppercase'}}
            placeholder="Type Guest Ref no. here"
        />
    )
}

const Description = ({details, pass, timeLeft}) => {

    return (
        <>
        <Alert className="my-4" type="success" message={`Your ${pass&&pass.type} has been used.`} />
        <Descriptions
            bordered={true}
            column={2}
        >
            <Descriptions.Item label="Guest ref #">{details.reference_number}</Descriptions.Item>
            <Descriptions.Item label="Booking ref #">{details.booking_reference_number}</Descriptions.Item>
            <Descriptions.Item label="Guest name">{details.first_name} {details.last_name}</Descriptions.Item>
            <Descriptions.Item label="Snack Pack Left">{pass.count}</Descriptions.Item>
        </Descriptions>

        <span>This will disappear in {timeLeft} seconds.</span>
        <Progress percent={timeLeft * timeLeft} showInfo={false} />
        {/* <Alert className="my-4" type="warning" message={`Details will disappear in ${timeLeft} seconds.`} /> */}
        </>
    )
}

function Page(props) {

    const [QRCode, setQRCode] = React.useState(null);
    const [details, setDetails] = React.useState({});
    const [errorDetails, setErrorDetails] = React.useState({});
    const [scanAndCheck, {isLoading: scanAndCheckIsLoading, error: scanAndCheckError}] = BookingService.scanAndCheck();

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
                    interface: 'snack_pack_redemption',
                    mode: 'redeem',
                }, {
                    onSuccess: (res) => {
                        console.log(res);
                        successSfx.play();
                        setDetails({
                            data: res.data.details,
                            pass: res.data.pass
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

    const handleError = (e) => {
        console.log(e);
    }

    const handleLoad = (e) => {
        console.log(e);
    }
    
    return (
        <InterfaceLayout {...props}>
            <Typography.Title level={2}><img src={CamayaLogo} style={{width: 180, verticalAlign:'text-bottom'}} />Snack Pack Redemption</Typography.Title>

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
                    <ScanInput handleScan={handleScan} />
                </Col>
                <Col xl={14}>
                    { (!QRCode) &&<Typography.Title>Your details will appear in this section.</Typography.Title>}
                    { scanAndCheckIsLoading && <>Fetching details...</> }
                    {
                        (!scanAndCheckIsLoading && (details.pass && details.pass.type)) && 
                        <div>
                            <Typography.Title level={2} className="text-success">Scan Success!</Typography.Title>
                            <Typography.Title level={3} className="text-success">You may get your Snack Pack!</Typography.Title>
                            <div className="mb-2">Here are your details.</div>
                            {
                                details.pass && <Description pass={details.pass} details={details.data} timeLeft={timeLeft} />
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

export default (Page);