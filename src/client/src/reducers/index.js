import { combineReducers } from "redux";
import auth from "./auth";
import trends from "./trends";
import tweets from "./tweets";
import user from "./user";

export default combineReducers({ auth, trends, tweets, user });

