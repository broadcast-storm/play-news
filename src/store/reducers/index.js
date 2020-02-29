import { combineReducers } from "redux";
import { firebaseReducer } from "./firebaseReducer";

export const rootReducer = combineReducers({
  firebase: firebaseReducer
});
