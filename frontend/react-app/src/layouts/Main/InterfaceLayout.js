import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import { can } from 'utils/casl/ability-context'

import { Layout } from 'antd'
// import {} from '@ant-design/icons'
const { Content } = Layout;


function InterfaceLayout(props) {

    React.useEffect( () => {
        
    }, []);
        
    return (
        <Layout style={{ minHeight: '100vh'}}>            
            <Layout>
                <Content>
                    <div className="p-5">{props.children}</div>
                </Content>
            </Layout>
        </Layout>
    );

}

const mapStateToProps = (state) => {
    return {
        user: state.Auth.user,
        isTokenExpired: state.Auth.isTokenExpired,
        isAuthenticated: state.Auth.isAuthenticated,
    }
}

export default connect(mapStateToProps)(withRouter(InterfaceLayout))
