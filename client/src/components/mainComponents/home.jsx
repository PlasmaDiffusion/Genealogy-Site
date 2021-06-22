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

function Home() {


  const { isAuthenticated } = useAuth0();


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
          <Route path="/logout">
            {isAuthenticated ? <LogoutButton /> : ""}
          </Route>
          <Route path="/edit/person/:id">
            {isAuthenticated ? <PersonEditor /> : ""}
          </Route>
          <Route path="/edit/family/:id">
            {isAuthenticated ? <FamilyEditor /> : ""}
          </Route>


          <Route exact path="/login">
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </Route>

        </Switch>
      </div>
    </Router>
  );

}

export default Home;
