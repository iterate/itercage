import React from 'react';
import './App.css';
import Itercage from './Itercage';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Top from "./Top";
import Admin from "./Admin";
import {ProvideAuth} from "./hooks/useAuth";

function App() {
  return (
    <ProvideAuth>
      <BrowserRouter>
        <div className="wrapper">
          <div className="iter-container">
            <Switch>
              <Route exact path="/admin" component={Admin} />
              <Route exact path="/top" component={Top} />
              <Route exact path="/" component={Itercage} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </ProvideAuth>
  );
}

export default App;
