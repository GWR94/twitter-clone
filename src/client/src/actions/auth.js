import axios from "axios";
import { FETCH_USER } from "./types";

export const fetchUser = () => async dispatch => {
    const res = await axios.get("/api/current_user");
    dispatch({ type: FETCH_USER, payload: res.data });
};

export const createUser = values => async dispatch => {
    const res = await axios.post("/api/signup", values);
    dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchProfile = handle => async dispatch => {
    const res = await axios.get(`/api/fetch_profile/${handle}`);
    dispatch({ type: FETCH_USER, payload: res.data });
};

export const updateProfile = values => async dispatch => {
    const res = await axios.post("/api/update_profile", values);
    dispatch({ type: FETCH_USER, payload: res.data });
};

export const uploadPhoto = values => async dispatch => {
    const res = await axios.post("/api/upload", values);
    dispatch({ type: FETCH_USER, payload: res.data });
}

export const followUser = values => async dispatch => {
    const res = await axios.post("/api/follow_user", values);
    dispatch({ type: FETCH_USER, payload: res.data });
};