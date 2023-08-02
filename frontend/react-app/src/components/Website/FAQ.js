import React from 'react'
import WebsiteLayout from 'layouts/Main/Website/WebsiteLayout'
import Navigation from 'layouts/Main/Website/Navigation'

function Page(props) {

  return (
    <WebsiteLayout>
        <Navigation/>
        FAQ
    </WebsiteLayout>
  )
}

export default (Page);