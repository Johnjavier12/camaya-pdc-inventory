import React, { useEffect } from 'react'
import WebsiteLayout from 'layouts/Main/Website/WebsiteLayout'
import Navigation from 'layouts/Main/Website/Navigation'
import { useLocation } from 'react-router-dom'
import MagicLeafLogo from 'assets/magic-leaf-logo.png'

import { ShowIf } from 'utils/Common'
import { Button } from 'antd'

function Page(props) {

  // console.log(props)
  const search = useLocation().search;
  const error = new URLSearchParams(search).get('err');

  const eventHandler = () => {

    const status = error ? '?status=failed' : '?status=success';

    window.opener.location.replace("/book"+status);
    window.close();
  }

  useEffect(() => {
    window.addEventListener('beforeunload', eventHandler, true)
    return () => {      
      window.removeEventListener('beforeunload', eventHandler, true)
    }
  }, [])

  return (
    <div className='flex flex-col grid justify-items-center content-center p-36' style={{width: '100%', minHeight: '100%'}}>
        <img src={MagicLeafLogo} style={{ width: 60 }} className="m-3" alt="Magic Leaf Logo" />
        <span className="self-center font-semibold whitespace-wrap">Magic Leaf Booking System</span>
        <h3 className='text-2xl mt-8'>{!error ? 'Booking Successful!' : 'Booking Failed!'}</h3>
        <ShowIf cond={!error} className="text-center">Your booking was successful. Please check you email for trip details confirmation. <br/><Button type="link" onClick={() => window.close()}>Close this page</Button></ShowIf>
        <p className='text-red-500'>{error}</p>
    </div>
  )
}

export default (Page);