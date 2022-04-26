import axios from "axios";
import React, { useState } from "react";
import { Button, Card, Col, Image, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addLike, deleteLike } from "../actions/userActions";

const ChatContact = ({ user, click }) => {
  const dispatch = useDispatch();
  const [isCurrent, setIsCurrent] = useState(false);

  const onClickHandler = () => {
    setIsCurrent(true);
    console.log("clicked");
    click(user);
  };

  return (
    <Card
      className={isCurrent ? "my-2 bg-primary" : "my-2"}
      style={{
        backgroundColor: "rgb(33,34,36)",
        cursor: "pointer",
      }}
      onClick={() => onClickHandler()}
    >
      <Card.Body>
        <Row style={{ alignItems: "center" }} nogutters="true">
          <Col>
            <Image
              src="https://ui-avatars.com/api/?name=John+Doe"
              thumbnail
              style={{ borderRadius: "50%" }}
            />
          </Col>
          <Col>
            <Card.Title className="mb-2">{user.name}</Card.Title>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ChatContact;
