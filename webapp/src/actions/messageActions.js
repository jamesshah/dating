import axios from "axios";
import {
  USER_MESSAGES_FAIL,
  USER_MESSAGES_REQUEST,
  USER_MESSAGES_SUCCESS,
  USER_NEW_MESSAGES_FAIL,
  USER_NEW_MESSAGES_REQUEST,
  USER_NEW_MESSAGES_SUCCESS,
  USER_SEND_MESSAGE_FAIL,
  USER_SEND_MESSAGE_REQUEST,
  USER_SEND_MESSAGE_SUCCESS,
} from "../constants/userConstants";

const baseUrl = "http://localhost:5001/api";

export const getMessages = (chat_user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_MESSAGES_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const messages = await axios.post(
      `${baseUrl}/messages/get`,
      { from: userInfo.user._id, to: chat_user._id },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        withCredentials: true,
      }
    );

    console.log("All messages", messages.data);

    dispatch({
      type: USER_MESSAGES_SUCCESS,
      payload: messages.data,
    });
  } catch (error) {
    dispatch({
      type: USER_MESSAGES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addNewMessage = (new_message) => async (dispatch, getState) => {
  console.log("addNewMessage action called");

  try {
    dispatch({
      type: USER_NEW_MESSAGES_REQUEST,
    });

    const {
      userMessages: { messages },
    } = getState();

    dispatch({
      type: USER_NEW_MESSAGES_SUCCESS,
      payload: { messages, new_message },
    });
  } catch (error) {
    dispatch({
      type: USER_NEW_MESSAGES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const sendNewMessage = (new_message) => async (dispatch, getState) => {
  console.log("send new message called");

  try {
    dispatch({
      type: USER_SEND_MESSAGE_REQUEST,
    });

    const {
      userMessages: { messages },
      userLogin: { userInfo },
    } = getState();

    await axios.post(`${baseUrl}/messages/add`, new_message, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      withCredentials: true,
    });

    messages.concat({ fromSelf: true, message: new_message.message });

    dispatch({
      type: USER_SEND_MESSAGE_SUCCESS,
      payload: messages,
    });
  } catch (error) {
    dispatch({
      type: USER_SEND_MESSAGE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
