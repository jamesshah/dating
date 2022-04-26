import React from "react";
import { Card } from "react-bootstrap";

export default function QuestionnaireCard({ question, answer }) {
  return (
    <Card bg="dark" border="light" text="white" className="mb-2">
      <Card.Header as={"h5"}>{question}</Card.Header>
      <Card.Body>
        <Card.Text>{answer}</Card.Text>
      </Card.Body>
    </Card>
  );
}
