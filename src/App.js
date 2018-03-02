import React, { Component } from 'react';
import Img from 'react-image';
import './App.css';
import { Card, CardText, CardBody, Button, Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';

import fetch from 'node-fetch';

class App extends Component {
  state = {
    term: '',
    images: [],
    list: []
  }
  makeSearch(term) {
    fetch('/api?term='+ term || this.state.term)
      .then(res => res.json())
      .then(images => this.setState({images}))
  }
  startSearch(term) {
    this.setState({ term });
    this.makeSearch(term);
  }

  componentDidMount() {
    fetch('/file')
      .then(res => res.json())
      .then(list => this.setState({ list }))
  }

  saveImage (img) {
    let file = img.split("/")
    let fileName = file[file.length - 1];
    let playerName = this.state.term;

    fetch(`/saveImage?fileName=${fileName}&playerName=${playerName}`)
      .then(res => res.json());
  }

  render() {
    let {term, images, list} = this.state;
    return (
      <Container className="App" style={{ marginTop: 70 }}>
        <Row>
          <Col xs={3}>
            <ListGroup style={{ height: 638, overflowY: "scroll" }}>
              {list.map(item => (
                <ListGroupItem
                  active={item[1] === this.state.term}
                  onClick={() => this.startSearch(item[1])}
                >{item[1]}</ListGroupItem>)
              )}
            </ListGroup>
          </Col>
          <Col xs={9}>
            <div>
              <ul>
                {images.map(img => <Card style={{ display: "inline-block", marginBottom: 10 }}>
                  <Img src={img.contentUrl} style={{ height: 150 }}/>
                  <CardBody>
                    <CardText>{img.height} x {img.width}</CardText>
                    <a
                      href={img.contentUrl}
                      download="new.jpg"
                      onClick={() => this.saveImage(img.contentUrl)}
                    >Download</a>
                  </CardBody>
                </Card>)}
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
