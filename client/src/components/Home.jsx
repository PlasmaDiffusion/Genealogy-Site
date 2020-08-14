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

import {
  Security,
  SecureRoute,
  LoginCallback,
  useOktaAuth,
  withOktaAuth,
} from "@okta/okta-react";

import FamilyAdmin from "./databaseComponents/familyAdmin";
import FamilyLink from "./databaseComponents/familyLink";
import FamilyLinkTree from "./databaseComponents/familyLinkTree";
import PersonEditor from "./databaseComponents/personEditor";
import FamilyEditor from "./databaseComponents/familyEditor";
import FamilyDetails from "./familyDetails";
import Login from "./auth/Login";
import Logout from "./auth/Logout";

export default withOktaAuth(
  class Home extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      const button = this.props.authState.isAuthenticated ? (
        <button
          onClick={() => {
            this.props.authService.logout();
          }}
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => {
            this.props.authService.login();
          }}
        >
          Login
        </button>
      );

      return (
        <Router>
          <div>
            <div
              style={{ backgroundColor: "lightblue", padding: 10, margin: 0 }}
            >
              <Link to=""> Home </Link>
              <br></br>
              <hr />
            </div>

            {/*
            A <Switch> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Switch> any time
            you have multiple routes, but you want only one
            of them to render at a time
          */}
            <Switch>
              <Route exact path="/">
                <FamilyLinkTree onHomePage={true} />
              </Route>
              <Route path="/familyTree/:name">
                <FamilyLinkTree onHomePage={false} />
              </Route>
              <Route path="/family/:id">
                <FamilyDetails />
              </Route>
              <Route path="/logged_out">
                <p>You have been logged out.</p>
              </Route>

              <SecureRoute path="/admin" component={FamilyAdmin} />
              <SecureRoute path="/logout" component={Logout} />
              <SecureRoute path="/edit/person/:id" component={PersonEditor} />
              <SecureRoute path="/edit/family/:id" component={FamilyEditor} />

              <Route exact path="/login">
                <Login issuer="https://dev-286829.okta.com/oauth2/default" />
              </Route>

              <Route
                exact
                path="/implicit/callback"
                component={LoginCallback}
              />
            </Switch>
          </div>
        </Router>
      );
    }
  }
);
