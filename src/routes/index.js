import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Football from './Football';
import Cricket from "./Cricket"

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home}/>
      <Route path="/football" exact component={Football}/>
      <Route path="/cricket" exact component={Cricket}/>
    </Switch>
  </BrowserRouter>
)
