import axios from "axios";
import { FETCH_TWEETS, POST_TWEET, UPDATE_TWEET } from "./types";

export const postTweet = values => async dispatch => {
    const res = await axios.post("/api/tweet", values);
    dispatch({ type: POST_TWEET, payload: res.data });
};

export const fetchTweets = handle => async dispatch => {
    const res = await axios.get(`/api/fetch_tweets/${handle}`);
    dispatch({ type: FETCH_TWEETS, payload: res.data });
};

export const updateTweet = values => async dispatch => {
    const res = await axios.patch("/api/update_tweet", values);
    dispatch({ type: UPDATE_TWEET, payload: res.data });
};

export const deleteTweet = tweetID => async dispatch => {
    const res = await axios.delete(`/api/delete_tweet/${tweetID}`);
    dispatch({ type: UPDATE_TWEET, payload: res.data });
};
