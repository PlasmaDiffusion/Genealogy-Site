import React, { Component } from "react";
import OktaSignIn from "@okta/okta-signin-widget";

class LoginPage extends Component {
  constructor() {
    super();

    this.state = { user: null };

    //Initialize sign in instance
    this.widget = new OktaSignIn({
      baseUrl: "https://dev-286829.okta.com", //"https://dev-286829.okta.com/oauth2/default",
      clientId: "0oam6b0jtnJpBC5OY4x6",
      redirectUri: window.location.origin + "/admin",
      authParams: {
        responseType: "id_token",
      },
    });

    this.showLogin = this.showLogin.bind(this);
    this.logout = this.logout.bind(this);
  }

  //Check if logged in already, if not then show login
  componentDidMount() {
    this.widget.session.get((response) => {
      if (response.status !== "INACTIVE") {
        this.setState({ user: response.login });
      } else {
        this.showLogin();
      }
    });
  }

  //didMount calls this if the user isn't logged in
  showLogin() {
    //Backbone.history.stop();
    this.widget.renderEl(
      { el: this.loginContainer },
      (response) => {
        console.log("res:", response);
        this.setState({ user: response.claims.email });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  logout() {
    try {
      this.widget.signOut(() => {
        this.setState({ user: null });
        this.showLogin();
      });
    } catch (err) {
      // Silently ignore no such session errors
      console.log(err);
      if (err.errorCode !== "E0000007") {
        throw err;
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.user ? (
          <div className="container">
            <div>Welcome, {this.state.user}!</div>
            <button onClick={this.logout}>Logout</button>
          </div>
        ) : null}
        {this.state.user ? null : (
          <div
            ref={(div) => {
              this.loginContainer = div;
            }}
          />
        )}
      </div>
    );
  }
}

export default LoginPage;
