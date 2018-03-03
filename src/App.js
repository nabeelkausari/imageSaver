import React, { Component } from 'react';
import Img from 'react-image';
import './App.css';
import { Card, CardText, CardBody, Container, Row, Col, ListGroup, ListGroupItem, Label, Input, FormGroup } from 'reactstrap';

import fetch from 'node-fetch';

const apiUrl = "/";
const extraTerm = "football";

class App extends Component {
  state = {
    term: '',
    images: [],
    list: [],
    listSet: {}
  }
  makeSearch(term) {
    fetch(apiUrl + 'api?term='+ term || this.state.term)
      .then(res => res.json())
      .then(images => this.setState({images}))
  }
  startSearch(term) {
    this.setState({ term });
    this.makeSearch(`${term} ${extraTerm}`);
  }

  componentDidMount() {
    fetch(apiUrl + 'file')
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

    fetch(`${apiUrl}saveImage?fileName=${fileName}&playerName=${playerName}`)
      .then(res => res.json());
  }

  render() {
    let {images, list, listSet} = this.state;
    return (
      <Container className="App" style={{ marginTop: 70 }}>
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
            <div>
              <ul>
                {images.map((img, i) => <Card key={i} style={{ display: "inline-block", marginBottom: 10 }}>
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

const SelectRows = ({ set, setList }) => (
  <FormGroup>
    <Input type="select" name="select" id="exampleSelect" onChange={i => setList(i.target.value)}>
      {Object.keys(set).map(item => <option key={item}>{set[item][0][0]}</option>)}
    </Input>
  </FormGroup>
)

export default App;
