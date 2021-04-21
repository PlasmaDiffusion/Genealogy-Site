import React, { Component } from "react";
import axios from "axios";
import NullChecker from "../services/nullChecker.js";
import Sorter from "../services/sorter.js";
import { getClientUrl, getServerUrl } from "../services/getUrl.js";
import { formatDate } from "../services/formatDate.js";
import {Parent, Child} from "./personDetails";
import {readFamilyFromUrl} from "../services/familyAPI";

//Display parents and children of a given family. Includes details like birth and death date/location.
class FamilyDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      children: [],
      parentA: "",
      parentB: "",
      baseId: "",
      marriageLocation: [],
    };

    this.getFamily = this.getFamily.bind(this);
  }

  //Connect to database and read in information on a specific family. This should only be mounted once.
  componentDidMount() {
    //console.log("About to connect");

    //Read in the family being edited
    var url = new URLSearchParams(window.location.search);
    var id = url.get("id");
    var baseId = url.get("baseId");
    this.setState({ familyId: id });

    if (baseId) this.setState({ baseId: baseId });
    //console.log("baseId", baseId, this.state.baseId);

    axios
      .get(getServerUrl() + "/read/family/" + id)
      .then((response) => {
        //console.log("Family Response: ", response.data);

        //This component will break if it doesn't handle null data
        const nullChecker = new NullChecker();
        nullChecker.familyNullCheck([response.data]);
        //Set family data to fill in on the form
        this.setState({
          name: response.data.name,
          description: response.data.description,
          children: response.data.children,
          parentA: response.data.parentA,
          parentB: response.data.parentB,
          marriageDate: response.data.marriageDate,
          marriageDateYearOnly: response.data.marriageDateYearOnly,
          marriageLocation: [],
        });

        //Make marriage Location 3 lines
        if (response.data.marriageLocation) {
          this.setState({
            marriageLocation: response.data.marriageLocation.split(" "),
          });
        }

        let sorter = new Sorter();

        this.setState({
          children: sorter.sortChildrenByBirthdates(this.state.children),
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //Dynamic list of children to display at the bottom
  childInputList() {
    var obj = this;
    return this.state.children.map(function (currentChild, i) {
      return (
        <div className="form-group"  key={i}
        >
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

  getFamily() {
    if (this.state.name != "") {
      return (
        <React.Fragment>
          <div class="container">
            <h1 class="d-flex justify-content-center space-out">
              The {this.state.name} Family
              {/*<br></br>
              {this.state.marriageDate
                        ? "(" + formatDate(
                            this.state.marriageDate,
                            true
                          ) + ")"
                        : ""}*/}
            </h1>
            <p class="d-flex justify-content-center">
              <i>{this.state.description}</i>
            </p>
            {/*parent row*/}
            <div class="row border-bottom pb-5">
              <Parent person={this.state.parentA} />
              <div class="col-lg">
                <div class="container space-out-mobile">
                  <div class="row">
                    <div class="col-sm d-flex justify-content-center">
                      <h3> &larr; Married &rarr;</h3>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm d-flex justify-content-center">
                      {this.state.marriageDate
                        ? formatDate(
                            this.state.marriageDate,
                            this.state.marriageDateYearOnly
                          )
                        : ""}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm d-flex justify-content-center">
                      {this.state.marriageLocation.map((string, i) => {
                        return (
                          <React.Fragment>
                            {string}
                            <br></br>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <Parent person={this.state.parentB} />
            </div>
            {/*divider row into Children */}
            <div class="row space-out" style={{marginBottom: "2rem"}}>
              <div class="col-lg">
                <h4 class="col-lg d-flex justify-content-center">
                  {this.state.children.length > 0 ? "Children" : ""}
                </h4>
              </div>
              <br></br>
              <br></br>
              <br></br>
            </div>
            {/*children row 1*/}

            <div class="row">
              {this.state.children.map((child, i) =>
                i < this.state.children.length / 2 ||
                this.state.children.length <= 5 ? (
                  <Child //Iterate through child data here
                    person={child}
                    baseId={this.state.baseId}
                    size={
                      this.state.children.length > 2 ? "10" : "4"
                    } /*Different widths based on the amount of children*/
                  />
                ) : (
                  ""
                )
              )}
            </div>

            {/*children row 2*/}

            <div class="row">
              {this.state.children.map((child, i) =>
                i >= this.state.children.length / 2 &&
                this.state.children.length > 5 ? (
                  <Child //Iterate through child data here
                    person={child}
                    baseId={this.state.baseId}
                    size={
                      this.state.children.length > 2 ? "10" : "4"
                    } /*Different widths based on the amount of children*/
                  />
                ) : (
                  ""
                )
              )}
            </div>
          </div>
          <br></br>
          <br></br>
        </React.Fragment>
      );
    } else return;
  }

  render() {
    return <React.Fragment>{this.getFamily()}</React.Fragment>;
  }
}

export default FamilyDetails;
