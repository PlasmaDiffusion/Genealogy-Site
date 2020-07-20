import React, { Component } from "react";
import NullChecker from "./databaseComponents/classes/nullChecker.js";
import axios from "axios";
import Family from "./family";

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
    };

    this.getFamily = this.getFamily.bind(this);
  }

  //Connect to database and read in information on a specific family
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
        });
        //this.state.family.push(response.data);
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
    console.log("State", this.state.family);
    if (this.state.name != "") {
      return (
        <React.Fragment>
          <div class="container">
            {/*parent row*/}
            <div class="row">
              <Parent person={this.state.parentA} />
              <span class="col-lg d-flex justify-content-center border-bottom">
                Married
              </span>
              <Parent person={this.state.parentB} />
            </div>
            {/*divider row */}
            <div class="row">
              <div class="col-lg">
                <h4 class="col-lg d-flex justify-content-center">Children</h4>
              </div>
            </div>
            {/*children row*/}
            <div class="row">
              {this.state.children.map((child) => (
                <Child //Iterate through child data here
                  person={child}
                />
              ))}
            </div>
          </div>
        </React.Fragment>
      );
    } else return;
  }

  //Show family
  familyList() {
    var obj = this;
    console.log("fam", this.state.family);
    return this.state.family.map(function (currentFamily, i) {
      return (
        <Family
          family={currentFamily}
          showChildren={currentFamily.children.length > 0}
          editable={true}
          key={i}
        />
      );
    });
  }

  render() {
    return <React.Fragment>{this.getFamily()}</React.Fragment>;
  }
}

const Parent = (props) => {
  return (
    <div class="col-lg">
      <h2 class="col-lg p-3 mb-2 bg-primary text-white">{props.person.name}</h2>
      <p>Born: {props.person.birthdate.split("T")[0]}</p>
      <p>Died: {props.person.deathdate.split("T")[0]}</p>
    </div>
  );
};

const Child = (props) => {
  return (
    <div class="col-lg">
      <p class="col-sm-4 p-1 mb-2 bg-info text-white">{props.person.name}</p>
      <p>Born: {props.person.birthdate.split("T")[0]}</p>
      <p>Died: {props.person.deathdate.split("T")[0]}</p>
    </div>
  );
};

export default FamilyDetails;
