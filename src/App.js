import React from 'react';
import './App.css';
import Itercage from './Itercage';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Top from "./Top";
import Admin from "./Admin";

function App() {
  return (
      <BrowserRouter>
        <div className="wrapper">
          <div className="iter-container">
            <Switch>
              <Route exact path="/admin" component={Admin} />
              <Route exact path="/top" component={Top} />
              <Route path="/" component={Itercage} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
  );
}

export default App;
