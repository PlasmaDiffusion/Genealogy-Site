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
class FamilyPost extends Component {
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
      parentA: "",
      parentB: "",
      children: [],
    };

    //this.onChangeTodoParentA = this.onChangeTodoParentA.bind(this);
    //this.onChangeTodoParentB = this.onChangeTodoParentB.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeBirthdate = this.onChangeBirthdate.bind(this);
    this.onChangeDeathdate = this.onChangeDeathdate.bind(this);

    this.onSubmitPerson = this.onSubmitPerson.bind(this);
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

  familyList() {
    console.log("fam", this.state.families);
    return this.state.families.map(function (currentFamily, i) {
      return <Family family={currentFamily} key={i} />;
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

  //onChange Events below
  onChangeTodoParentA(e) {
    this.setState({
      parentA: e.target.value,
    });
  }

  onChangeTodoParentB(e) {
    this.setState({
      parentB: e.target.value,
    });
  }

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
            <label>Parent A Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.parentA_name}
              onChange={this.onChangeTodoParentA}
            />
          </div>
          <div className="form-group">
            <label>Parent B Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.parentB_name}
              onChange={this.onChangeTodoParentB}
            />
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Add Family"
              className="btn btn-primary"
            />
          </div>
        </form>
        {/*WIP submit person*/}
        <h3>Add a Person</h3>
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

export default FamilyPost;
