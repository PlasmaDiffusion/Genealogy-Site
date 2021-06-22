import React from "react";
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";

//Private routes aren't accessible unless the user is logged in.
const PrivateRoute = ({ component, ...args }) => (
  <Route
    component={withAuthenticationRequired(component, {
      onRedirecting: () => <p>Loading</p>,
    })}
    {...args}
  />
);

export default PrivateRoute;
