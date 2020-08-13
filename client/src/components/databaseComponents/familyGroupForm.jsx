import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import NullChecker from "./classes/nullChecker.js";
import { getClientUrl, getServerUrl } from "../getUrl.js";
import Family from "./family";
import FamilyLink from "./familyLink";

import axios from "axios";

//BUG: Submiting a family update without touching the children, removes all children.
//A form that can be used to add new familys or to edit existing ones (Pass in editing = true or false as a prop)
class FamilyGroupForm extends Component {
  constructor(props) {
    super(props);

    var nameArray = [];
    for (let i = 0; i < this.props.length; i++) nameArray.push("");

    this.state = {
      names: [...nameArray],
    };

    //Grid size goes here
    this.rows = 3;
    this.cols = 5;

    console.log(this.state.names);

    this.onChangeName = this.onChangeName.bind(this);
    this.onSubmitFamilyGroup = this.onSubmitFamilyGroup.bind(this);
  }

  //Connect to the database and get data here! ------------------------------
  componentDidMount() {
    console.log("About to connect");

    //Load in the grid of family groups
    axios
      .get(getServerUrl() + "/read/familyGroup")
      .then((response) => {
        console.log("Family Group Response: ", response.data);

        //If found, set the state of names.
        if (response.data.names) {
          this.setState({
            names: response.data.names,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //Submit form data here -----------------------------------------------
  onSubmitFamilyGroup(e) {
    e.preventDefault();

    //Json
    const familyGroupToSubmit = {
      names: this.state.names,
    };

    axios
      .post(getServerUrl() + "/add/familyGroup", familyGroupToSubmit)
      .then((res) => {
        console.log(res.data);
        alert(res.data);
        window.location.replace(getClientUrl() + "/admin");
      });
  }

  onChangeName(e) {
    //Get a copy of the previous child state arrays to modify them
    var newNames = [...this.state.names];

    console.log(e);

    newNames[e.target.id] = e.target.value;

    this.setState({
      names: newNames,
    });
  }

  //Get a column of a single input field
  getInputField(index) {
    return (
      <div class="col-md-4 padding-0">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            value={this.state.names[index]}
            onChange={this.onChangeName}
            id={index}
          />
        </div>
      </div>
    );
  }

  //Get a row of several input fields
  getInputRow(index) {
    //Simulate a for loop
    let colArray = [];
    for (let i = 0; i < this.cols; i++) colArray.push("");

    return (
      <div class="row">
        {colArray.map((val, i) => this.getInputField(index + i))}
      </div>
    );
  }

  render() {
    //Simualte a for loop
    let rowArray = [];
    for (let i = 0; i < this.rows; i++) rowArray.push("");

    return (
      <div>
        {/*Submit family group form*/}

        <h1>Family Tree Grid</h1>
        <p class="alert alert-warning">
          These names appear on the tree in the homepage, in a grid like
          pattern. <br></br>Once clicked, all families containing those names
          will be displayed. <br></br>(Enter "McNee" in here to have that button
          lead to families containg the word "McNee" in their name.)
        </p>
        <form onSubmit={this.onSubmitFamilyGroup}>
          <div class="container">
            {rowArray.map((val, index) => this.getInputRow(index * this.cols))}
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Change Home Page Tree"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default FamilyGroupForm;
