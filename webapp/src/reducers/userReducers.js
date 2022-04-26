import {
  USER_ADD_MATCH_FAIL,
  USER_ADD_MATCH_REQUEST,
  USER_ADD_MATCH_SUCCESS,
  USER_DELETE_MATCH_FAIL,
  USER_DELETE_MATCH_REQUEST,
  USER_DELETE_MATCH_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_MATCHES_LIST_FAIL,
  USER_MATCHES_LIST_REQUEST,
  USER_MATCHES_LIST_SUCCESS,
  USER_NOTIFICATIONS_FAIL,
  USER_NOTIFICATIONS_REQUEST,
  USER_NOTIFICATIONS_SUCCESS,
  USER_UNREAD_NOTIFICATIONS_REQUEST,
  USER_UNREAD_NOTIFICATIONS_FAIL,
  USER_UNREAD_NOTIFICATIONS_SUCCESS,
  USER_PROFILE_FAIL,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_RESET,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_LIKES_LIST_REQUEST,
  USER_LIKES_LIST_SUCCESS,
  USER_LIKES_LIST_FAIL,
  USER_ADD_LIKE_REQUEST,
  USER_ADD_LIKE_SUCCESS,
  USER_ADD_LIKE_FAIL,
  USER_DELETE_LIKE_REQUEST,
  USER_DELETE_LIKE_FAIL,
  USER_DELETE_LIKE_SUCCESS,
  USER_MESSAGES_REQUEST,
  USER_MESSAGES_FAIL,
  USER_MESSAGES_SUCCESS,
  USER_NEW_MESSAGES_REQUEST,
  USER_SEND_MESSAGE_REQUEST,
  USER_SEND_MESSAGE_FAIL,
  USER_SEND_MESSAGE_SUCCESS,
  USER_NEW_MESSAGES_SUCCESS,
  USER_NEW_MESSAGES_FAIL,
} from "../constants/userConstants";

export const userListReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return { userListLoading: true };
    case USER_LIST_SUCCESS:
      return { userListLoading: false, users: action.payload };
    case USER_LIST_FAIL:
      return { userListLoading: false, userListError: action.payload };
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { userRegisterLoading: true };
    case USER_REGISTER_FAIL:
      return { userRegisterLoading: false, userRegisterError: action.payload };
    case USER_REGISTER_SUCCESS:
      return { userRegisterLoading: false, userInfo: action.payload };
    default:
      return state;
  }
};

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { userLoginLoading: true };
    case USER_LOGIN_FAIL:
      return { userLoginLoading: false, userLoginError: action.payload };
    case USER_LOGIN_SUCCESS:
      return { userLoginLoading: false, userInfo: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_PROFILE_REQUEST:
      return { userProfileLoading: true };
    case USER_PROFILE_SUCCESS:
      return { userProfileLoading: false, user: action.payload };
    case USER_PROFILE_FAIL:
      return { userProfileLoading: false, userProfileError: action.payload };
    default:
      return state;
  }
};

export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { ...state, userDetailsLoading: true };
    case USER_DETAILS_SUCCESS:
      return { userDetailsLoading: false, user: action.payload };
    case USER_DETAILS_FAIL:
      return { userDetailsLoading: false, userDetailsError: action.payload };
    default:
      return state;
  }
};

export const userNotificationsReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_NOTIFICATIONS_REQUEST:
      return { ...state, userNotificationLoading: true };
    case USER_NOTIFICATIONS_SUCCESS:
      return {
        userNotificationLoading: false,
        notifications: action.payload,
      };
    case USER_NOTIFICATIONS_FAIL:
      return {
        userNotificationLoading: false,
        userNotificationsError: action.payload,
      };
    default:
      return state;
  }
};

export const userUnreadNotificationsReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UNREAD_NOTIFICATIONS_REQUEST:
      return { ...state, userUnreadNotificationLoading: true };
    case USER_UNREAD_NOTIFICATIONS_SUCCESS:
      return {
        userUnreadNotificationLoading: false,
        unreadNotifications: action.payload,
      };
    case USER_UNREAD_NOTIFICATIONS_FAIL:
      return {
        userUnreadNotificationLoading: false,
        userUnreadNotificationsError: action.payload,
      };
    default:
      return state;
  }
};

