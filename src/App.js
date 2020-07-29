import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Match,
  useParams,
  useHistory,
} from "react-router-dom";
import Home from "./components/Home";
import "./App.css";

import {
  Security,
  SecureRoute,
  LoginCallback,
  useOktaAuth,
} from "@okta/okta-react";

export default function BasicExample() {
  const history = useHistory();
  const onAuthRequired = () => {
    if (history) history.push("/login");
  };

  return (
    <Security
      issuer="https://dev-286829.okta.com/oauth2/default"
      clientId="0oam6b0jtnJpBC5OY4x6"
      redirectUri={window.location.origin + "/implicit/callback"}
      onAuthRequired={onAuthRequired}
      pkce={true}
    >
      <Home />
    </Security>
  );
}
