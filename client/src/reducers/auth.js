import { FETCH_USER, POST_TWEET } from "../actions/types";

export default (state = null, action) => {
    switch(action.type) {
        case FETCH_USER:
            return action.payload;
        case POST_TWEET:
            return action.payload
        default:
            return state;
    }
}