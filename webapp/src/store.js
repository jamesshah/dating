import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import {
  userDetailsReducer,
  userListReducer,
  userLoginReducer,
  userProfileReducer,
  userRegisterReducer,
  userUpdateProfileReducer,
  userMatchesReducer,
  userNotificationsReducer,
  userUnreadNotificationsReducer,
  userLikesReducer,
  userMessagesReducer,
  userNewMessagesReducer,
} from "./reducers/userReducers";

const middleware = [thunk];

const reducer = combineReducers({
  userList: userListReducer,
  userLogin: userLoginReducer,
  userProfile: userProfileReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userMatches: userMatchesReducer,
  userNotifications: userNotificationsReducer,
  userUnreadNotifications: userUnreadNotificationsReducer,
  userLikes: userLikesReducer,
  userMessages: userMessagesReducer,
  // userNewMessages: userNewMessagesReducer,
});

const userInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: {
    userInfo: userInfo,
  },
};

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
