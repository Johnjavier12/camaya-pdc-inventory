import * as ActionTypes from 'store/actions/types'

const initialState = {
    selectedTrip : null,
};

const Trip = (state = initialState, {type, payload = null}) => {
    switch (type) {
        case ActionTypes.UPDATE_SELECTED_TRIP:
            return updateSelectedTrip(state, payload);
        default:
            return state;
    }
};

const updateSelectedTrip = (state, payload) => {

    console.log(payload);

    state = Object.assign({}, state, {
        selectedTrip: payload,
    });

    return state;
};

export default Trip;