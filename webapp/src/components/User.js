import React, { useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addLike, deleteLike } from "../actions/userActions";

const User = ({ user, id, like, match }) => {
  const [isLike, setIsLike] = useState(like);
  const [isMatch, setIsMatch] = useState(match);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClickHandler = () => {
    if (isMatch) {
      navigate("/chat");
      return;
    }
    if (like) {
      dispatch(deleteLike(user));
    } else {
      dispatch(addLike(user));
    }
    setIsLike(!isLike);
  };

  return (
    <Col lg={6} md={6}>
      <Card
        key={id}
        className="p-2 m-2"
        style={{ backgroundColor: "rgb(33,34,36)" }}
      >
        <Card.Body className="text-center">
          <Link
            to={`/user/${user.username}`}
            style={{
              textDecoration: "none",
              color: "white",
            }}
          >
            <Card.Title className="mb-2">@{user.username}</Card.Title>
          </Link>
          <Card.Text className="text-truncate">{user.bio}</Card.Text>
          <Row className="align-items-center mb-2">
            <Col>
              <Button onClick={() => onClickHandler()}>
                {isMatch
                  ? "Chat"
                  : !isMatch && isLike
                  ? "Remove from likes"
                  : "Add to likes"}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default User;
