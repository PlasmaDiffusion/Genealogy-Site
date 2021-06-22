import React from "react";

import { useAuth0 } from "@auth0/auth0-react";

const Profile = (props) => {
  //This component checks if the user is logged in and if they're an admin, they call a parent prop function
  const { user } = useAuth0();

  //Check if not logged in
  if (!user) return <div>Not logged in</div>;

  const { name, picture, email } = user;

  if (user.email != process.env.ADMIN1 && user.email != process.env.ADMIN2)
    return <p>Not logged in as an admin.</p>;
  else {

    //Call a parent function to enable admin stuff, if it was set
    if (props.onAuthenticated) props.onAuthenticated();

    return <p>Logged in as {name}</p>
  }
};

export default Profile;
