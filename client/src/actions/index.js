import axios from 'axios';
import { FETCH_USER, FETCH_TRENDS } from './types';

export const createUser = (values, history) => async (dispatch) => {
	const res = await axios.post('/api/signup', values);
	history.push('/');
	dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchUser = () => async (dispatch) => {
	const res = await axios.get(`/api/current_user`);
	dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchTrends = (location) => async (dispatch) => {
	const res = await axios.get(`/api/get_trends/${location}`);
	dispatch({ type: FETCH_TRENDS, payload: res.data });
};
