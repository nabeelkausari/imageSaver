import React from 'react';
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'reactstrap';


export default () => (
  <Container style={{ marginTop: 30 }}>
    <Row style={{ textAlign: 'center' }}>
      <Col>
        <Button color="light">
          <Link to="/football">Football</Link>
        </Button>
      </Col>
      <Col>
        <Button color="light">
          <Link to="/cricket">Cricket</Link>
        </Button>
      </Col>
    </Row>
  </Container>
)
