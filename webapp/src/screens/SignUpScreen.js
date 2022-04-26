import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Form,
  Image,
  Row,
  Button,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { register } from "../actions/userActions";
import AutoComplete from "../components/AutoComplete";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [preferredPronouns, setpreferredPronouns] = useState(null);
  const [pronouns, setPronouns] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userRegister = useSelector((state) => state.userRegister);
  const { userRegisterLoading, userRegisterError, userInfo } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/profile";

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/profile", { replace: true });
    }
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      register(
        name,
        email,
        username,
        password,
        userLocation,
        preferredPronouns,
        pronouns
      )
    );
  };

  return (
    <Container
      className="p-5 mt-5 mt-md-4 text-white"
      style={{
        backgroundColor: "#111213",
        maxWidth: "100vw",
      }}
    >
      <Row className="justify-content-center">
        <Col md className="p-md-5 m-auto">
          <Image src="/images/signup.svg" className="" fluid />
        </Col>
        <Col
          md
          className="m-3 shadow"
          style={{ backgroundColor: "rgb(33,34,36)" }}
        >
          <div className="m-4">
            <h1 className="mb-4">Join Now</h1>

            {userRegisterError && (
              <Message variant="danger">{userRegisterError}</Message>
            )}
            {/* {userRegisterLoading && <Loader />} */}
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Angel Priya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={true}
                />
              </Form.Group>

              {/* Username field */}
              <Form.Group className="mb-3" controlId="">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="angel-priya"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={true}
                />
              </Form.Group>

              {/* Email field */}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="love@forever.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={true}
                />
              </Form.Group>

              {/* Password field */}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="lovelove"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={true}
                />
              </Form.Group>

              <hr className="my-4" />

              {/* Location Field with Autocomplete Input */}
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <AutoComplete setUserLocation={setUserLocation} />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Your Pronouns</Form.Label>
                    <Form.Control
                      as="select"
                      size="md"
                      onChange={(e) => setPronouns(e.target.value)}
                      defaultValue=""
                      required={true}
                    >
                      <option value="">Select...</option>
                      <option value="he/him">He/him</option>
                      <option value="she/her">She/her</option>
                      <option value="they/them">They/them</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Your Preferred Pronouns</Form.Label>
                    <Form.Control
                      as="select"
                      size="md"
                      onChange={(e) => setpreferredPronouns(e.target.value)}
                      defaultValue=""
                      required={true}
                    >
                      <option value="">Select...</option>
                      <option value="he/him">He/him</option>
                      <option value="she/her">She/her</option>
                      <option value="they/them">They/them</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              {userRegisterLoading ? (
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
                  style={{ backgroundColor: "#4D61FC" }}
                  type="submit"
                  disabled={
                    username === "" ||
                    email === "" ||
                    password === "" ||
                    userLocation == null ||
                    pronouns == null ||
                    preferredPronouns == null
                      ? true
                      : false
                  }
                >
                  Sign up
                </Button>
              )}
            </Form>

            {/* Link to login page if already registered */}
            <Row className="my-3">
              <Col>
                Already a user? <Link to="/login">Login</Link>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
