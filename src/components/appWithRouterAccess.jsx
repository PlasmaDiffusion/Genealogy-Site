import React from "react";
import { Route, useHistory } from "react-router-dom";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";
import Login from "./auth/Login";
import Logout from "./auth/Logout";
import FamilyAdder from "./databaseComponents/familyAdder";
import FamilyLink from "./databaseComponents/familyLink";
import FamilyEditor from "./databaseComponents/familyEditor";
import PersonEditor from "./databaseComponents/personEditor";

const AppWithRouterAccess = () => {
  const history = useHistory();
  const onAuthRequired = () => {
    history.push("/login");
  };

  return (
    <Security
      issuer="https://dev-286829.okta.com/oauth2/default"
      clientId="0oam6b0jtnJpBC5OY4x6"
      redirectUri={window.location.origin + "/implicit/callback"}
      onAuthRequired={onAuthRequired}
      pkce={true}
    >
      <SecureRoute path="/admin" component={FamilyAdder}>
        <FamilyLink />
        <Logout issuer="https://dev-286829.okta.com/oauth2/default" />
      </SecureRoute>
      <SecureRoute path="/edit/person/:id" component={PersonEditor} />
      <SecureRoute path="/edit/family/:id" component={FamilyEditor} />

      <Route
        path="/login"
        render={() => (
          <Login issuer="https://dev-286829.okta.com/oauth2/default" />
        )}
      />
      <Route path="/implicit/callback" component={LoginCallback} />
    </Security>
  );
};
export default AppWithRouterAccess;
