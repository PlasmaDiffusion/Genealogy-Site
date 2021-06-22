import React, { Component, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Match,
  useParams,
  useHistory,
} from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";


import Navbar from "../navbar/navbar";
import FamilyAdmin from "../databaseComponents/familyAdmin";
import FamilyLinkTree from "./tree/familyLinkTree";
import PersonEditor from "../databaseComponents/personEditing/personEditor";
import FamilyEditor from "../databaseComponents/familyEditing/familyEditor";
import FamilyDetails from "./familyViewing/familyDetails";
import LoginButton from "../auth/login-button";
import LogoutButton from "../auth/logout-button";
import PrivateRoute from "../auth/privateRoute";
import Profile from "../auth/profile";

function Home() {


  const { isAuthenticated } = useAuth0();

  const [adminAuth, setAdminAuth] = useState(false);


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

          <PrivateRoute path="/admin" component={FamilyAdmin} />
          <PrivateRoute path="/logout" component={LogoutButton} />
          <PrivateRoute path="/logout" component={LoginButton} />
          <PrivateRoute path="/edit/person/:id" component={PersonEditor} />
          <PrivateRoute path="/edit/family/:id" component={FamilyEditor} />

        </Switch>
      </div>
    </Router>
  );

}

export default Home;
