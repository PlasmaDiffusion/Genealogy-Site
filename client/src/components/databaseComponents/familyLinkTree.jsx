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

    //Grid size goes here
    this.rows = 3;
    this.cols = 5;

    this.filterOutSubFamilies = this.filterOutSubFamilies.bind(this);
    this.filterOutWrongFamilies = this.filterOutWrongFamilies.bind(this);
    this.displayFamily = this.displayFamily.bind(this);
  }

  //Read in data
  componentDidMount() {
    console.log("About to connect to " + getServerUrl() + "/read/familyGroup");

    axios
      .get(getServerUrl() + "/read/familyGroup")
      .then((response) => {
        //Collect families here
        console.log("Family Response: ", response.data);
        this.setState({ families: response.data.names });
        console.log("Fam", this.state.families);

        //Remove the families we don't need (Either sub families or families not part of a specific family tree)
        /*if (this.props.rootFamily) this.filterOutSubFamilies();
        else this.filterOutWrongFamilies();*/
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
      <Family name={this.state.families[i]} key={i} />
    ) : (
      ""
    );
  }

  //Get a column of a single input field
  getTreeColumn(index) {
    return <div class="col-sm-2">{this.displayFamily(index)}</div>;
  }

  //Get a row of several input fields
  getTreeRow(index) {
    //Simulate a for loop
    let colArray = [];
    for (let i = 0; i < this.cols; i++) colArray.push("");

    return (
      <div class="row">
        {colArray.map((val, i) => this.getTreeColumn(index + i))}
      </div>
    );
  }

  //Render a sidebar with links to families
  render() {
    //Simualte a for loop
    let rowArray = [];
    for (let i = 0; i < this.rows; i++) rowArray.push("");

    return (
      <React.Fragment>
        <img
          src={process.env.PUBLIC_URL + "/images/bigTree.png"}
          id={"treeImg"}
        ></img>
        <div class="container">
          {rowArray.map((val, index) => this.getTreeRow(index * this.cols))}
        </div>
        {/*
        <div class="container">
          <div class="row">
            <div class="col-sm-2">
              <h2> {this.displayFamily(0)} </h2>
            </div>
            <div class="col-sm-2">
              <h2 style={{ visibility: "hidden" }}> | </h2>
            </div>
            <div class="col-sm-2">
              <h2> {this.displayFamily(1)} </h2>
            </div>
            <div class="col-sm-2">
              <h2 style={{ visibility: "hidden" }}> | </h2>
            </div>
            <div class="col-sm-2">
              <h2 style={{ visibility: "hidden" }}> | </h2>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-2">
              <h2 style={{ visibility: "hidden" }}> | </h2>
            </div>
            <div class="col-sm-2">
              <h2 style={{ visibility: "hidden" }}> | </h2>
            </div>
            <div class="col-sm-2">
              <h2 style={{ visibility: "hidden" }}> | </h2>
            </div>
            <div class="col-sm-2">
              <h2 style={{ visibility: "hidden" }}> | </h2>
            </div>
            <div class="col-sm-2">
              <h2 style={{ visibility: "hidden" }}> | </h2>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-2">
              <h2> {this.displayFamily(2)} </h2>
            </div>
            <div class="col-sm-2">
              <h2 style={{ visibility: "hidden" }}> | </h2>
            </div>
            <div class="col-sm-2">
              <h2> {this.displayFamily(3)} </h2>
            </div>
            <div class="col-sm-2">
              <h2 style={{ visibility: "hidden" }}> | </h2>
            </div>
            <div class="col-sm-2">
              <h2 style={{ visibility: "hidden" }}> | </h2>
            </div>
            <div class="col-sm-2">
              <h2 style={{ visibility: "hidden" }}> | </h2>
            </div>
          </div>
        </div>
        */}
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
      <h2>
        <a href={"/familyTree/ ?name=" + props.name}>{props.name}</a>
      </h2>
    </React.Fragment>
  );

export default FamilyLinkTree;
