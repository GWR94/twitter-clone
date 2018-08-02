import axios from "axios";
import { FETCH_USER, FETCH_TRENDS, POST_TWEET, FETCH_TWEETS } from "./types";

export const createUser = (values, history) => async (dispatch) => {
	const res = await axios.post("/api/signup", values);
	history.push("/");
	dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchUser = () => async (dispatch) => {
	const res = await axios.get("/api/current_user");
	dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchTrends = (location) => async (dispatch) => {
	const res = await axios.get(`/api/get_trends/${location}`);
	dispatch({ type: FETCH_TRENDS, payload: res.data });
};

export const postTweet = (values) => async (dispatch) => {
	const res = await axios.post("/api/tweet", values);
	dispatch({ type: POST_TWEET, payload: res.data });
}

export const fetchTweets = (username) => async (dispatch) => {
	const res = await axios.get(`/api/fetch_tweets/${username}`);
	dispatch({ type: FETCH_TWEETS, payload: res.data });
};