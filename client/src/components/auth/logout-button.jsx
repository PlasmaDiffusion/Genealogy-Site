import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "reactstrap";

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button
      onClick={() =>
        logout({
          returnTo: window.location.origin, //Make sure origins are set in the Auth0 settings
        })
      }
      className="navButton"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
