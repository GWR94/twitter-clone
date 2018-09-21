import axios from "axios";
import { GET_USER } from "./types";

/* eslint-disable-next-line */
export const getUser = handle => async dispatch => {
    const res = await axios.get(`/api/get_user/${handle}`);
    dispatch({ type: GET_USER, payload: res.data });
};
