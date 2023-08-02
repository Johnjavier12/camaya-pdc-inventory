import axios from 'axios'
import Http from 'utils/Http'
import * as ActionTypes from 'store/actions/types'

const initialState = {
    isAuthenticated : false,
    user: {},
    isTokenExpired: false,
};

const Auth = (state = initialState,{type,payload = null}) => {
    switch (type) {
        case ActionTypes.AUTH_LOGIN:
            return authLogin(state, payload);
        case ActionTypes.AUTH_LOGOUT:
            return authLogout(state);
        case ActionTypes.AUTH_CHECK:
            return authCheck(state, payload);
        default:
            return state;
    }
};

const authLogin = (state, payload) => {

    const token = payload.token;
    
    localStorage.setItem('token', token);

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    let user_data = payload.user;

    switch (payload.user.user_type) {
        case 'customer':
            user_data = {...user_data, profile: {
                    first_name: payload.user.customer_profile.first_name,
                    last_name: payload.user.customer_profile.last_name,
                }
            }
            break;
        case 'client':
            user_data = {...user_data, profile: {
                    first_name: payload.user.first_name,
                    last_name: payload.user.last_name,
                }
            }
            break;
        default:
            user_data = {...user_data, profile: {
                first_name: payload.user.first_name,
                last_name: payload.user.last_name,
                }
            }
            
    }

    state = Object.assign({}, state, {
        isAuthenticated: true,
        user: user_data,
        isTokenExpired: false,
        // scopes: payload.scopes,
    });

    return state;
};

const authLogout = (state) => {
    localStorage.removeItem('token');
    localStorage.clear();
    
    state = Object.assign({}, state, initialState);
    
    return state;
};

const authCheck = (state, payload) => {

    const isAuthenticated = (payload && payload.isAuthenticated ? payload.isAuthenticated : !!localStorage.getItem('token'));

    let user_data = payload.user;

    switch (payload.user.user_type) {
        case 'customer':
            user_data = {...user_data, profile: {
                    first_name: payload.user.customer_profile.first_name,
                    last_name: payload.user.customer_profile.last_name,
                }
            }
            break;
        case 'client':
            user_data = {...user_data, profile: {
                    first_name: payload.user.first_name,
                    last_name: payload.user.last_name,
                }
            }
            break;
        default:
            user_data = {...user_data, profile: {
                first_name: payload.user.first_name,
                last_name: payload.user.last_name,
                }
            }
            
    }

    state = Object.assign({}, state, {
        isAuthenticated : isAuthenticated,
        user: payload && user_data ? user_data : initialState.user,
        isTokenExpired: payload && payload.error == 'token_expired' ? true : false,
    });

    if (state.isAuthenticated || payload.error) {
        Http.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    }

    return state;

};

export default Auth;