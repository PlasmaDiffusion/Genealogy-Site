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
import NavBar from "./components/unused/navbar";
import Counters from "./components/unused/counters";
import FamilyAdder from "./components/databaseComponents/familyAdder";
import FamilyLink from "./components/databaseComponents/familyLink";
import PersonEditor from "./components/databaseComponents/personEditor";
import FamilyEditor from "./components/databaseComponents/familyEditor";
import FamilyDetails from "./components/familyDetails";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import appWithRouterAccess from "./components/appWithRouterAccess";
import "./App.css";
import AppWithRouterAccess from "./components/appWithRouterAccess";

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
