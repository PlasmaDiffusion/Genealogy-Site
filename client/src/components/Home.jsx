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

import Navbar from "./navbar/navbar";
import FamilyAdmin from "./databaseComponents/familyAdmin";
import FamilyLinkTree from "./tree/familyLinkTree";
import PersonEditor from "./databaseComponents/personEditor";
import FamilyEditor from "./databaseComponents/familyEditor";
import FamilyDetails from "./familyDetails";
import Login from "./auth/login";
import Logout from "./auth/logout";

export default withOktaAuth(
  class Home extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <Router>
          <div>
            
          <Navbar />


            <Switch>
              {/* Stuff the average user will see */}
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

              {/* Stuff the admins will see */}
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
