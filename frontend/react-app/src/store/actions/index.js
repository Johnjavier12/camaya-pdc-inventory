import * as ActionTypes from './types'

// Auth
export function authLogin(payload) {
    return {
        type: ActionTypes.AUTH_LOGIN,
        payload
    }
}

export function authLogout(){
    return {
        type: ActionTypes.AUTH_LOGOUT
    }
}

export function authCheck(payload) {
    return {
        type: ActionTypes.AUTH_CHECK,
        payload
    }
}


export function updateSelectedTrip(payload) {
    return {
        type: ActionTypes.UPDATE_SELECTED_TRIP,
        payload
    }
}