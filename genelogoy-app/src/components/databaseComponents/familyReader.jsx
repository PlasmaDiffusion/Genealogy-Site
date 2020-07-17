import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

//Show a form to add families, but also display them along with links to edit them.
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

    this.childInputList = this.childInputList.bind(this);
    this.addChildInput = this.addChildInput.bind(this);
  }

  //Connect to the databaes and get data here! <------------------------------
  componentDidMount() {
    console.log("About to connect");
    axios
      .get("http://localhost:4000/read/family")
      .then((response) => {
        console.log("Family Response: ", response.data);
        response.data = this.familyNullCheck(response.data);
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

  //Check for missing family member entries, and give them blank placeholder values
  familyNullCheck(responseData) {
    responseData.map(function (currentFamily, i) {
      console.log("Checking for null", currentFamily);
      if (currentFamily.parentA == null) {
        currentFamily.parentA = {
          name: "(Deleted)",
          description: "",
          birthdate: "",
          deathdate: "",
        };
      }
      if (currentFamily.parentB == null) {
        currentFamily.parentB = {
          name: "(Deleted)",
          description: "",
          birthdate: "",
          deathdate: "",
        };
      }
    });

    return responseData;
  }

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
}

export default FamilyReader;
