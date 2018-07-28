import { FETCH_TRENDS } from '../actions/types';

export default (state = [], action) => {
    switch(action.type) {
        case FETCH_TRENDS:
            return action.payload;
        default:
            return state;
    }
}