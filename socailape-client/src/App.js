import React from 'react';
import { Route, Switch } from "react-router-dom";
import './App.css';
import Navbar from './components/navbar';

//pages
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
