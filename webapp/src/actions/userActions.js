import axios from "axios";
import {
  USER_ADD_LIKE_FAIL,
  USER_ADD_LIKE_REQUEST,
  USER_ADD_LIKE_SUCCESS,
  USER_ADD_MATCH_FAIL,
  USER_ADD_MATCH_REQUEST,
  USER_ADD_MATCH_SUCCESS,
  USER_DELETE_LIKE_FAIL,
  USER_DELETE_LIKE_REQUEST,
  USER_DELETE_LIKE_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LIKES_LIST_FAIL,
  USER_LIKES_LIST_REQUEST,
  USER_LIKES_LIST_SUCCESS,
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
  USER_NOTIFICATIONS_REQUEST,
  USER_NOTIFICATIONS_SUCCESS,
  USER_PROFILE_FAIL,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
} from "../constants/userConstants";

const baseUrl = "http://localhost:5001/api";

export const register =
  (name, email, username, password, location, preferredPronouns, pronouns) =>
  async (dispatch) => {
    try {
      dispatch({
        type: USER_REGISTER_REQUEST,
      });

      const { data } = await axios.post(
        `${baseUrl}/users`,
        {
          name,
          email,
          username,
          password,
          location,
          pronouns,
          preferredPronouns,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: data,
      });

      // login the users once they register
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    dispatch({
      type: USER_NOTIFICATIONS_REQUEST,
    });

    const user = await axios.post(
      `${baseUrl}/users/login`,
      { username, password },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    // console.log(user.data);

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: user.data,
    });

    const notifications = await axios.get(`${baseUrl}/notifications`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      withCredentials: true,
    });

    console.log("All notifications", notifications.data);

    const unreadNotifications = notifications.data.filter(
      (n) => n.read === false
    );
    console.log("unread notifications", unreadNotifications);

    dispatch({
      type: USER_NOTIFICATIONS_SUCCESS,
      payload: {
        notifications: notifications.data,
        unreadNotifications: unreadNotifications,
      },
    });

    localStorage.setItem("userInfo", JSON.stringify(user.data));
  } catch (error) {
    console.log(error);
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  await axios
    .get(`${baseUrl}/users/logout`, { withCredentials: true })
    .then((data) => {
      console.log(data);
      localStorage.removeItem("userInfo");
      dispatch({
        type: USER_LOGOUT,
      });
    })
    .catch((err) => console.error(err));
};

export const getUserList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    console.log("making a request to list all the users");
    await fetch(`${baseUrl}/users/`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const userList = data.filter((user) => {
          return (
            user._id !== userInfo.user._id &&
            !userInfo.user.matches.some((match) => match._id === user._id)
          );
        });

        dispatch({
          type: USER_LIST_SUCCESS,
          payload: userList,
        });
      })
      .catch((err) => console.error(err));
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getUserProfile = (username) => async (dispatch) => {
  try {
    dispatch({
      type: USER_PROFILE_REQUEST,
    });

    const { data } = await axios.get(`${baseUrl}/users/${username}`, {
      withCredentials: true,
    });

    console.log(data);

    dispatch({
      type: USER_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await axios.get(`${baseUrl}/users/${id}`, {
      withCredentials: true,
    });

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await axios.put(`${baseUrl}/users/profile`, user, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      withCredentials: true,
    });

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getMatchesList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_MATCHES_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const matches = await axios.get(`${baseUrl}/users/matches`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      withCredentials: true,
    });

    // console.log("matches", matches.data);

    dispatch({
      type: USER_MATCHES_LIST_SUCCESS,
      payload: matches.data,
    });
  } catch (error) {
    dispatch({
      type: USER_MATCHES_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getLikesList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LIKES_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const likes = await axios.get(`${baseUrl}/users/likes`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      withCredentials: true,
    });

    // console.log("matches", matches.data);

    dispatch({
      type: USER_LIKES_LIST_SUCCESS,
      payload: likes.data,
    });
  } catch (error) {
    dispatch({
      type: USER_LIKES_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addMatch = (match) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_ADD_MATCH_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const matches = await axios.put(
      `${baseUrl}/users/match`,
      { user: match },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        withCredentials: true,
      }
    );

    console.log("matches", matches.data.matches);

    dispatch({
      type: USER_ADD_MATCH_SUCCESS,
      payload: matches.data,
    });
  } catch (error) {
    dispatch({
      type: USER_ADD_MATCH_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addLike = (like_id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_ADD_LIKE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const likes = await axios.put(
      `${baseUrl}/users/like`,
      { user: like_id },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        withCredentials: true,
      }
    );

    console.log("likes", likes.data);

    dispatch({
      type: USER_ADD_LIKE_SUCCESS,
      payload: likes.data,
    });
  } catch (error) {
    dispatch({
      type: USER_ADD_LIKE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteLike = (like_id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DELETE_LIKE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const likes = await axios.put(
      `${baseUrl}/users/like`,
      { user: like_id },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        withCredentials: true,
      }
    );

    console.log("likes", likes.data);

    dispatch({
      type: USER_DELETE_LIKE_SUCCESS,
      payload: likes.data,
    });
  } catch (error) {
    dispatch({
      type: USER_DELETE_LIKE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
