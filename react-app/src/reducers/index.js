import { combineReducers } from "redux";
import { user } from "./user";
import { property } from "./property";
export const reducers = combineReducers({
    user,
    property
})