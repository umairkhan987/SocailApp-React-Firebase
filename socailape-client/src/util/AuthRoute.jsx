import React from "react";
import { Route, Redirect } from "react-router-dom";

const AuthRoute = ({ component: Componenet, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      authenticated === true ? <Redirect to="/" /> : <Componenet {...props} />
    }
  />
);

export default AuthRoute;
