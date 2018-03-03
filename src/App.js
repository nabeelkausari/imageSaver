import React, { Component } from 'react';
import Img from 'react-image';
import './App.css';
import { Card, CardText, CardBody, Container, Row, Col, ListGroup, ListGroupItem, Input, FormGroup } from 'reactstrap';

import fetch from 'node-fetch';

const apiUrl = "http://localhost:4000/";

class App extends Component {
  state = {
    term: '',
    images: [],
    list: [],
    listSet: {},
    initial: true
  }
  makeSearch(term) {
    fetch(apiUrl + 'api?term='+ term || this.state.term)
      .then(res => res.json())
      .then(images => this.setState({images, initial: false}))
  }
  startSearch(term) {
    this.setState({ term });
    this.makeSearch(`${term} ${this.props.sport}`);
  }

  componentDidMount() {
    fetch(apiUrl + 'file?name=' + this.props.fileName)
      .then(res => res.json())
      .then(list => {
        this.setState({listSet: this.makeListSet(list)});
        this.setList(1)
      });
  }

  makeListSet = (list) => {
    let ret = {};
    let chunk = [];
    for (let item of list) {
      chunk.push(item);
      if (chunk.length === 100) {
        ret[chunk[0][0]] = chunk;
        chunk = [];
      }
    }
    return ret;
  }

  setList = (key) => {
    this.setState({ list: this.state.listSet[key]})
  }

  saveImage (img) {
    let file = img.split("/")
    let fileName = file[file.length - 1];
    let playerName = this.state.term;

    fetch(`${apiUrl}saveImage?fileName=${fileName}&playerName=${playerName}&sport=${this.props.sport.toLowerCase()}`)
      .then(res => res.json());
  }

  render() {
    let {images, list, listSet, initial} = this.state;
    return (
      <Container className="App" style={{ marginTop: 50 }}>
        <h3 style={{ marginBottom: 50 }}>{this.props.sport}</h3>
        <Row>
          <Col xs={3}>
            <SelectRows set={listSet} setList={this.setList.bind(this)} />
            <ListGroup style={{ height: 700, overflowY: "scroll" }}>
              {list.map(item => (
                <ListGroupItem
                  key={item[0]}
                  active={item[1] === this.state.term}
                  onClick={() => this.startSearch(item[1])}
                >{item[0]} - {item[1]}</ListGroupItem>)
              )}
            </ListGroup>
          </Col>
          <Col xs={9}>
            {images.length === 0 && !initial && <h1>No Results Found</h1>}
            {images.length > 0 && <div>
              <ul>
                {images.map((img, i) => <Card key={i} style={{ display: "inline-block", marginBottom: 10 }}>
                  <Img src={img.contentUrl} style={{ height: 150 }} />
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
            </div>}
          </Col>
        </Row>
      </Container>
    );
  }
}

const SelectRows = ({ set, setList }) => (
  <FormGroup>
    <Input type="select" name="select" id="exampleSelect" onChange={i => setList(i.target.value)}>
      {Object.keys(set).map(item => <option key={item}>{set[item][0][0]}</option>)}
    </Input>
  </FormGroup>
)

export default App;
