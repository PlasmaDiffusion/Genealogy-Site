import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import NullChecker from "./classes/nullChecker.js";
import { getClientUrl, getServerUrl } from "../getUrl.js";
import Family from "./family";
import FamilyLink from "./familyLink";
import FamilyForm from "./familyForm";
import PersonForm from "./personForm";

import axios from "axios";

//The first admin database component shown. Show a form to add families, but also display them along with links to edit them.
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

  render() {
    return (
      <div>
        <FamilyLink />
        <div class="container">
          <p class="alert alert-warning">
            Add people on the left. Then on the right, enter peoples' names
            under ParentA, ParentB or Child.
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
