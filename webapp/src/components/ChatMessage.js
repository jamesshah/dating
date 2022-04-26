import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { formatDate } from "../utils/formatDate";

export default function ChatMessage({ message }) {
  return (
    <Row
      md={3}
      lg={3}
      sm={3}
      className="m-2"
      style={{
        justifyContent: message.fromSelf ? "end" : "start",
      }}
    >
      <Card bg="dark">
        <Card.Body>
          <Card.Title>{message.message}</Card.Title>
          {/* <Card.Text className="text-muted">
            {formatDate(message.date)}
          </Card.Text> */}
        </Card.Body>
      </Card>
    </Row>
  );
}
