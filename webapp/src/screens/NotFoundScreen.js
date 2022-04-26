import React from "react";
import { Image, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFoundScreen = () => {
  return (
    <Container className="mt-5 p-5 justify-content-center align-items-center mh-100">
      <Row>
        <Col>
          <Image src="/images/404.svg" className="w-75" fluid />
        </Col>
      </Row>

      <Row>
        <Col>
          <h3>
            It seems like you're lost. Find a date that will help you choose
            right path! <Link to="/"> Go to Home </Link>
          </h3>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundScreen;
