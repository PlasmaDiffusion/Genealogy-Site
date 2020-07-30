import React, { Component } from "react";
import { getClientUrl, getServerUrl } from "../getUrl.js";

import axios from "axios";

//Iterate through family data here
const Family = (props) => (
  <React.Fragment>
    <a
      href={"/family/ ?id=" + props.family._id}
      title={props.family.description}
    >
      {props.family.name}
    </a>
  </React.Fragment>
);

class FamilyLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      families: [],
    };
  }

  //Read in data
  componentDidMount() {
    console.log("About to connect to " + getServerUrl() + "/read/family");

    axios
      .get(getServerUrl() + "/read/family")
      .then((response) => {
        console.log("Family Response: ", response.data);
        this.setState({ families: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //Show links to families
  familyList() {
    return this.state.families.map(function (currentFamily, i) {
      return <Family family={currentFamily} key={i} />;
    });
  }

  //Render a sidebar with links to families
  render() {
    return (
      <React.Fragment>
        <div id="mySidenav" class="sidenav">
          {this.familyList()}
        </div>
      </React.Fragment>
    );
  }
}

export default FamilyLink;
