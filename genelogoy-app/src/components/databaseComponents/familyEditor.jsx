import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

//Show a form to add families, but also
class FamilyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      families: [],
      persons: [],

      //Input for a family
      name: "",
      description: "",
      parentA: "",
      parentB: "",
      children: [],
    };

    this.onChangeParentA = this.onChangeParentA.bind(this);
    this.onChangeParentB = this.onChangeParentB.bind(this);
    this.onChangeFamilyName = this.onChangeFamilyName.bind(this);
    this.onChangeFamilyDescription = this.onChangeFamilyDescription.bind(this);

    this.onSubmitFamily = this.onSubmitFamily.bind(this);
    this.childInputList = this.childInputList.bind(this);
    this.onChangeChild = this.onChangeChild.bind(this);
    this.addChildInput = this.addChildInput.bind(this);
  }

  //Connect to the databaes and get data here! <------------------------------
  componentDidMount() {
    console.log("About to connect");

    //Read in the family being edited
    var url = new URLSearchParams(window.location.search);
    var id = url.get("id");
    this.setState({ objectId: id });

    axios
      .get("http://localhost:4000/read/family/" + id)
      .then((response) => {
        console.log("Family Response: ", response.data);
        this.setState({
          name: response.data.name,
          description: response.data.description,
          parentA: response.data.parentA.name,
          parentB: response.data.parentB.name,
          children: response.data.children,
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    //Read in people to be selected
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

  onSubmitFamily(e) {
    e.preventDefault();

    //Json
    const updatedFamily = {
      name: this.state.name,
      description: this.state.description,
      parentA: this.state.parentA,
      parentB: this.state.parentB,
      children: this.state.children,
    };

    axios
      .post(
        "http://localhost:4000/edit/family/" + this.state.objectId,
        updatedFamily
      )
      .then((res) => {
        console.log(res.data);

        alert(res.data);
      });
  }

  onChangeFamilyName(e) {
    this.setState({ name: e.target.value });
  }

  onChangeFamilyDescription(e) {
    this.setState({ description: e.target.value });
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

  render() {
    return (
      <div>
        {/*WIP submit family*/}
        <h3>Edit a Family</h3>

        <form onSubmit={this.onSubmitFamily}>
          <div className="form-group">
            <label>Family Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.name}
              onChange={this.onChangeFamilyName}
            />
          </div>

          <div className="form-group">
            <label>Family Description: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.description}
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
              value="Update Family"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default FamilyEditor;
