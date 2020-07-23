import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import NullChecker from "./classes/nullChecker.js";
import Family from "./../family";
import FamilyLink from "./familyLink";

import axios from "axios";

//Show a form to add families, but also display them along with links to edit them.
class FamilyAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      families: [],
      persons: [],
      showChildren: [],
      viewingTables: [],
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

    this.revealFamily = this.revealFamily.bind(this);
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

  //Connect to the database and get data here! <------------------------------
  componentDidMount() {
    console.log("About to connect");
    axios
      .get("http://localhost:4000/read/family")
      .then((response) => {
        console.log("Family Response: ", response.data);
        const nullChecker = new NullChecker();
        nullChecker.familyNullCheck(response.data);
        this.setState({
          families: response.data,
          viewingTables: new Array(response.data.length),
        });
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

  revealFamily(i) {
    var newViewingTables = this.state.viewingTables;
    newViewingTables[i] = !newViewingTables[i];

    this.setState({ viewingTables: newViewingTables });
  }

  //Show family (and a button to reveal them)
  familyList() {
    var obj = this;
    console.log("fam", this.state.families);
    return this.state.families.map(function (currentFamily, i) {
      return (
        <div>
          <button
            class="btn btn-info"
            onClick={() => {
              obj.revealFamily(i);
            }}
          >
            {currentFamily.name}
          </button>
          <Family
            family={currentFamily}
            showChildren={currentFamily.children.length > 0}
            editable={true}
            viewingTable={obj.state.viewingTables[i]}
            key={i}
          />
          <br></br>
        </div>
      );
    });
  }
  //showChildren={obj.state.showChildren[i]}

  findPerson(idToFind) {
    let personFound = "";

    this.state.persons.map(function (currentPerson, i) {
      if (currentPerson._id == idToFind) {
        personFound = currentPerson;
      }
    });

    return personFound;
  }

  //Give a selection of people
  personDropdown() {
    return this.state.persons.map(function (currentPerson, i) {
      return <option value={currentPerson.name}>{currentPerson.name}</option>;
    });
  }

  //Submit form data here <------------------------------------------------
  onSubmitPerson(e) {
    e.preventDefault();

    const newPerson = {
      name: this.state.name,
      description: this.state.description,
      birthdate: this.state.birthdate,
      deathdate: this.state.deathdate,
    };

    axios.post("http://localhost:4000/add/person", newPerson).then((res) => {
      alert(res.data);
      window.location.replace("http://localhost:3000/admin");
    });

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

    axios.post("http://localhost:4000/add/family", newFamily).then((res) => {
      console.log(res.data);
      alert(res.data);
      window.location.replace("http://localhost:3000/admin");
    });

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
        <FamilyLink />
        {/*Submit family form*/}
        <div class="container">
          <p class="alert alert-warning">
            Add people on the right. Then on the left, enter peoples' names
            under ParentA, ParentB or Child.
            <br></br>
            The family won't be created if the people entered don't exist.
          </p>
          <div class="row">
            <div class="col-sm">
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
                  class="btn btn-secondary"
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
            </div>

            <div class="col-sm">
              {/*Submit person form*/}
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
            <div class="col-sm-2"></div>
          </div>
          <div class="row">
            <h3>Family Editor</h3>
            <table className="table table-striped" style={{ marginTop: 20 }}>
              <tbody>{this.familyList()}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default FamilyAdder;
