import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import NullChecker from "./classes/nullChecker.js";
import Family from "./family";
import FamilyLink from "./familyLink";

import axios from "axios";

//BUG: Submiting a family update without touching the children, removes all children.
//A form that can be used to add new familys or to edit existing ones (Pass in editing = true or false as a prop)
class FamilyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      families: [],
      persons: [],
      showChildren: [],

      //Input for a family
      familyName: "",
      initialName: "",
      familyDescription: "",
      parentA: "",
      parentB: "",
      children: [],
    };

    this.onChangeParentA = this.onChangeParentA.bind(this);
    this.onChangeParentB = this.onChangeParentB.bind(this);
    this.onChangeFamilyName = this.onChangeFamilyName.bind(this);
    this.onChangeFamilyDescription = this.onChangeFamilyDescription.bind(this);

    this.onChangeChild = this.onChangeChild.bind(this);

    this.onSubmitFamily = this.onSubmitFamily.bind(this);
    this.childInputList = this.childInputList.bind(this);
    this.addChildInput = this.addChildInput.bind(this);
    this.removeChildInput = this.removeChildInput.bind(this);
  }

  //Connect to the database and get data here! ------------------------------
  componentDidMount() {
    console.log("About to connect");

    //Unless a general form for adding, load in data for editing an existing family
    if (this.props.editing) {
      var url = new URLSearchParams(window.location.search);
      var id = url.get("id");
      this.setState({ objectId: id });

      axios
        .get(window.location.origin + "/read/family/" + id)
        .then((response) => {
          console.log("Family Response: ", response.data);

          //This component will break if it doesn't handle null data
          const nullChecker = new NullChecker();
          nullChecker.familyNullCheck([response.data]);
          //Set family data to fill in on the form
          this.setState({
            familyName: response.data.name,
            initialName: response.data.name,
            familyDescription: response.data.description,
            parentA: response.data.parentA.name,
            parentB: response.data.parentB.name,
            children: response.data.children,
          });

          console.log("Children:", this.state.children);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    //Read in people to enter in family form dropdowns
    axios
      .get("http://localhost:4000/read/person")
      .then((response) => {
        console.log("Person Response: ", response.data);
        this.setState({ persons: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //Give a selection of people
  personDropdown() {
    return this.state.persons.map(function (currentPerson, i) {
      return <option value={currentPerson.name}>{currentPerson.name}</option>;
    });
  }

  //Submit form data here -----------------------------------------------
  onSubmitFamily(e) {
    e.preventDefault();

    //Json
    const familyToSubmit = {
      name: this.state.familyName,
      description: this.state.familyDescription,
      parentA: this.state.parentA,
      parentB: this.state.parentB,
      children: this.state.children,
    };

    //Name and parents must be filled in at the very least.
    if (
      familyToSubmit.name == "" ||
      familyToSubmit.name == null ||
      familyToSubmit.parentA == "" ||
      familyToSubmit.parentA == null ||
      familyToSubmit.parentB == "" ||
      familyToSubmit.parentB == null
    )
      return;

    if (this.props.editing) {
      //Edit a family or...
      axios
        .post(
          "http://localhost:4000/edit/family/" + this.state.objectId,
          familyToSubmit
        )
        .then((res) => {
          console.log(res.data);
          alert(res.data);
          window.location.replace("http://localhost:3000/admin");
        });
    } //Add a new family
    else {
      axios
        .post("http://localhost:4000/add/family", familyToSubmit)
        .then((res) => {
          console.log(res.data);
          alert(res.data);
          window.location.replace("http://localhost:3000/admin");
        });
    }

    //Reset input values
    this.setState({
      name: "",
      description: "",
      birthdate: "",
      deathdate: "",
    });
  }

  onChangeFamilyName(e) {
    this.setState({ familyName: e.target.value });
  }

  onChangeFamilyDescription(e) {
    this.setState({ familyDescription: e.target.value });
  }

  onChangeParentA(e) {
    this.setState({ parentA: e.target.value });
  }

  onChangeParentB(e) {
    this.setState({ parentB: e.target.value });
  }

  onChangeChild(e) {
    let newChildren = [...this.state.children];

    newChildren[e.target.list.id] = e.target.value;

    this.setState({
      children: newChildren,
    });
  }

  //Dynamic "Add child" list
  childInputList() {
    var obj = this;
    return this.state.children.map(function (currentChild, i) {
      return (
        <div className="form-group">
          <label>Child: </label>
          <input
            type="text"
            className="form-control"
            value={currentChild.name}
            onChange={obj.onChangeChild}
            list={i}
          />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => obj.removeChildInput(i)}
            value={i}
          >
            X
          </button>
          <datalist id={i}>{obj.personDropdown()}</datalist>
        </div>
      );
    });
  }

  addChildInput() {
    console.log("Adding child", this);
    this.setState((prevState) => ({
      children: [...prevState.children, ""],
    }));
  }

  //Remove a specific child
  removeChildInput(index) {
    console.log("Removing child", index);
    console.log("Children before removal", this.state.children);

    let newChildrenArray = [];

    if (index > -1 && index < this.state.children.length) {
      newChildrenArray = [...this.state.children];
      newChildrenArray.splice(index, 1);

      this.setState({
        children: newChildrenArray,
      });
    } else console.log("Invalid array index");
  }

  render() {
    return (
      <div>
        {/*Submit family form*/}

        <h1>
          {this.props.editing
            ? "Edit Family: " + this.state.initialName
            : "Add a Family"}
        </h1>
        <h2>
          <i>{this.state.initialName}</i>
        </h2>
        <form onSubmit={this.onSubmitFamily}>
          <div className="form-group">
            <label>Family Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.familyName}
              onChange={this.onChangeFamilyName}
              required
            />
          </div>

          <div className="form-group">
            <label>Family Description: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.familyDescription}
              onChange={this.onChangeFamilyDescription}
            />
          </div>

          <div className="form-group">
            <label>Parent A: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.parentA}
              onChange={this.onChangeParentA}
              list="parentA"
              required
            />
            <datalist id="parentA">{this.personDropdown()}</datalist>
          </div>

          <div className="form-group">
            <label>Parent B: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.parentB}
              onChange={this.onChangeParentB}
              list="parentB"
              required
            />
            <datalist id="parentB">{this.personDropdown()}</datalist>
          </div>

          {this.childInputList()}

          <button
            type="button"
            onClick={this.addChildInput}
            class="btn btn-secondary"
          >
            + Child
          </button>

          <div className="form-group">
            <input
              type="submit"
              value={this.props.editing ? "Update Family" : "Add Family"}
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default FamilyForm;
