import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { logout } from "../actions/userActions";
import { useMediaQuery } from "react-responsive";
import styles from "../css/Header.module.css";

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userNotifications = useSelector((state) => state.userNotifications);
  const { userNotificationsLoading, userNotificationsError, notifications } =
    userNotifications;

  const isMobile = useMediaQuery({
    query: "(max-width: 576px)",
  });

  const logoutHandler = () => {
    console.log("logout");
    dispatch(logout());
  };
  return (
    <header>
      <Navbar
        id="navbar"
        variant="dark"
        className={`${styles.navbar} ${
          isMobile && userInfo ? styles.container : ""
        } px-5 py-3 shadow`}
        fixed="top"
      >
        <Container>
          <LinkContainer to={"/"} exact="true">
            <Navbar.Brand className={styles.navbar_brand}>
              FindYourLove <span style={{ color: "#4d61fc" }}>.</span>
            </Navbar.Brand>
          </LinkContainer>
          <Nav className="mr-auto">
            {userInfo && !isMobile ? (
              <>
                <LinkContainer to="/">
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/matches">
                  <Nav.Link>Matches</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/chat">
                  <Nav.Link>Chat</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/notifications">
                  <Nav.Link>
                    {notifications &&
                    notifications.unread &&
                    notifications.unread.length !== 0
                      ? `Notifications (${notifications.unread.length})`
                      : "Notifications"}
                  </Nav.Link>
                </LinkContainer>
                <NavDropdown title={userInfo.user.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : userInfo && isMobile ? (
              <>
                <LinkContainer to="/chat">
                  <Nav.Link>Chat</Nav.Link>
                </LinkContainer>
                <NavDropdown title={userInfo.user.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <LinkContainer to="/" exact>
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/login" exact>
                  <Nav.Link className={styles.nav_link}>Login</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
      {isMobile && userInfo && (
        <Navbar
          className="justify-content-center border border-top"
          fixed="bottom"
          variant="dark"
          style={{ backgroundColor: "#111213" }}
        >
          <Nav>
            <Nav.Item>
              <LinkContainer to="/" exact>
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to="/matches" exact>
                <Nav.Link>Matches</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to="/notifications" exact>
                <Nav.Link>
                  {notifications &&
                  notifications.unread &&
                  notifications.unread.length !== 0
                    ? `Notifications (${notifications.unread.length})`
                    : "Notifications"}
                </Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Nav>
        </Navbar>
      )}
    </header>
  );
};

export default Header;
