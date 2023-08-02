import React, { useState, useEffect } from 'react'
import { LoadingOutlined } from '@ant-design/icons'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

function PdcLocationChart(props) {

     const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
      };
      
      const labels = props.labels;
      
       const data = {
        labels,
        datasets: [
          {
            label: 'PDC Locations',
            data: props.values,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ],
      };

   return (
         <>
                {
                    props.loading === 'false' ?
                    <>
                       <Line
                            options={options}
                            data={data}
                            {...props}
                        />
                    </>
                    :
                    <>
                        <LoadingOutlined style={{fontSize: '25px'}}/>
                    </>
                }
        </>
   )
}

export default PdcLocationChart;