export const userMessagesReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_MESSAGES_REQUEST:
      return { ...state, userMessagesLoading: true };
    case USER_MESSAGES_SUCCESS:
      return {
        userMessagesLoading: false,
        messages: action.payload,
      };
    case USER_MESSAGES_FAIL:
      return {
        userMessagesLoading: false,
        userMessagesError: action.payload,
      };
    case USER_NEW_MESSAGES_REQUEST:
      return { ...state, userNewMessagesLoading: true };
    case USER_NEW_MESSAGES_SUCCESS:
      const { messages, new_message } = action.payload;
      return {
        userNewMessagesLoading: false,
        success: true,
        messages: messages.concat(new_message),
      };
    case USER_NEW_MESSAGES_FAIL:
      return {
        userNewMessagesLoading: false,
        userNewMessagesError: action.payload,
      };
    case USER_SEND_MESSAGE_REQUEST:
      return { ...state, userSendNewMessageLoading: true };
    case USER_SEND_MESSAGE_SUCCESS:
      return {
        userSendNewMessageLoading: false,
        success: true,
        messages: action.payload,
      };
    case USER_SEND_MESSAGE_FAIL:
      return {
        userSendNewMessageLoading: false,
        userSendNewMessageError: action.payload,
      };
    default:
      return state;
  }
};

// export const userNewMessagesReducer = (state = { messages: null }, action) => {
//   switch (action.type) {
//     default:
//       return state;
//   }
// };

// export const userSendNewMessageReducer = (
//   state = { messages: null },
//   action
// ) => {
//   switch (action.type) {
//   }
// };

export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { ...state, userUpdateProfileLoading: true };
    case USER_UPDATE_PROFILE_SUCCESS:
      return {
        userUpdateProfileLoading: false,
        success: true,
        userInfo: action.payload,
      };
    case USER_UPDATE_PROFILE_FAIL:
      return {
        userUpdateProfileLoading: false,
        userUpdateProfileError: action.payload,
      };
    case USER_UPDATE_PROFILE_RESET:
      return {};
    default:
      return state;
  }
};

export const userMatchesReducer = (state = { matches: null }, action) => {
  switch (action.type) {
    case USER_MATCHES_LIST_REQUEST:
      return { userMatchLoading: true };
    case USER_MATCHES_LIST_SUCCESS:
      return { userMatchLoading: false, matches: action.payload };
    case USER_MATCHES_LIST_FAIL:
      return { userMatchLoading: false, userMatchError: action.payload };
    case USER_ADD_MATCH_REQUEST:
      return { ...state, userMatchLoading: true };
    case USER_ADD_MATCH_SUCCESS:
      const { matches } = action.payload;
      return {
        userMatchLoading: false,
        success: true,
        matches: matches,
      };
    case USER_ADD_MATCH_FAIL:
      return { userMatchLoading: false, userMatchError: action.payload };
    case USER_DELETE_MATCH_REQUEST:
      return { ...state, userMatchLoading: true };
    case USER_DELETE_MATCH_SUCCESS:
      const { match_d, match_id } = action.payload;
      const updatedMatches = match_d.filter((match) => match._id !== match_id);
      return {
        userMatchLoading: false,
        success: true,
        matches: updatedMatches,
      };
    case USER_DELETE_MATCH_FAIL:
      return { userMatchLoading: false, userMatchError: action.payload };
    default:
      return state;
  }
};

export const userLikesReducer = (state = { likes: null }, action) => {
  switch (action.type) {
    case USER_LIKES_LIST_REQUEST:
      return { userLikesLoading: true };
    case USER_LIKES_LIST_SUCCESS:
      return { userLikesLoading: false, likes: action.payload };
    case USER_LIKES_LIST_FAIL:
      return { userLikesLoading: false, userLikesError: action.payload };
    case USER_ADD_LIKE_REQUEST:
      return { ...state, userLikesLoading: true };
    case USER_ADD_LIKE_SUCCESS:
      const { likes } = action.payload;
      return {
        userLikesLoading: false,
        success: true,
        likes: likes,
      };
    case USER_ADD_LIKE_FAIL:
      return { userLikesLoading: false, userLikesError: action.payload };
    case USER_DELETE_LIKE_REQUEST:
      return { ...state, userLikesLoading: true };
    case USER_DELETE_LIKE_SUCCESS:
      const { like_d, like_id } = action.payload;
      const updatedLikes = like_d.filter((like) => like._id !== like_id);
      return {
        userLikesLoading: false,
        success: true,
        likes: updatedLikes,
      };
    case USER_DELETE_LIKE_FAIL:
      return { userLikesLoading: false, userLikesError: action.payload };
    default:
      return state;
  }
};
