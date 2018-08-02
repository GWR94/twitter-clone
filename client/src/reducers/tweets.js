import {POST_TWEET, FETCH_TWEETS } from "../actions/types";

export default(state = [], action) => {
    switch (action.type) {
        case POST_TWEET:
            return [...state, action.payload];
        case FETCH_TWEETS:
            return action.payload;
        default:
            return state;
    }
}