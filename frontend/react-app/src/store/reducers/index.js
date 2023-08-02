import {combineReducers} from 'redux'
import Auth from './Auth'
import Trip from './Trip'

const rootReducer = combineReducers({Auth, Trip});

export default rootReducer;