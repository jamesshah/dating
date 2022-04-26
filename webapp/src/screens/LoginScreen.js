import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Image,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUnreadNotifications, login } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userLoginLoading, userLoginError, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate, userInfo, location.pathname]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(username);
    console.log(password);
    dispatch(login(username, password));
  };

  return (
    <Container
      className="p-5 mt-5 text-white"
      style={{
        backgroundColor: "#111213",
        maxWidth: "100vw",
      }}
    >
      <Row className="justify-content-center align-items-center">
        <Col className="p-md-5" md>
          <Image src="/images/login.svg" fluid />
        </Col>
        <Col
          className="p-4 shadow"
          md
          style={{ backgroundColor: "rgb(33,34,36)" }}
        >
          <h1 className="mb-4">Login</h1>
          {userLoginError && (
            <Message variant="danger">{userLoginError}</Message>
          )}

          <Form onSubmit={submitHandler}>
            {/* Username field */}
            <Form.Group className="mb-3" controlId="">
              <Form.Label>Username</Form.Label>
              <Form.Control
                className=""
                type="text"
                placeholder="angel-priya"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={true}
              />
            </Form.Group>
            {/* Password field */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                className=""
                type="password"
                placeholder="love"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={true}
              />
            </Form.Group>
            {/* <Button
              type="submit"
              disabled={username === "" || password === ""}
              style={{ backgroundColor: "#4D61FC" }}
            >
              Login
            </Button> */}
            {userLoginLoading ? (
              <Button
                className="text-white"
                disable
                style={{ backgroundColor: "#4D61FC" }}
              >
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Loading...
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={username === "" || password === ""}
                style={{ backgroundColor: "#4D61FC" }}
              >
                Login
              </Button>
            )}
          </Form>
          <Row className="my-3">
            <Col>
              New user? <Link to="/signup">Sign up</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
