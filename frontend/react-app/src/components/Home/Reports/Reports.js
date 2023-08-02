import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {connect} from 'react-redux'


import { Typography, Row, Col, Card, DatePicker, Select, Table, Space, Button, Menu, Dropdown, message, Form, Modal, Input, Tabs } from 'antd'
import { QrcodeOutlined, DownOutlined, PrinterOutlined, LoadingOutlined } from '@ant-design/icons'
import moment from 'moment'
import BookingService from 'services/Booking/BookingService'
import useFetch from 'hooks/use-fetch'
import PassengersReport from 'components/Home/Reports/PassengersReport';
import SalesReport from 'components/Home/Reports/SalesReport';

import ReactExport from "react-export-excel";

const { TabPane } = Tabs;

function Page(props) {
    const [selectedTab, setSelectedTab] = useState('sales');

    const handleTabChange = (key) => {
        setSelectedTab(key);
    };

    let reportComponent;

    switch (selectedTab) {
        case 'sales':
            reportComponent = <SalesReport />;
          break;
        case 'passengers':
          reportComponent = <PassengersReport />;
          break;
        // Add more cases for other report components
    
        default:
          reportComponent = null;
    }

    return (
        <div>
            <h1 className="text-lg tracking-tight font-extrabold text-gray-900 sm:text-xl md:text-2xl">
                <span className="block xl:inline">Generate Manifest</span>
            </h1>
          <Tabs activeKey={selectedTab} onChange={handleTabChange}>
            <TabPane tab="SALES" key="sales" />
            <TabPane tab="PASSENGERS" key="passengers" />
            {/* Add more TabPanes for other tabs */}
          </Tabs>
    
          {reportComponent}
        </div>
      );
}

export default (Page);