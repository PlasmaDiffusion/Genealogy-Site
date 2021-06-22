import React, { useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";

function Profile(props) {
  //This component checks if the user is logged in and if they're an admin, they call a parent prop function
  const { user } = useAuth0();
  const { name, picture, email } = user;


  useEffect(() => {
    //Call a parent function to enable admin stuff, if it was set
    if (props.onAuthenticated) props.onAuthenticated();

  }, [])



  //Check if not logged in
  if (!user) return <div>Not logged in</div>

  if (user.email != process.env.REACT_APP_ADMIN1 && user.email != process.env.REACT_APP_ADMIN2)
    return <p className="user">Not logged in as an admin. ({name})</p>
  else {


    return <div>
      <p className="user">Logged in as {name}</p>
    </div>
  }
};

export default Profile;
