import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Container } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getUserProfile } from "../actions/userActions";
import { Facebook, Instagram, Linkedin, Twitter } from "react-bootstrap-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import questions from "../utils/questions";
import QuestionnaireCard from "../components/QuestionnaireCard";

const _getLocationName = async (location) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${
    (location.coordinates[0], location.coordinates[1])
  }.json?country=US&types=place&access_token=${
    process.env.REACT_APP_MAPBOX_ACCESS_KEY
  }`;

  let results = await axios.get(url);
  let features = results.data.features;
  console.log(features[0]);
  return features[0];
};

const UserScreen = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.userProfile);
  const { userProfileLoading, user, userProfileError } = userProfile;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    // redirect logged in user to profile screen
    if (userInfo && userInfo.user.username === username) {
      navigate("/profile", { replace: true });
    }
    dispatch(getUserProfile(username));
  }, [username, userInfo, navigate, dispatch]);

  return (
    <section
      className="p-3 p-md-5 mt-5"
      style={{
        backgroundColor: "#111213",
        color: "white",
        minHeight: "100vh",
      }}
    >
      {userProfileLoading ? (
        <Loader />
      ) : userProfileError ? (
        <Message variant="danger">{userProfileError}</Message>
      ) : user ? (
        <Container
          className="p-4 rounded shadow mt-4"
          style={{ backgroundColor: "rgb(33,34,36)" }}
        >
          {/* Personal Details */}
          <h1 className="mb-3 text-center">{user.name}</h1>
          <p className="text-center h6" style={{ color: "#9CA3AF" }}>
            {user.pronouns} · @{user.username}
          </p>
          <hr />
          <h3 className="mb-2">Bio</h3>
          <p className="mb-4">{user.bio}</p>

          <h3 className="mb-2">Questionnaire</h3>
          {Object.keys(questions).map((key) => {
            return (
              <QuestionnaireCard question={questions[key]} answer={user[key]} />
            );
          })}

          {/* Social Links */}
          <h3 className="mb-2">Social Links</h3>
          {user.facebookProfileUrl.length !== 0 && (
            <a
              rel="noreferrer"
              href={`${user.facebookProfileUrl}`}
              className="text-decoration-none btn btn-outline-light mt-3"
              target="_blank"
            >
              <Facebook /> {user.facebookProfileUrl}
            </a>
          )}
          <br />
          {user.instagramProfileUrl.length !== 0 && (
            <a
              rel="noreferrer"
              href={`${user.instagramProfileUrl}`}
              className="text-decoration-none btn btn-outline-light mt-3"
              target="_blank"
            >
              <Instagram /> {user.instagramProfileUrl}
            </a>
          )}
          <br />
          {user.twitterProfileUrl.length !== 0 && (
            <a
              rel="noreferrer"
              href={`${user.twitterProfileUrl}`}
              className="text-decoration-none btn btn-outline-light mt-3"
              target="_blank"
            >
              <Twitter /> {user.twitterProfileUrl}
            </a>
          )}
        </Container>
      ) : (
        <></>
      )}
    </section>
  );
};

export default UserScreen;
