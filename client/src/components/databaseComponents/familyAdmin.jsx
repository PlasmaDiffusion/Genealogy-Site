import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import NullChecker from "./classes/nullChecker.js";
import { getClientUrl, getServerUrl } from "../getUrl.js";
import Family from "./family";
import Person from "./person";
import FamilyLink from "./familyLink";
import FamilyForm from "./familyForm";
import PersonForm from "./personForm";
import FamilyGroupForm from "./familyGroupForm";

import axios from "axios";

//The first admin database component shown. Show a form to add families, but also display them along with links to edit them.
class FamilyAdmin extends Component {
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
    };
  }

  //Connect to the database and get data here! (Needed to list out the families in tables) ------------------------------
  componentDidMount() {
    console.log("About to connect");

    axios
      .get(getServerUrl() + "/read/family")
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
      .get(getServerUrl() + "/read/person")
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
            class={
              currentFamily.subFamily ? "btn btn-outline-info" : "btn btn-info"
            }
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

  personList() {
    var thisObj = this;

    return this.state.persons.map(function (currentPerson, i) {
      return (
        <div>
          <button
            class={"btn btn-warning"}
            onClick={() => {
              thisObj.revealFamily(i + thisObj.state.families.length);
            }}
          >
            {currentPerson.name}
          </button>
          <Person //Iterate through child data here
            name={currentPerson.name}
            description={currentPerson.description}
            birthdate={currentPerson.birthdate}
            brithdateYearOnly={currentPerson.birthdateYearOnly}
            deathdate={currentPerson.deathdate}
            deathdateYearOnly={currentPerson.deathdateYearOnly}
            _id={currentPerson._id}
            viewingTable={
              thisObj.state.viewingTables[thisObj.state.families.length + i]
            }
          />
          <br></br>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <FamilyLink editing={true} />
        <div class="container">
          <p class="alert alert-warning">
            Add people on the left. Every person must have a name and birthdate.
            <br></br> Then on the right, create a family by entering peoples'
            names under ParentA, ParentB or Child.
            <br></br>
            The family won't be created if the people entered don't exist.
          </p>
          <div class="row">
            <div class="col-sm-6">
              <PersonForm editing={false} />
            </div>
            <div class="col-sm-6">
              <FamilyForm editing={false} />
            </div>

            <div class="col-sm"></div>
          </div>
          <div class="row">
            <div class="col-lg-10">
              <FamilyGroupForm length={15} />
            </div>
          </div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <div class="row">
            <h3>Family Editor</h3>
          </div>
          <div class="row">
            <p class="alert alert-warning">
              Click on a button to see a table of the family. Then click the
              edit links to edit that family or a specific person.
              <br></br>
              Alternatively, you can click edit next to families on the sidebar.
              <br></br>
              Outlined buttons are for families that don't show up on the
              sidebar.
            </p>
          </div>
          <div class="row">
            <table className="table table-striped" style={{ marginTop: 20 }}>
              <tbody>{this.familyList()}</tbody>
            </table>
          </div>
          <div class="row">
            <h3>Person Editor</h3>
          </div>
          <div class="row">
            <p class="alert alert-warning">
              You can find individual people here, including those not currently
              in a family.
            </p>
          </div>
          <div class="row">
            <table className="table table-striped" style={{ marginTop: 20 }}>
              <tbody>{this.personList()}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default FamilyAdmin;
