import React, { useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationsAsRead,
} from "../actions/notificationActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Notification from "../components/Notification";

export default function NotificationScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userNotifications = useSelector((state) => state.userNotifications);
  const { userNotificationsLoading, userNotificationsError, notifications } =
    userNotifications;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login", { replace: true });
    } else {
      if (!notifications) {
        dispatch(getNotifications());
      }
    }
  }, [navigate, userInfo, dispatch, notifications]);

  return (
    <section
      style={{ backgroundColor: "#111213", color: "white", minHeight: "100vh" }}
    >
      <Container
        className="p-5 mt-5"
        style={{
          backgroundColor: "#111213",
        }}
      >
        <h1 className="mb-3" style={{ fontWeight: "700" }}>
          Your Notifications
        </h1>
        {userNotificationsError ? (
          <Message variant="danger">{userNotificationsError}</Message>
        ) : userNotificationsLoading ? (
          <Loader />
        ) : notifications &&
          notifications.all &&
          notifications.all.length !== 0 ? (
          <>
            <Row>
              {notifications.all.map((notification) => (
                <Notification
                  key={notification._id}
                  sender={notification.sender}
                  type={notification.notificationType}
                  date={notification.date}
                  read={notification.read}
                />
              ))}
            </Row>
          </>
        ) : (
          <>
            <h2 className="text-center">No notifications!</h2>
          </>
        )}
      </Container>
    </section>
  );
}
