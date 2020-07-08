import React from 'react';
import { Route, Switch } from "react-router-dom";
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import './App.css';

import Navbar from './components/layout/navbar';
import AuthRoute from './util/AuthRoute';
//Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
// material-ui
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
//pages
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import themeObject from './util/theme';


const theme = createMuiTheme(themeObject);

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = '/login';
  }
  else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <AuthRoute exact path="/login" component={Login} />
            <AuthRoute exact path="/signup" component={Signup} />
          </Switch>
        </div>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
