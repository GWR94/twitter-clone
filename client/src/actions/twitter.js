import axios from "axios";
import { FETCH_TRENDS, FETCH_TWEETS, POST_TWEET, UPDATE_TWEET } from "./types";

export const fetchTrends = location => async dispatch => {
    const res = await axios.get(`/api/get_trends/${location}`);
    dispatch({type: FETCH_TRENDS, payload: res.data});
};

export const postTweet = values => async dispatch => {
    const res = await axios.post("/api/tweet", values);
    dispatch({type: POST_TWEET, payload: res.data});
}

export const fetchTweets = handle => async dispatch => {
    const res = await axios.get(`/api/fetch_tweets/${handle}`);
    dispatch({type: FETCH_TWEETS, payload: res.data});
};

export const updateTweet = values => async dispatch => {
    const res = await axios.patch("/api/update_tweet", values);
    dispatch({type: UPDATE_TWEET, payload: res.data});
}

export const followUser = values => async dispatch => {
    const res = await axios.post("/api/follow_user", values);
    dispatch({type: POST_TWEET, payload: res.data});
}