import React, {Suspense, lazy} from 'react'

import Home from 'screens/pdc-inventory' // Home page
// import Fallback from 'common/Fallback'; // Fallback
import { Can } from '../utils/Abilities/can'

// const PassengerTrips = lazy( () => import('screens/Main/Home/PassengerTrips'))
// const CreateBooking = lazy( () => import('screens/Main/Home/CreateBooking'))
// const Bookings = lazy( () => import('screens/Main/Home/Bookings'))
// const Reports = lazy( () => import('screens/Main/Home/Reports'))

const Dashboard = lazy(() => import('screens/pdc-inventory/pdc-dashboard'));
const ClientRegistration = lazy(() => import('screens/pdc-inventory/pdc-client-resgistration'));
const Property = lazy(() => import('screens/pdc-inventory/pdc-property'));
const PdcRegistraion = lazy(() => import('screens/pdc-inventory/pdc-registration'));
const Report = lazy(() => import('screens/pdc-inventory/pdc-report'));
const UserManagement = lazy(() => import('screens/pdc-inventory/pdc-user-management'));
const UserRole = lazy(() => import('screens/pdc-inventory/pdc-user-role'));

import Loading from 'common/Loading'
import PageNotFound from 'common/PageNotFound' // Page not found - (404)
import Unathorized from '../common/Unauthorized';
// Lazy imports

const routes = [

    {
        path: '/',
        exact: true,
        auth: false,
        element: (props) => <Home {...props}/>
    },

    {
        path: '/admin/pdc-dashboard',
        title: 'Dashboard',
        name: 'pdc-dashboard',
        exact: true,
        auth: true,
        element: (props) => <Suspense fallback={<Loading/>}><Dashboard {...props}/></Suspense>
    },

    {
        path: '/admin/pdc-client-resgistration',
        title: 'ClientRegistration',
        name: 'pdc-client-resgistration',
        exact: true,
        auth: true,
        element: (props) => <Suspense fallback={<Loading/>}><ClientRegistration {...props}/></Suspense>
    },

    {
        path: '/admin/pdc-registration',
        title: 'PdcRegistration',
        name: 'pdc-registration',
        exact: true,
        auth: true,
        element: (props) => <Suspense fallback={<Loading/>}><PdcRegistraion {...props}/></Suspense>
    },

    {
        path: '/admin/pdc-property',
        title: 'Property',
        name: 'pdc-property',
        exact: true,
        auth: true,
        element: (props) => <Suspense fallback={<Loading/>}><Property {...props}/></Suspense>
    },

    {
        path: '/admin/pdc-report',
        title: 'Report',
        name: 'pdc-report',
        exact: true,
        auth: true,
        element: (props) => <Suspense fallback={<Loading/>}><Report {...props}/></Suspense>
    },

    {
        path: '/admin/pdc-user-management',
        title: 'UserManagement',
        name: 'pdc-user-management',
        exact: true,
        auth: true,
        element: (props) => <Suspense fallback={<Loading/>}><UserManagement {...props}/></Suspense>
    },

    {
        path: '/admin/pdc-user-role',
        title: 'UserRole',
        name: 'pdc-user-role',
        exact: true,
        auth: true,
        element: (props) => <Suspense fallback={<Loading/>}><UserRole {...props}/></Suspense>
    },

    // 404
    {
        path: '',
        exact: true,
        auth: false,
        title: 'Lost in space',
        element: (props) => <PageNotFound {...props}/>
    },

    //403 unauthorized
    {
        path:'/unauthorized',
        exact:true,
        auth:true,
        title:"Unathorized",
        element:(props)=><Unathorized {...props} />
    }
];

export default routes;