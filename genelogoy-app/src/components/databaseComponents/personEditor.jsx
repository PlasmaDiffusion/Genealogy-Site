import React, { Component } from "react";

import axios from "axios";

const Profile = ({ match, loading }) => {
  if (loading) return <div>Loading...</div>;
  return <div>You're on the Profile {match.params.profileId}</div>;
};

const Person = (props) => (
  <div id={props._id}>
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

class PersonEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],

      //Input for a person
      name: "",
      description: "",
      birthdate: "",
      deathdate: "",
    };

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeBirthdate = this.onChangeBirthdate.bind(this);
    this.onChangeDeathdate = this.onChangeDeathdate.bind(this);
    this.onChangeChild = this.onChangeChild.bind(this);

    this.onSubmitPerson = this.onSubmitPerson.bind(this);
  }

  //Connect to the databaes and get data here! <------------------------------
  componentDidMount() {
    console.log("About to connect", window.location.search);

    var url = new URLSearchParams(window.location.search);
    var id = url.get("id");
    console.log(id);

    axios
      .get("http://localhost:4000/edit/person/" + id)
      .then((response) => {
        console.log("Person Response: ", response.data);
        this.setState({ persons: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //Show family
  personList() {
    console.log("fam", this.state.persons);
    return this.state.persons.map(function (currentPerson, i) {
      return <Person person={currentPerson} key={i} />;
    });
  }

  //Submit form data here
  onSubmitPerson(e) {
    e.preventDefault();

    const newPerson = {
      name: this.state.name,
      description: this.state.description,
      birthdate: this.state.birthdate,
      deathdate: this.state.deathdate,
    };

    axios
      .post("http://localhost:4000/edit/person/" + this.props._id)
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
      .post("http://localhost:4000/edit/person/", newFamily)
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
        {/*WIP edit person form*/}
        <h3>Edit Person</h3>
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

        <h3>Family List</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead></thead>
          <tbody>{this.personList()}</tbody>
        </table>
      </div>
    );
  }
}

export default PersonEditor;
