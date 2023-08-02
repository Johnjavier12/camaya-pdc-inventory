import React from 'react';
import LoginForm from 'components/Login/Form';

import {Row, Col, Typography, Card} from 'antd';

function Page(props) {

    React.useEffect(() => {
        return () => {
        };
    }, []);

  return (
    <>

        <Row align="middle" justify="center" style={{height: '100vh'}} gutter={[0, 0]}>
            
            {/* <Col xl={5} lg={10} sm={10} xs={22}>
                <Typography.Title level={3} align="center">
                    {process.env.APP_NAME}
                    <small style={{display: 'block', opacity: '0.5'}}>PDC Control Panel</small>
                </Typography.Title>
            </Col> */}
            <Col xl={8} lg={10} sm={10} xs={22}>
                <Card title="[STG] - PDC Control Panel" bordered={true} style={{boxShadow:'-4px 15px 24px 10px rgba(0,0,0,0.05)',textAlign: 'center'}}>
                    <LoginForm {...props} />
                </Card>
                
            </Col>
        </Row>
    </>
  )
}

export default Page;