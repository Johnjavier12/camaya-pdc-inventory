import React from "react";
import {connect} from "react-redux";

import MainLayout from 'layouts/Main';

import LoginComponent from 'components/Login';
import Dashboard from 'components/Pdc/Dashboard';

function Page(props) {
    
    return (
        
            !props.isAuthenticated ?
                <LoginComponent {...props}/>
                :
                <MainLayout {...props}>
                    <div className="fadeIn">
                        <Dashboard {...props}/>
                    </div>
                </MainLayout>
    )
    
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.Auth.isAuthenticated,
    }
}

export default connect(mapStateToProps)(Page);