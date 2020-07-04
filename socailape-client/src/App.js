import React from 'react';
import { Route, Switch } from "react-router-dom";
import jwtDecode from 'jwt-decode';
import './App.css';

import Navbar from './components/navbar';
import AuthRoute from './util/AuthRoute';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

//pages
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#00bcd4",
      dark: "#008394",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ff6333",
      main: "#ff3d00",
      dark: "#b22a00",
      contrastText: "#fff"
    },
  },
  spreadThis: {
    form: {
      textAlign: "center",
    },
    image: {
      margin: "20px auto 20px auto",
    },
    pageTitle: {
      margin: "10px auto 20px auto",
    },
    textField: {
      margin: "10px auto 20px auto",
    },
    button: {
      marginTop: "20px",
      position: "relative",
    },
    customError: {
      color: "red",
      fontSize: "0.8rem",
      margin: "10px",
    },
    progress: {
      position: "absolute",
    },
  }
});

let authenticated;
const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now) {
    window.location = '/login';
    authenticated = false;
  }
  else
    authenticated = true;
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <AuthRoute exact path="/login" component={Login} authenticated={authenticated} />
            <AuthRoute exact path="/signup" component={Signup} authenticated={authenticated} />
          </Switch>
        </div>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
