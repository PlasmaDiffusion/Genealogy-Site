import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../databaseComponents/familyAdmin.scss";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button
      onClick={() => loginWithRedirect()} //Redirects to the /authorize part of the url
      className="logIn"
    >
      Log In
    </button>
  );
};

export default LoginButton;
