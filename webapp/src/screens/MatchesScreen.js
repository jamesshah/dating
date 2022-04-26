import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import User from "../components/User";
import Message from "../components/Message";
import { getMatchesList, getUserList } from "../actions/userActions";
import { Link, useNavigate } from "react-router-dom";

const MatchesScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userMatches = useSelector((state) => state.userMatches);
  const { userMatchesLoading, userMatchesError, matches } = userMatches;

  const userList = useSelector((state) => state.userList);
  const { userListLoading, userListError, users } = userList;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!users) dispatch(getUserList());
      if (!matches) dispatch(getMatchesList());
    }
  }, [dispatch, navigate, userInfo, matches, users]);

  return (
    <section
      style={{ backgroundColor: "#111213", color: "white", minHeight: "100vh" }}
    >
      <Container className="p-5 mt-5">
        <h1 className="mb-3" style={{ fontWeight: "700" }}>
          Your Matches
        </h1>
        {userMatchesLoading || userListLoading ? (
          <Loader />
        ) : userMatchesError ? (
          <Message variant="danger">{userMatchesError}</Message>
        ) : userListError ? (
          <Message variant="danger">{userListError}</Message>
        ) : matches && matches.length !== 0 ? (
          <>
            <Row>
              {matches.map((match) => (
                <User user={match} key={match.id} match={true} />
              ))}
            </Row>
          </>
        ) : (
          <>
            <h2 className="text-center">
              You have no Matches!😢
              <br />
              <br />
              <Link to="/">Go to home page</Link> and Find your match now!
            </h2>
          </>
        )}
      </Container>
    </section>
  );
};

export default MatchesScreen;
