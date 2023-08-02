import React from 'react'
// import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons'

const Loading = () => (
    <div className="loading" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column'}}>
        <LoadingOutlined style={{fontSize: '2rem', marginBottom: 12}} />
        <div>Loading...</div>
    </div>
)

export default Loading;