import React from 'react'

import WebsiteLayout from 'layouts/Main/Website/WebsiteLayout'
import Navigation from 'layouts/Main/Website/Navigation'

import Banner from 'assets/1-Banner.png'
import EST from 'assets/3-EST.png'
import FTT from 'assets/4-FTT.png'
import Restrictions from 'assets/5-Restrictions.png'
import TripReminders from 'assets/6-TripReminders.png'

function Page(props) {

  return (
    <WebsiteLayout>
        <Navigation/>

        {/* <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl p-32">
          <span className="block xl:inline">Website is under construction.</span>{' '}<br /><a href="/book">Click here to Book</a>
        </h1> */}

        {/* <img className="" src={Banner} alt="Buy 1 Take 1 Promo"/> */}

        <a href="/book"><img className="" src={Banner} alt="Buy 1 Take 1 Promo"/></a>


        <a href="https://www.google.com/maps/dir//Esplanade+Seaside+Terminal,+Seaside+Blvd,+Pasay,+Metro+Manila/@14.5415182,120.9392347,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3397cbe467dccd8d:0xf37bf98bdc6d1042!2m2!1d120.980437!2d14.5414291?entry=ttu" target="_blank"><img className="" src={EST} alt="Esplanade Seaside Terminal"/></a>

        <a href="https://www.google.com/maps/dir//FAB+Town+Terminal,+CFQX%2B5FF,+Sewage+Treatment+Plant+Rd,+Freeport+Area+of+Bataan,+Mariveles,+Bataan/@14.4380068,120.4574726,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x339619f01f8e4a19:0xbd60850b879b27b2!2m2!1d120.4986794!2d14.4379294?entry=ttu" target="_blank"><img className="" src={FTT} alt="FAB Town Terminal"/></a>

        <img className="" src={Restrictions} alt="Restrictions"/>
        <img className="" src={TripReminders} alt="Trip Reminders"/>

    </WebsiteLayout>
  )
}

export default (Page);