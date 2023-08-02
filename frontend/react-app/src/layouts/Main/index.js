import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import * as action from 'store/actions'
import { Can } from '../../utils/Abilities/can'

import MagicLeafLogo from 'assets/magic-leaf-logo.png'
import { Layout, Menu, Tooltip, Button } from 'antd'
import { BookOutlined, HomeOutlined, LogoutOutlined, QrcodeOutlined, UserOutlined, FileTextOutlined, DashOutlined, DashboardOutlined, DashboardFilled,DatabaseOutlined } from '@ant-design/icons'
import SubMenu from 'antd/lib/menu/SubMenu'
const { Content, Header, Sider } = Layout;
import useFetchPermissions from '../../hooks/useFetchPermissions'

function MainLayout(props) {

    useFetchPermissions();
    console.log(props);

    const [collapsed, setCollapsed] = React.useState(true);
    const [collapsedWidth, setCollapsedWidth] = React.useState(80);

    React.useEffect( () => {
        
    }, []);

    // Handle sign out
    const handleSignOut = () => {
        
        props.dispatch(action.authLogout());

    }

    const selectedItemColor = (path) => {
         if(props.history.location.pathname === path) {
            return {
                backgroundColor: '#e6f5ff', 
                color: '#1177fa'
            }
         }

         return {};
    }
        
    return (<Layout style={{minHeight: '100vh'}}>
            <Sider
                theme='light'
                trigger={null}
                collapsible
                // collapsed={collapsed}
                breakpoint="lg"
                // collapsedWidth={collapsedWidth}
                onBreakpoint={broken => {
                    // if (broken) { setCollapsedWidth(0);
                    // } else { setCollapsedWidth(80); }
                }}
                className="py-5"
                width={250}
                style={{overflow: 'hidden', borderRight: 'solid 1px #f0f2f5'}}
            >
                <div style={{display: 'flex', justifyContent:'flex-start', alignItems:'center', flexDirection:'column', height: '100%'}}>
                    <div className="logo mb-10" style={{textAlign: 'center'}}>
                        {/* <img src={MagicLeafLogo} style={{width: 50, margin: '0 auto'}} /> */}
                        <strong>PDC & INVENTORY SYSTEM</strong><br/>
                        <small>Welcome, {props.user.profile.first_name}</small><br/>
                        {/* <small>Control Panel</small> */}
                    </div> 
                    <Menu
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={['/admin/pdc-dashboard']}
                        selectedKeys={[props.history.location.pathname]}
                        style={{ marginLeft: '50px'}} >
                            
                        <Can do="view-dashboard">
                            <Menu.Item key="/admin/pdc-dashboard" style={ selectedItemColor('/admin/pdc-dashboard') } icon={ props.history.location.pathname == '/admin/pdc-dashboard' ? <DashboardFilled /> : <DashboardOutlined />}>
                                <NavLink to="/admin/pdc-dashboard">Dashboard</NavLink>
                            </Menu.Item>
                        </Can>

                        <Can do="view-client-registration">
                            <Menu.Item key="/admin/pdc-client-resgistration" style={ selectedItemColor('/admin/pdc-client-resgistration') } icon={<UserOutlined />}>
                                <NavLink to="/admin/pdc-client-resgistration">Client Registration</NavLink>
                            </Menu.Item>
                        </Can>
                        
                        <Can do="view-pdc-registration">
                            <Menu.Item key="/admin/pdc-registration" style={ selectedItemColor('/admin/pdc-registration') } icon={<FileTextOutlined />}>
                                <NavLink to="/admin/pdc-registration">PDC Registration</NavLink>
                            </Menu.Item>
                        </Can>
                        
                        <Can do="view-property">
                            <Menu.Item key="/admin/pdc-property" style={ selectedItemColor('/admin/pdc-property') } icon={<><FileTextOutlined /></>}>
                                <NavLink to="/admin/pdc-property">Property Management</NavLink>
                            </Menu.Item>
                        </Can>
                        
                        <Can do="view-pdc-report">
                            <Menu.Item key="/admin/pdc-report" style={ selectedItemColor('/admin/pdc-report') } icon={<DatabaseOutlined />}>
                                <NavLink to="/admin/pdc-report">PDC Report</NavLink>
                            </Menu.Item>
                        </Can>

                        <Can do="view-user">
                            <Menu.Item key="/admin/pdc-user-management" style={ selectedItemColor('/admin/pdc-user-management') } icon={<UserOutlined />}>
                                <NavLink to="/admin/pdc-user-management">Users Registraion</NavLink>
                            </Menu.Item>
                        </Can>
                        
                        <Can do="view-role">
                            <Menu.Item key="/admin/pdc-user-role" style={ selectedItemColor('/admin/pdc-user-role') } icon={<UserOutlined />}>
                                <NavLink to="/admin/pdc-user-role">User Roles</NavLink>
                            </Menu.Item>
                        </Can>
                        

                        {/* <SubMenu key="user-management" icon={<FileTextOutlined />} title="User Maintenance">
                            <Menu.Item key="/admin/pdc-user-management">
                                <NavLink to="/admin/pdc-user-management">Users Registraion</NavLink>
                            </Menu.Item>
                            <Menu.Item key="#">
                                <NavLink to="#">User Roles</NavLink>
                            </Menu.Item>
                        </SubMenu> */}
 
                    </Menu>
                </div>
                <div style={{display: 'flex', justifyContent:'flex-end', alignItems:'center', flexDirection:'column', marginTop: -24}}>
                    <Tooltip title="sign out" placement="right">
                        <Button type="link" icon={<LogoutOutlined />} onClick={handleSignOut} />
                    </Tooltip>
                </div>
            </Sider>
            <Layout style={{background: '#fff'}}>
                { collapsedWidth == 0 &&
                    <Header>
                        {
                            React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })
                        }
                    </Header> 
                }
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

export default connect(mapStateToProps)(withRouter(MainLayout))
