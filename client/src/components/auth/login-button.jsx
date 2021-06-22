import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "reactstrap";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button
      onClick={() => loginWithRedirect()} //Redirects to the /authorize part of the url
      className="navButton"
    >
      Log In
    </button>
  );
};

export default LoginButton;
