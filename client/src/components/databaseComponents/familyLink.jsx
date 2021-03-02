import React, { Component } from "react";
import { getClientUrl, getServerUrl } from "../getUrl.js";

import axios from "axios";

//Read in families, and show non sub families as links on the sidebar. (This is used in the admin pages. FamilyLinkTree is used on the home pages.)
class FamilyLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      families: [],
    };

    this.familyList = this.familyList.bind(this);
  }

  //Read in data
  componentDidMount() {
    //console.log("About to connect to " + getServerUrl() + "/read/family");

    axios
      .get(getServerUrl() + "/read/family")
      .then((response) => {
        //console.log("Family Response: ", response.data);
        this.setState({ families: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //Show links to families
  familyList() {
    var thisObj = this;
    return this.state.families.map(function (currentFamily, i) {
      return currentFamily.subFamily ? (
        ""
      ) : (
        <React.Fragment>
          <FamilyWithEdit
            family={currentFamily}
            key={i}
            editing={thisObj.props.editing}
          />
          <Family
            family={currentFamily}
            key={i}
            editing={thisObj.props.editing}
          />
        </React.Fragment>
      );
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

//Put links here to later be put on the sidebar
const Family = (props) =>
  props.editing ? (
    <React.Fragment />
  ) : (
    <React.Fragment>
      <a
        href={
          "/family/ ?id=" + props.family._id + "&baseId=" + props.family._id
        }
        title={props.family.description}
      >
        {props.family.name}
      </a>
    </React.Fragment>
  );

//Family links appear here in a table, both to the actual page and an edit link
const FamilyWithEdit = (props) =>
  props.editing ? (
    <React.Fragment>
      <table class="table table-sm">
        <tbody>
          <tr scope="row">
            <td scope="col">
              <a
                href={
                  "/family/ ?id=" +
                  props.family._id +
                  "&baseId=" +
                  props.family._id
                }
                title={props.family.description}
              >
                {props.family.name}
              </a>
            </td>
            <td scope="col">
              <a
                class="btn btn-link btn-sm"
                href={"/edit/family/ ?id=" + props.family._id}
              >
                (Edit)
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </React.Fragment>
  ) : (
    <React.Fragment />
  );

export default FamilyLink;
