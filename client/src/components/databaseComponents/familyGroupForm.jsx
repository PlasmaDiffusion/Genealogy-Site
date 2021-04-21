import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { getClientUrl, getServerUrl } from "../../services/getUrl.js";
import Family from "./family";
import FamilyLink from "./familyLink";

import axios from "axios";

//A form that has a grid of family names to show on the family tree (From the big tree on the home page).
class FamilyGroupForm extends Component {
  constructor(props) {
    super(props);

    var nameArray = [];
    for (let i = 0; i < this.props.length; i++) nameArray.push("");

    this.state = {
      names: new Array(this.props.length),
      familyLinkOrder: new Array(this.props.length),
    };

    //Grid size goes here
    this.rows = 5;
    this.cols = 5;

    console.log(this.state.names);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeFamilyLinkOrder = this.onChangeFamilyLinkOrder.bind(this);
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
        if (response.data.linkOrder) {
          this.setState({
            familyLinkOrder: response.data.linkOrder,
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

    //serviceson to submit (Either grid of names or grid of link order)
    var familyGroupToSubmit = null;

    if (this.props.modifyingHomePage)
      familyGroupToSubmit = {
        names: this.state.names,
      };
    else
      familyGroupToSubmit = {
        linkOrder: this.state.familyLinkOrder,
      };

    axios
      .post(getServerUrl() + "/edit/familyGroup", familyGroupToSubmit)
      .then((res) => {
        console.log(res.data);
        alert(res.data);
        window.location.replace(getClientUrl() + "/admin");
      });
  }

  onChangeName(e) {
    //Get a copy of the previous name arrays to modify them
    var newNames = [...this.state.names];

    console.log(e);

    newNames[e.target.id] = e.target.value;

    this.setState({
      names: newNames,
    });
  }

  onChangeFamilyLinkOrder(e) {
    //Get a copy of the previous link order arrays to modify them
    var newLinkOrder = [...this.state.familyLinkOrder];

    console.log(e);

    newLinkOrder[e.target.id] = e.target.value;

    this.setState({
      familyLinkOrder: newLinkOrder,
    });
  }

  //Get a column of a single input field
  getInputField(index) {
    return this.props.modifyingHomePage ? (
      <div class="col-md-4 margin-n">
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
    ) : (
      <div class="col-md-4 margin-n">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            value={this.state.familyLinkOrder[index]}
            onChange={this.onChangeFamilyLinkOrder}
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
        {this.props.modifyingHomePage ? (
          <h1>Homepage Family Grid</h1>
        ) : (
          <h1>Family Link Order Grid</h1>
        )}

        {this.props.modifyingHomePage ? (
          <p class="alert alert-warning">
            These names appear on the tree in the homepage, in a grid like
            pattern. <br></br>Once clicked, all families containing those names
            will be displayed. <br></br>(Enter "McNee" in here to have that
            button lead to families containg the word "McNee" in their name.)
          </p>
        ) : (
          <p class="alert alert-warning">
            Enter numbers in the grid. (place 1 somewhere, then 2...) Blank
            spaces won't have any links there.
            <br></br> This will be the order they appear in after a name on the
            homepage is clicked.
          </p>
        )}

        <form onSubmit={this.onSubmitFamilyGroup}>
          <div class="container">
            {rowArray.map((val, index) => this.getInputRow(index * this.cols))}
          </div>

          <div className="form-group">
            <input
              type="submit"
              value={
                this.props.modifyingHomePage
                  ? "Change Home Page Tree"
                  : "Change Family Link Order"
              }
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default FamilyGroupForm;
