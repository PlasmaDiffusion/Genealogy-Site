import React, { useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";

function Profile(props) {
  //This component checks if the user is logged in and if they're an admin, they call a parent prop function
  const { user } = useAuth0();
  const { name, picture, email } = user;


  useEffect(() => {
    //Call a parent function to enable admin stuff, if it was set
    if (props.onAuthenticated && (user.email == process.env.REACT_APP_ADMIN1 || user.email == process.env.REACT_APP_ADMIN2))
      props.onAuthenticated();

  }, [])



  //Check if not logged in
  if (!user) return <div>Not logged in</div>
  else {


    return <div>
      <p className="user">Logged in as {name} {process.env.REACT_APP_ADMIN1}</p>
    </div>
  }
};

export default Profile;
