import React, { useState, useEffect } from 'react'
import { LoadingOutlined } from '@ant-design/icons'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

function YearlyPdcLocation (props) {
    
    const labels = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec'
    ];

    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
          },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: 'January - December',
          },
        },
      };

      const data = {
          labels,
          datasets: props.data
      }

    return(
        <>
                {
                    props.loading === 'false' ?
                    <>
                        <Bar options={options} data={data} />;
                    </>
                    :
                    <>
                        <LoadingOutlined style={{fontSize: '25px', marginLeft: '10px'}}/>
                    </>
                }
               
        </>
    );
}

export default YearlyPdcLocation;