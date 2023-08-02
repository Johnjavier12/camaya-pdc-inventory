import axios from 'axios'
import {store} from 'store'
import * as actions from 'store/actions'

// const version = 'v1'

axios.defaults.baseURL = process.env.API;
//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// axios.defaults.headers.common['X-CSRF-TOKEN'] = "";


// Update this interceptor this should ask to user to login again and not logout
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401 ) {
            store.dispatch(actions.authLogout())
        }

        // if (error.response && error.response.status === 404 ) {
        //     store.dispatch(actions.authLogout())
        // }

        // if (error.response.statusText === "Unauthorized") {
        //     store.dispatch(actions.authLogout())
        //     alert("You have started a new session so this session will automatically end.");
        //     window.location.reload();
        // }

        return Promise.reject(error.response.data);
    }
);

export default axios
