import React, { Component } from "react";
import { getClientUrl, getServerUrl } from "../getUrl.js";

import axios from "axios";

//Read in families, and show non sub families as links on the sidebar.
class FamilyLinkTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      families: [],
      rootFamily: "", //Root family that all sub families should belong to
    };

    this.filterOutSubFamilies = this.filterOutSubFamilies.bind(this);
    this.displayFamily = this.displayFamily.bind(this);
  }

  //Read in data
  componentDidMount() {
    console.log("About to connect to " + getServerUrl() + "/read/family");

    axios
      .get(getServerUrl() + "/read/family")
      .then((response) => {
        //Collect families here
        console.log("Family Response: ", response.data);
        this.setState({ families: response.data });

        //Remove the families we don't need (Either sub families or families not part of a specific family tree)
        if (this.props.rootFamily) this.filterOutSubFamilies();
        else this.filterOutWrongFamilies();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //Overwrite the families state to ONLY use regular families
  filterOutSubFamilies() {
    var filteredArray = [];

    this.state.families.forEach((family) => {
      if (family.subFamily) {
        if (family.rootFamily == this.props.rootFamily)
          filteredArray.push(family);
      }
    });

    //Get a copy of this new array for the families state
    this.setState({ families: [...filteredArray] });
  }

  //Overwrite the families state to ONLY use regular families
  filterOutWrongFamilies() {
    var filteredArray = [];

    this.state.families.forEach((family) => {
      if (!family.subFamily) filteredArray.push(family);
    });

    //Get a copy of this new array for the families state
    this.setState({ families: [...filteredArray] });
  }

  //Either return the family of the particular index or return nothing if it doesn't exist
  displayFamily(i) {
    return this.state.families[i] ? (
      <Family
        family={this.state.families[i]}
        key={i}
        editing={this.props.editing}
      />
    ) : (
      ""
    );
  }

  //Render a sidebar with links to families
  render() {
    return (
      <React.Fragment>
        <img
          src={process.env.PUBLIC_URL + "/images/bigTree.png"}
          id={"treeImg"}
        ></img>
        <div class="container">
          <div class="row">
            <div class="col-sm">
              <h1> {this.displayFamily(0)} </h1>
            </div>
            <div class="col-sm">
              <h1 style={{ visibility: "hidden" }}> | </h1>
            </div>
            <div class="col-sm">
              <h1> {this.displayFamily(1)} </h1>
            </div>
          </div>
          <div class="row">
            <div class="col-sm">
              <h1 style={{ visibility: "hidden" }}> | </h1>
            </div>
            <div class="col-sm">
              <h1 style={{ visibility: "hidden" }}> | </h1>
            </div>
            <div class="col-sm">
              <h1 style={{ visibility: "hidden" }}> | </h1>
            </div>
          </div>
          <div class="row">
            <div class="col-sm">
              <h1> {this.displayFamily(2)} </h1>
            </div>
            <div class="col-sm">
              <h1 style={{ visibility: "hidden" }}> | </h1>
            </div>
            <div class="col-sm">
              <h1> {this.displayFamily(3)} </h1>
            </div>
          </div>
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

export default FamilyLinkTree;
