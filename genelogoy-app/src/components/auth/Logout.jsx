import React, { Component } from "react";
import { withOktaAuth } from "@okta/okta-react";

// Basic component with logout button
export default withOktaAuth(
  class Logout extends Component {
    constructor(props) {
      super(props);
      this.logout = this.logout.bind(this);
      console.log("AuthState", this.props.authState);
    }

    async logout() {
      // Read idToken before local session is cleared
      const idToken = this.props.authState.idToken;
      const issuer = "https://dev-286829.okta.com/oauth2/default";
      const redirectUri = `${window.location.origin}/logged_out`;

      // Clear local session
      await this.props.authService.logout("/");

      // Clear remote session
      window.location.href = `${issuer}/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${redirectUri}`;
    }

    render() {
      return <a onClick={this.logout}>Logout</a>;
    }
  }

  // withOktaAuth() makes the Okta
  // - "authService" object available as "this.props.authService"
  // - "authState" object available as "this.props.authState"
);
