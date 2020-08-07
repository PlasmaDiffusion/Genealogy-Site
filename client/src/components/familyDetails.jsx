import React, { Component } from "react";
import axios from "axios";
import NullChecker from "./databaseComponents/classes/nullChecker.js";
import Sorter from "./databaseComponents/classes/sorter.js";
import { getClientUrl, getServerUrl } from "./getUrl.js";
import { formatDate } from "./formatDate.js";
import FamilyBranch from "./familyBranch";

//Display parents and children, but not a complex tree
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
    };

    this.getFamily = this.getFamily.bind(this);
  }

  //Connect to database and read in information on a specific family
  componentDidMount() {
    console.log("About to connect");

    //Read in the family being edited
    var url = new URLSearchParams(window.location.search);
    var id = url.get("id");
    var baseId = url.get("baseId");
    this.setState({ familyId: id });

    if (baseId) this.setState({ baseId: baseId });
    console.log("baseId", baseId, this.state.baseId);

    axios
      .get(getServerUrl() + "/read/family/" + id)
      .then((response) => {
        console.log("Family Response: ", response.data);

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
          marriageLocation: response.data.marriageLocation,
        });

        let sorter = new Sorter();

        this.setState({ children: sorter.sortChildren(this.state.children) });
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

  getFamily() {
    if (this.state.name != "") {
      return (
        <React.Fragment>
          <div class="container">
            <h1 class="d-flex justify-content-center">{this.state.name}</h1>
            <p class="d-flex justify-content-center">
              <i>{this.state.description}</i>
            </p>
            {/*parent row*/}
            <div class="row border-bottom">
              <Parent person={this.state.parentA} />
              <div class="col-lg">
                <div class="container">
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
                      {this.state.marriageLocation}
                    </div>
                  </div>
                </div>
              </div>
              <Parent person={this.state.parentB} />
            </div>
            {/*divider row */}
            <div class="row">
              <div class="col-lg">
                <h4 class="col-lg d-flex justify-content-center">
                  {this.state.children.length > 0 ? "Children" : ""}
                </h4>
              </div>
            </div>
            {/*children row*/}
            <div class="row">
              {this.state.children.map((child) => (
                <Child //Iterate through child data here
                  person={child}
                  baseId={this.state.baseId}
                  size={
                    this.state.children.length > 2 ? "10" : "4"
                  } /*Different widths based on the amount of children*/
                />
              ))}
            </div>
          </div>
          <br></br>
          <br></br>
          <h2 class="bg-primary text-white">Tree</h2>
          <FamilyBranch
            familyId={this.state.baseId}
            baseId={this.state.baseId}
          />
        </React.Fragment>
      );
    } else return;
  }

  render() {
    return <React.Fragment>{this.getFamily()}</React.Fragment>;
  }
}

//Parent "card". Reads in first name, middle name and last name and adds spaces if none are there. Dates are read in but ignore specific time
const Parent = (props) => {
  return (
    <div class="col-lg">
      <div class="col-lg p-3 mb-2 bg-primary text-white">
        <h2>{props.person.name.split(" ")[0]}</h2>
        <h2>
          {props.person.name.split(" ")[1] ? (
            props.person.name.split(" ")[1]
          ) : (
            <br></br>
          )}
        </h2>
        <h2>
          {props.person.name.split(" ")[2] ? (
            props.person.name.split(" ")[2]
          ) : (
            <br></br>
          )}
        </h2>
      </div>
      <p>
        <i>{props.person.description}</i>
      </p>
      <p>
        <b>
          {props.person.birthdate
            ? "Born: " +
              formatDate(props.person.birthdate, props.person.birthdateYearOnly)
            : ""}
          <br></br>
        </b>
        {props.person.birthLocation ? props.person.birthLocation : ""}
      </p>
      <p>
        <b>
          {props.person.deathdate
            ? "Died: " +
              formatDate(props.person.deathdate, props.person.deathdateYearOnly)
            : ""}
          <br></br>
        </b>
        {props.person.deathLocation ? props.person.deathLocation : ""}
      </p>
    </div>
  );
};

//Child "card". On top of the usual stuff, display links to families these children started
const Child = (props) => {
  return (
    <div class="col-lg">
      <p class={"col-sm-" + props.size + " p-1 mb-2 bg-info text-white"}>
        {props.person.name}
      </p>
      <p>
        <i>{props.person.description}</i>
      </p>
      <p>
        <b>
          {props.person.birthdate
            ? "Born: " +
              formatDate(props.person.birthdate, props.person.birthdateYearOnly)
            : ""}
          <br></br>
        </b>
        {props.person.birthLocation ? props.person.birthLocation : ""}
      </p>
      <p>
        <b>
          {props.person.deathdate
            ? "Died: " +
              formatDate(props.person.deathdate, props.person.deathdateYearOnly)
            : ""}
          <br></br>
        </b>
        {props.person.deathLocation ? props.person.deathLocation : ""}
      </p>
      <p>
        {props.person.startedFamilies.length > 0 ? <u>Started families</u> : ""}
        {props.person.startedFamilies.map((currentFamily) => (
          <React.Fragment>
            <br></br>
            <a
              href={
                "/family/ ?id=" + currentFamily._id + "&baseId=" + props.baseId
              }
              title={currentFamily.description}
            >
              {currentFamily.name}
            </a>
          </React.Fragment>
        ))}
      </p>
    </div>
  );
};

export default FamilyDetails;
