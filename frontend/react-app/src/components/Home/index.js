import React from 'react'
import { NavLink } from 'react-router-dom'
import {connect} from 'react-redux'

import { Typography, Row, Col, Card } from 'antd'
import { BookOutlined, QrcodeOutlined, UserOutlined, FileTextOutlined} from '@ant-design/icons'

function Page(props) {

  return (
    <>
        <h1 className="text-lg tracking-tight font-extrabold text-gray-900 sm:text-xl md:text-2xl">
          <span className="block xl:inline">Dashboard</span>
        </h1>

        <Row gutter={[24,24]}>
          <Col xl={24} xs={24}>
            <Row gutter={[24,24]}>

            <Col xl={8} xs={24}>
                <Card style={{boxShadow:'-4px 15px 24px 10px rgba(0,0,0,0.05)', border: 'none'}}>
                  <h1 className="text-lg tracking-tight font-bold text-gray-500 sm:text-lg md:text-lg">
                    <span className="block xl:inline">Total Sales</span>
                  </h1>

                  <p>Coming soon...</p>
                </Card> 
              </Col>

              
              <Col xl={8} xs={24}>
                <Card style={{boxShadow:'-4px 15px 24px 10px rgba(0,0,0,0.05)', border: 'none'}}>
                  <h1 className="text-lg tracking-tight font-bold text-gray-500 sm:text-lg md:text-lg">
                    <span className="block xl:inline">Passengers Today</span>
                  </h1>

                  <p>Coming soon...</p>
                </Card> 
              </Col>

              <Col xl={8} xs={24}>
                <Card style={{boxShadow:'-4px 15px 24px 10px rgba(0,0,0,0.05)', border: 'none'}}>
                  <h1 className="text-lg tracking-tight font-bold text-gray-500 sm:text-lg md:text-lg">
                    <span className="block xl:inline">Total Bookings</span>
                  </h1>

                  <p>Coming soon...</p>
                </Card> 
              </Col>

            </Row>
          </Col>
        </Row>
    </>
  )
}

export default (Page);