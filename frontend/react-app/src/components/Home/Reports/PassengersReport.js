import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {connect} from 'react-redux'


import { Typography, Row, Col, Card, DatePicker, Select, Table, Space, Button, Menu, Dropdown, message, Form, Modal, Input, Tabs } from 'antd'
import { QrcodeOutlined, DownOutlined, PrinterOutlined, LoadingOutlined } from '@ant-design/icons'
import moment from 'moment'
import BookingService from 'services/Booking/BookingService'
import useFetch from 'hooks/use-fetch'

import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


function Page(props) {
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [getTripsByDateQuery, { isLoading: getTripsByDateQueryIsLoading, reset: getTripsByDateQueryReset }] = BookingService.getTripsByDate();
  const [downloadPassengersManifestQuery, { isLoading: downloadPassengersManifestQueryIsLoading, reset: downloadPassengersManifestQueryReset }] = BookingService.downloadPassengerManifest();
 
  useEffect( () => {
      getTripsByDate();
  }, [selectedDate, selectedSchedule])

  const getTripsByDate = () => {
      if (getTripsByDateQueryIsLoading) {
          return false;
      }

      getTripsByDateQuery({
          date: selectedDate
      }, {
          onSuccess: (res) => {
              console.log(res)
              setSchedules(res.data)
          },
          onError: (e) => {
              console.log(e)
          }
      })
  }

  const downloadPassengerManifest = (selectedDate) => {
    if (getTripsByDateQueryIsLoading) {
        return false;
    }

    downloadPassengersManifestQuery({
        date: selectedDate,
        schedule: selectedSchedule
    },{
      onSuccess: (res) => {
          console.log(res)
      },
      onError: (e) => {
          console.log(e)
      }
    })
  }

  return (
    <>
        <div>
            <Typography.Title level={4}>Passengers Report</Typography.Title>

            <Space direction="horizontal" style={{width: '100%', justifyContent: 'center'}}>
                <label>Filter: </label>
                
                <DatePicker value={selectedDate} onChange={(e) => setSelectedDate(e)} />

                <Select style={{width: 400}} onChange={(e) => setSelectedSchedule(e)}>
                    {
                        schedules && schedules.map( (i,k) => {
                            return <Select.Option key={k} value={i.id}>(TRIP-{i.id}) {i.origin_code}-{i.destination_code} {moment(i.trip_date+' '+i.start_time).format('hA')} - {moment(i.trip_date+' '+i.end_time).format('hA')} | {i.status}</Select.Option>
                        })
                    }
                </Select>
                {
                    downloadPassengersManifestQueryIsLoading ? <LoadingOutlined/>:
                    (
                        <Button disabled={selectedSchedule === null || selectedDate === null} onClick={() => downloadPassengerManifest()}>Print Manifest</Button>
                    )
                }
            
            </Space>


          
        </div>
       
    </>
  )
}

export default (Page);