import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

const Person = (props) => (
  <div id={props.id}>
    <tr>
      <td>{props.name}</td>
    </tr>
    <tr>
      <td>{props.description}</td>
    </tr>
    <tr>
      <td>{props.birthdate}</td>
    </tr>
    <tr>
      <td>{props.deathdate}</td>
    </tr>
  </div>
);

//Iterate through family data here
const Family = (props) => (
  <React.Fragment>
    <tr>
      <td>{props.family.parentA.name}</td>
      <td>{props.family.parentB.name}</td>
    </tr>
    <tr>
      <td>{props.family.parentA.description}</td>
      <td>{props.family.parentB.description}</td>
    </tr>
    <tr>
      <td>{props.family.parentA.birthdate}</td>
      <td>{props.family.parentB.birthdate}</td>
    </tr>
    <tr>
      <td>{props.family.parentA.deathdate}</td>
      <td>{props.family.parentB.deathdate}</td>
    </tr>
    <tr>
      <button
        class="btn btn-primary"
        type="button"
        data-toggle="collapse"
        data-target={"#" + props.family._id}
        aria-expanded="false"
        aria-controls={"#" + props.family._id}
      >
        Show Children
      </button>
    </tr>
    <tr id={props.family._id}>
      {props.family.children.map((child) => (
        <Person //Iterate through child data here
          name={child.name}
          description={child.description}
          birthdate={child.birthdate}
          deathdate={child.deathdate}
          id={child.id}
        />
      ))}
    </tr>
  </React.Fragment>
);

//Show a form to add families, but also
class FamilyAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      families: [],
      persons: [],

      //Input for a person
      name: "",
      description: "",
      birthdate: "",
      deathdate: "",

      //Input for a family
      familyName: "",
      familyDescription: "",
      parentA: "",
      parentB: "",
      children: [],
    };

    this.onChangeParentA = this.onChangeParentA.bind(this);
    this.onChangeParentB = this.onChangeParentB.bind(this);
    this.onChangeFamilyName = this.onChangeFamilyName.bind(this);
    this.onChangeFamilyDescription = this.onChangeFamilyDescription.bind(this);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeBirthdate = this.onChangeBirthdate.bind(this);
    this.onChangeDeathdate = this.onChangeDeathdate.bind(this);
    this.onChangeChild = this.onChangeChild.bind(this);

    this.onSubmitPerson = this.onSubmitPerson.bind(this);
    this.onSubmitFamily = this.onSubmitFamily.bind(this);
    this.childInputList = this.childInputList.bind(this);
    this.addChildInput = this.addChildInput.bind(this);
  }

  componentDidMount() {
    console.log("About to connect");
    axios
      .get("http://localhost:4000/read/family")
      .then((response) => {
        console.log("Family Response: ", response.data);
        this.setState({ families: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });

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

  //Show family
  familyList() {
    console.log("fam", this.state.families);
    return this.state.families.map(function (currentFamily, i) {
      return <Family family={currentFamily} key={i} />;
    });
  }

  //Give a selection of people
  personDropdown() {
    return this.state.persons.map(function (currentPerson, i) {
      return <option value={currentPerson.name}>{currentPerson.name}</option>;
    });
  }

  //Read in form data here
  onSubmitPerson(e) {
    e.preventDefault();

    const newPerson = {
      name: this.state.name,
      description: this.state.description,
      birthdate: this.state.birthdate,
      deathdate: this.state.deathdate,
    };

    axios
      .post("http://localhost:4000/add/person", newPerson)
      .then((res) => console.log(res.data));

    //Reset input values
    this.setState({
      name: "",
      description: "",
      birthdate: "",
      deathdate: "",
    });
  }

  onSubmitFamily(e) {
    e.preventDefault();

    //Json
    const newFamily = {
      name: this.state.familyName,
      description: this.state.familyDescription,
      parentA: this.state.parentA,
      parentB: this.state.parentB,
      children: this.state.children,
    };

    axios
      .post("http://localhost:4000/add/family", newFamily)
      .then((res) => console.log(res.data));

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

  //onChange Events below (for adding a person)
  onChangeName(e) {
    this.setState({ name: e.target.value });
  }

  onChangeDescription(e) {
    this.setState({ description: e.target.value });
  }

  onChangeBirthdate(e) {
    this.setState({ birthdate: e.target.value });
  }

  onChangeDeathdate(e) {
    this.setState({ deathdate: e.target.value });
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
            value={currentChild}
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
        <h3>Family List</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Parent A</th>
              <th>Parent B</th>
            </tr>
          </thead>
          <tbody>{this.familyList()}</tbody>
        </table>
        {/*WIP submit family*/}
        <h3>Add a Family</h3>

        <form onSubmit={this.onSubmitFamily}>
          <div className="form-group">
            <label>Family Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.familyName}
              onChange={this.onChangeFamilyName}
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
            class="btn btn-primary"
          >
            + Child
          </button>

          <div className="form-group">
            <input
              type="submit"
              value="Add Family"
              className="btn btn-primary"
            />
          </div>
        </form>

        {/*WIP submit person*/}
        <h3>Add Person</h3>
        <form onSubmit={this.onSubmitPerson}>
          <div className="form-group">
            <label>Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.name}
              onChange={this.onChangeName}
            />
          </div>

          <div className="form-group">
            <label>Description: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.description}
              onChange={this.onChangeDescription}
            />
          </div>

          <div className="form-group">
            <label>Birthdate: </label>
            <input
              type="date"
              value={this.state.birthdate}
              onChange={this.onChangeBirthdate}
              name="trip-start"
              min="1800-01-01"
              max="2020-12-31"
            ></input>
          </div>

          <div className="form-group">
            <label>Deathdate: </label>
            <input
              type="date"
              value={this.state.deathdate}
              onChange={this.onChangeDeathdate}
              name="trip-start"
              min="1800-01-01"
              max="2020-12-31"
            ></input>
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Add Person"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default FamilyAdder;
