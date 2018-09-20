import {POST_TWEET, FETCH_TWEETS, UPDATE_TWEET, DELETE_TWEET} from "../actions/types";

export default(state = [], action) => {
    switch (action.type) {
        case POST_TWEET:
            return [
                ...state,
                action.payload
            ];
        case FETCH_TWEETS:
            return action.payload;
        case UPDATE_TWEET: {
            return state.map(tweet => tweet._id === action.payload._id
                ? action.payload
                : tweet);
            }
        case DELETE_TWEET:
            return action.payload;
        default:
            return state;
    }
}