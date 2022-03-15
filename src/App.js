import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Admin from './Admin';
import './App.css';
import { ProvideAuth } from './hooks/useAuth';
import Itercage from './Itercage';
import Top from './Top';

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
