import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import LoginForm from "./LoginForm";
import { withOktaAuth } from "@okta/okta-react";

export default withOktaAuth(
  class Login extends Component {
    render() {
      console.log(this.props.authState);
      if (this.props.authState.isPending) {
        return <div>Loading...</div>;
      }
      return this.props.authState.isAuthenticated ? (
        <Redirect to={{ pathname: "/admin" }} />
      ) : (
        <LoginForm issuer={this.props.issuer} />
      );
    }
  }
);
