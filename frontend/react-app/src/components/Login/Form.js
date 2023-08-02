import React, {useState, useEffect} from 'react'
import {Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import AuthService from 'services/AuthService'
import Http from 'utils/Http'
import { Form, Input, Button, Alert, Checkbox, notification } from 'antd'
import { UserOutlined, LockFilled, LoadingOutlined } from '@ant-design/icons'
import {Ability, AbilityBuilder} from "@casl/ability";
import { useContext } from 'react';
import { AbilityContext } from '../../utils/Abilities/can'

const LoginForm = (props) => {

    const {dispatch} = props;
    const ability = useContext(AbilityContext)
    // States
    const [errorMessage, setErrorMessage] = useState("");
    const [loginSubmitted, setLoginSubmitted] = useState(false);
    
    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        return () => {
        };
    }, []);

    const { from } = props.location.state || { from: { pathname: '/admin/pdc-dashboard' } };

    if (props.isAuthenticated) {
        return <Redirect to={from} />
    }

    const onFinish = values => {

        setLoginSubmitted(true);

        dispatch(AuthService.tryLogin({...values}))
        .then( res => {
            Http.get('/api/user-permission')
                    .then(response => {
                        const { can, rules } = new AbilityBuilder(Ability);
                        can(response.data);
                        ability.update(rules);
                        console.log(response.data)
                        console.log("taena")
                    })

            notification.success({
                message: 'Signed in!',
                description:
                    'You have successfully signed in.',
            });

            setLoginSubmitted(false);
        })
        .catch((res) => {
            setLoginSubmitted(false);
            setErrorMessage(res.error);
        });

    }

    return (
        <div>
            { !loginSubmitted ?
                <>
                    <Form onFinish={onFinish} initialValues={{ remember: true }}>
                        <Form.Item name="email" rules={[{ required: true, message: 'Type your email address here.' }, { type: 'email' }]}>
                            <Input
                                // prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="email address"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item name="password" rules={[{ required: true, message: 'Type your password here.' }]}>
                            <Input
                                // prefix={<LockFilled style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="password"
                                size="large"
                            />
                        </Form.Item>
                        <Button style={{float: 'right'}} type="link">Forgot password?</Button>

                        <Form.Item name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        
                        <Button type="primary" block size="large" htmlType="submit">Sign in</Button>
                    </Form>

                    { errorMessage &&
                        <Alert message={errorMessage} type="warning" showIcon closable className="mt-2" />
                    }
                </>
                : 
                    <>
                        <LoadingOutlined/>
                        <span className="ml-2">signing in ...</span>
                    </>
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated : state.Auth.isAuthenticated,
    }
};

export default connect(mapStateToProps)(LoginForm)