import { combineReducers } from 'redux';
import auth from './auth';
import twitter from './twitter';

export default combineReducers({
    auth,
    twitter,
});