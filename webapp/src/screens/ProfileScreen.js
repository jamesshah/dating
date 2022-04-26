import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Form, Button, Row, Col, Image } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useMediaQuery } from "react-responsive";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
// import AutoComplete from "../components/AutoComplete";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import questions from "../utils/questions";

const ProfileScreen = () => {
  const [bioLength, setBioLength] = useState(0);
  const [q1Length, setQ1Length] = useState(0);
  const [q2Length, setQ2Length] = useState(0);
  const [q3Length, setQ3Length] = useState(0);
  const [q4Length, setQ4Length] = useState(0);
  const [q5Length, setQ5Length] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState(null);
  const [pronouns, setPronouns] = useState(null);
  const [preferredPronouns, setpreferredPronouns] = useState(null);
  const [ageGroup, setAgeGroup] = useState(null);
  const [preferredAgeGroup, setPreferredAgeGroup] = useState(null);
  const [facebookProfileUrl, setFacebookProfileUrl] = useState("");
  const [instagramProfileUrl, setInstagramProfileUrl] = useState("");
  const [twitterProfileUrl, setTwitterProfileUrl] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setQ4] = useState("");
  const [q5, setQ5] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { userDetailsLoading, userDetailsError, user } = userDetails;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { userUpdateProfileLoading, userUpdateProfileError, success } =
    userUpdateProfile;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 768px)",
  });

  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=profile");
    } else {
      if (!user || !user.username || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
      } else {
        setUsername(user.username);
        setEmail(user.email);
        setBio(user.bio);
        setBioLength(user.bio.length);
        setLocation(user.location);
        setPronouns(user.pronouns);
        setpreferredPronouns(user.preferredPronouns);
        setAgeGroup(user.ageGroup);
        setPreferredAgeGroup(user.preferredAgeGroup);
        setFacebookProfileUrl(user.facebookProfileUrl);
        setInstagramProfileUrl(user.instagramProfileUrl);
        setTwitterProfileUrl(user.twitterProfileUrl);
        setQ1(user.q1);
        setQ2(user.q2);
        setQ3(user.q3);
        setQ4(user.q4);
        setQ5(user.q5);
      }
    }
  }, [dispatch, navigate, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateUserProfile({
        email,
        username,
        password,
        bio,
        location,
        pronouns,
        preferredPronouns,
        ageGroup,
        preferredAgeGroup,
        facebookProfileUrl,
        instagramProfileUrl,
        twitterProfileUrl,
        q1,
        q2,
        q3,
        q4,
        q5,
      })
    );
  };

  return (
    <section
      className="p-5 mt-5"
      style={{
        backgroundColor: "#111213",
        color: "white",
        minHeight: "100vh",
      }}
    >
      {userDetailsError ? (
        <Message variant="danger">{userDetailsError}</Message>
      ) : userUpdateProfileError ? (
        <Message variant="danger">{userUpdateProfileError}</Message>
      ) : success ? (
        <Message variant="success">Profile Updated Successfully</Message>
      ) : userDetailsLoading || userUpdateProfileLoading ? (
        <Loader />
      ) : (
        <Form onSubmit={submitHandler}>
          <Container
            className="p-4 rounded shadow mb-4"
            style={{ backgroundColor: "rgb(33,34,36)" }}
          >
            <Row className="align-items-center">
              <Col>
                <h2 className="mb-4">Account Information</h2>
                {/* Username field */}
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col style={{ display: !isDesktopOrLaptop && "none" }}>
                <Image src="/images/account-info.svg" fluid />
              </Col>
            </Row>
          </Container>

          {/* Personal Details Container */}
          <Container
            className="p-4 rounded shadow mb-4"
            style={{ backgroundColor: "rgb(33,34,36)" }}
          >
            <Row>
              <Col>
                <h2 className="mb-4">Personal Details</h2>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Bio <span className="text-muted ">({bioLength}/200)</span>{" "}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    maxLength={200}
                    placeholder="A short description about yourself..."
                    value={bio}
                    onChange={(e) => {
                      setBio(e.target.value);
                      setBioLength(e.target.value.length);
                    }}
                    style={{ resize: "none" }}
                  />
                </Form.Group>

                {/* <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <AutoComplete
                    userLocation={_getPlaceFromUserLocation(location)}
                    setUserLocation={setLocation}
                  />
                </Form.Group> */}
                <Form.Group className="mb-3">
                  <Form.Label>Your Pronouns</Form.Label>
                  <Form.Control
                    as="select"
                    size="md"
                    onChange={(e) => setPronouns(e.target.value)}
                    defaultValue={pronouns}
                    required={true}
                  >
                    <option value="" selected={pronouns === ""}>
                      Select...
                    </option>
                    <option value="he/him" selected={pronouns === "he/him"}>
                      He/him
                    </option>
                    <option value="she/her" selected={pronouns === "she/her"}>
                      She/her
                    </option>
                    <option
                      value="they/them"
                      selected={pronouns === "they/them"}
                    >
                      They/them
                    </option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Your Preferred Pronouns</Form.Label>
                  <Form.Control
                    as="select"
                    size="md"
                    onChange={(e) => setpreferredPronouns(e.target.value)}
                    defaultValue={preferredPronouns}
                    required={true}
                  >
                    <option value="" selected={preferredPronouns === ""}>
                      Select...
                    </option>
                    <option
                      value="he/him"
                      selected={preferredPronouns === "he/him"}
                    >
                      He/him
                    </option>
                    <option
                      value="she/her"
                      selected={preferredPronouns === "she/her"}
                    >
                      She/her
                    </option>
                    <option
                      value="they/them"
                      selected={preferredPronouns === "they/them"}
                    >
                      They/them
                    </option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Your Age Group</Form.Label>
                  <Form.Control
                    as="select"
                    size="md"
                    onChange={(e) => setAgeGroup(e.target.value)}
                    defaultValue={ageGroup}
                  >
                    <option value="" selected={ageGroup === ""}>
                      Select...
                    </option>
                    <option value="18-21" selected={ageGroup === "18-21"}>
                      18-21
                    </option>
                    <option value="22-25" selected={ageGroup === "22-25"}>
                      22-25
                    </option>
                    <option value="26-29" selected={ageGroup === "26-29"}>
                      26-29
                    </option>
                    <option value="30+" selected={ageGroup === "30+"}>
                      30+
                    </option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Your Preferred age group</Form.Label>
                  <Form.Control
                    as="select"
                    size="md"
                    onChange={(e) => setPreferredAgeGroup(e.target.value)}
                    defaultValue={preferredAgeGroup}
                  >
                    <option value="" selected={preferredAgeGroup === ""}>
                      Select...
                    </option>
                    <option
                      value="18-21"
                      selected={preferredAgeGroup === "18-21"}
                    >
                      18-21
                    </option>
                    <option
                      value="22-25"
                      selected={preferredAgeGroup === "22-25"}
                    >
                      22-25
                    </option>
                    <option
                      value="26-29"
                      selected={preferredAgeGroup === "26-29"}
                    >
                      26-29
                    </option>
                    <option value="30+" selected={ageGroup === "30+"}>
                      30+
                    </option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col style={{ display: !isDesktopOrLaptop && "none" }}>
                <Image src="/images/personal-details.svg" fluid />
              </Col>
            </Row>
          </Container>

          {/* Questionnaire Container  */}
          <Container
            className="p-4 rounded shadow mb-4"
            style={{ backgroundColor: "rgb(33,34,36)" }}
          >
            <Row className="align-items-center">
              <Col>
                <h2 className="mb-4">Questionnaire</h2>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {questions.q1}
                    <span className="text-muted ">({q1Length}/200)</span>{" "}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    maxLength={150}
                    value={q1}
                    onChange={(e) => {
                      setQ1(e.target.value);
                      setQ1Length(e.target.value.length);
                    }}
                    style={{ resize: "none" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {questions.q2}
                    <span className="text-muted ">({q2Length}/200)</span>{" "}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    maxLength={150}
                    value={q2}
                    onChange={(e) => {
                      setQ2(e.target.value);
                      setQ2Length(e.target.value.length);
                    }}
                    style={{ resize: "none" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {questions.q3}
                    <span className="text-muted ">({q3Length}/200)</span>{" "}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    maxLength={150}
                    value={q3}
                    onChange={(e) => {
                      setQ3(e.target.value);
                      setQ3Length(e.target.value.length);
                    }}
                    style={{ resize: "none" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {questions.q4}
                    <span className="text-muted ">({q4Length}/200)</span>{" "}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    maxLength={150}
                    value={q4}
                    onChange={(e) => {
                      setQ4(e.target.value);
                      setQ4Length(e.target.value.length);
                    }}
                    style={{ resize: "none" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {questions.q5}
                    <span className="text-muted ">({q5Length}/200)</span>{" "}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    maxLength={150}
                    value={q5}
                    onChange={(e) => {
                      setQ5(e.target.value);
                      setQ5Length(e.target.value.length);
                    }}
                    style={{ resize: "none" }}
                  />
                </Form.Group>
              </Col>
              <Col style={{ display: !isDesktopOrLaptop && "none" }}>
                <Image src="/images/social-links.svg" fluid />
              </Col>
            </Row>
          </Container>

          {/* Social Media Links Container */}
          <Container
            className="p-4 rounded shadow mb-4"
            style={{ backgroundColor: "rgb(33,34,36)" }}
          >
            <Row className="align-items-center">
              <Col>
                <h2 className="mb-4">Social Links</h2>
                <Form.Group className="mb-3">
                  <Form.Label>Facebook</Form.Label>
                  <Form.Control
                    type="text"
                    value={facebookProfileUrl}
                    onChange={(e) => setFacebookProfileUrl(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control
                    type="text"
                    value={instagramProfileUrl}
                    onChange={(e) => setInstagramProfileUrl(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Twitter</Form.Label>
                  <Form.Control
                    type="text"
                    value={twitterProfileUrl}
                    onChange={(e) => setTwitterProfileUrl(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col style={{ display: !isDesktopOrLaptop && "none" }}>
                <Image src="/images/social-links.svg" fluid />
              </Col>
            </Row>
          </Container>
          <Container
            className="p-4 mb-4 rounded shadow"
            style={{ backgroundColor: "rgb(33,34,36)" }}
          >
            <Button
              style={{ backgroundColor: "#4D61FC", width: "100%" }}
              variant="primary"
              type="submit"
            >
              Update
            </Button>
          </Container>
        </Form>
      )}
      {/* </Container> */}
    </section>
  );
};

export default ProfileScreen;
