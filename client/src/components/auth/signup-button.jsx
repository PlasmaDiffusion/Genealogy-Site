import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "reactstrap";


const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button
      onClick={() =>
        loginWithRedirect({
          screen_hint: "signup", //This argument takes you to sign up instead of login
        })
      }
      variant="primary"
      className="btn-margin"
    >
      Sign Up
    </Button>
  );
};

export default SignupButton;
