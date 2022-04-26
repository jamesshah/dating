import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { io } from "socket.io-client";
import Loader from "../components/Loader";
import User from "../components/User";
import Message from "../components/Message";
import { getMatchesList, getUserList } from "../actions/userActions";
import { Link, useNavigate } from "react-router-dom";
import ChatContact from "../components/ChatContact";
import {
  addNewMessage,
  getMessages,
  sendNewMessage,
} from "../actions/messageActions";
import { formatDate } from "../utils/formatDate";
import ChatMessage from "../components/ChatMessage";

const ChatScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useRef();
  const scrollRef = useRef();

  const [arrivalMessage, setArrivalMessage] = useState(null);

  const [currentChatUser, setCurrentChatUser] = useState(undefined);
  const [msgInput, setMsgInput] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userMatches = useSelector((state) => state.userMatches);
  const { userMatchesLoading, userMatchesError, matches } = userMatches;

  const userMessages = useSelector((state) => state.userMessages);
  const { userMessagesLoading, userMessagesError, messages } = userMessages;

  const contactClickHandler = (chatUser) => {
    setCurrentChatUser(chatUser);
    dispatch(getMessages(chatUser));
  };

  const msgSubmitHandler = (e) => {
    e.preventDefault();
    console.log(msgInput);

    console.log(currentChatUser);

    const newMessage = {
      to: currentChatUser._id,
      from: userInfo.user._id,
      message: msgInput,
    };

    socket.current.emit("send-msg", newMessage);

    dispatch(addNewMessage({ fromSelf: true, message: msgInput }));
    dispatch(sendNewMessage(newMessage));
    setMsgInput("");
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!matches) dispatch(getMatchesList());
      if (currentChatUser && !messages) {
        dispatch(getMessages(currentChatUser));
      }
      // if(currentChatUser && localMessages.length === 0)
    }
  }, [dispatch, navigate, userInfo, matches, messages, currentChatUser]);

  useEffect(() => {
    if (userInfo) {
      socket.current = io("http://localhost:5001");
      socket.current.emit("add-user", userInfo.user._id);
    }
  }, [userInfo]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        console.log(
          "received a message from socket. setting as arrival message"
        );
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && dispatch(addNewMessage(arrivalMessage));
  }, [arrivalMessage, dispatch]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section
      style={{ backgroundColor: "#111213", color: "white", minHeight: "100vh" }}
    >
      <Container className="p-5 mt-5">
        <h1 className="mb-3" style={{ fontWeight: "700" }}>
          Chats
        </h1>
        {userMatchesLoading ? (
          <Loader />
        ) : userMatchesError ? (
          <Message variant="danger">{userMatchesError}</Message>
        ) : matches && matches.length !== 0 ? (
          <Row
            className="bg-dark"
            style={{ height: "100vh", overflow: "scroll" }}
          >
            <Col md={3} lg={3}>
              <Row className="mx-2">
                {matches.map((match) => (
                  <ChatContact
                    user={match}
                    key={match._id}
                    click={contactClickHandler}
                  />
                ))}
              </Row>
            </Col>
            <Col>
              <Row style={{ height: "90%", overflow: "scroll" }}>
                <Container className="bg-light">
                  {userMessagesLoading ? (
                    <Loader />
                  ) : userMessagesError ? (
                    <Message variant="danger">{userMessagesError}</Message>
                  ) : currentChatUser && messages && messages.length === 0 ? (
                    <h1>No messages! Make your move now.</h1>
                  ) : (
                    currentChatUser &&
                    messages &&
                    messages.map((message) => <ChatMessage message={message} />)
                  )}
                </Container>
              </Row>
              {currentChatUser && messages && (
                <Form onSubmit={msgSubmitHandler} className="my-3">
                  <Row>
                    <Col md={10}>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        maxLength={200}
                        placeholder="type your message here..."
                        value={msgInput}
                        onChange={(e) => setMsgInput(e.target.value)}
                        required={true}
                        size="lg"
                        style={{ resize: "false" }}
                      ></Form.Control>
                    </Col>
                    <Col style={{ alignSelf: "center" }}>
                      <Button variant="primary" type="submit" size="lg">
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Col>
          </Row>
        ) : (
          <>
            <h2 className="text-center">
              You have no matches!😢
              <br />
              <br />
              <Link to="/">Go to home page</Link>.Find your match now and start
              chatting!
            </h2>
          </>
        )}
      </Container>
    </section>
  );
};

export default ChatScreen;
