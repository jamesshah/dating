import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addMatch } from "../actions/userActions";
import { formatDate } from "../utils/formatDate";

// const _formatDate = (date) => {
//   const options = { year: "numeric", month: "short", day: "numeric" };
//   const today = new Date(date);

//   return today.toLocaleDateString("en-US", options);
// };

const Notification = ({ sender, type, date, read }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const likeBackHandler = () => {
    console.log("like back clicked");
    // console.log(sender);

    dispatch(addMatch(sender));
    navigate("/matches");
  };

  const chatHandler = () => {
    console.log("chat button clicked");
    // console.log(sender);

    navigate("/chat");
  };

  return (
    <Card
      className="mb-3"
      border={read ? "dark" : "info"}
      style={{
        backgroundColor: "#111213",
      }}
    >
      <Card.Body>
        <Card.Title>
          {type === "like" ? "Someone just liked you🥳" : "It's a match!😍"}
        </Card.Title>
        <Card.Text>
          {type === "like"
            ? `${sender.name} just liked you, check out their profile to see if they are your type.😉`
            : `${sender.name} liked you back. Make your move, now!😎`}
        </Card.Text>
        <Card.Text className="text-muted">{formatDate(date)}</Card.Text>
        {type === "like" ? (
          <Row>
            <Col md={5}>
              <Button>
                <Link
                  to={`/user/${sender.username}`}
                  style={{
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  Check out profile
                </Link>
              </Button>
            </Col>
            <Col md={5}>
              <Button onClick={likeBackHandler}>Like back</Button>
            </Col>
          </Row>
        ) : (
          <Button onClick={chatHandler}>Chat</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Notification;
