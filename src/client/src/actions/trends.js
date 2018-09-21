import axios from "axios";
import { FETCH_TRENDS } from "./types";

/* eslint-disable-next-line */
export const fetchTrends = location => async dispatch => {
    const res = await axios.get(`/api/get_trends/${location}`);
    dispatch({ type: FETCH_TRENDS, payload: res.data });
};
