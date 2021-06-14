import React, { Component, Fragment } from "react";
import NullChecker from "../../../services/nullChecker.js";
import { getClientUrl, getServerUrl } from "../../../services/getUrl.js";

import axios from "axios";

//A form that can be used to add new familys or to edit existing ones (Pass in editing = true or false as a prop)
class FamilyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      families: [],
      persons: [],
      showChildren: [],

      //Input for a family
      familyName: "",
      initialName: "",
      familyDescription: "",
      subFamily: false,
      marriageDate: "",
      marriageDateYearOnly: false,
      marriageLocation: "",
      parentA: "", //For searching
      parentA_Birthdate: "", //For searching
      parentB: "", //For searching
      parentB_Birthdate: "", //For searching
      children: [],
      children_Birthdates: [],
    };

    this.onChangeParentA = this.onChangeParentA.bind(this);
    this.onChangeParentB = this.onChangeParentB.bind(this);
    this.onChangeFamilyName = this.onChangeFamilyName.bind(this);
    this.onChangeFamilyDescription = this.onChangeFamilyDescription.bind(this);
    this.onChangeSubFamily = this.onChangeSubFamily.bind(this);
    this.onChangeMarriageDate = this.onChangeMarriageDate.bind(this);
    this.onChangeMarriageDateYearOnly = this.onChangeMarriageDateYearOnly.bind(
      this
    );
    this.onChangeMarriageLocation = this.onChangeMarriageLocation.bind(this);

    this.onChangeChild = this.onChangeChild.bind(this);

    this.onSubmitFamily = this.onSubmitFamily.bind(this);
    this.childInputList = this.childInputList.bind(this);
    this.addChildInput = this.addChildInput.bind(this);
    this.removeChildInput = this.removeChildInput.bind(this);
  }

  //Connect to the database and get data here! ------------------------------
  componentDidMount() {
    //console.log("About to connect");

    //Unless a general form for adding, load in data for editing an existing family
    if (this.props.editing) {
      var url = new URLSearchParams(window.location.search);
      var id = url.get("id");
      this.setState({ objectId: id });

      axios
        .get(getServerUrl() + "/read/family/" + id)
        .then((response) => {
          //console.log("Family Response: ", response.data);

          //This component will break if it doesn't handle null data
          const nullChecker = new NullChecker();
          nullChecker.familyNullCheck([response.data]);
          //Set family data to fill in on the form
          this.setState({
            familyName: response.data.name,
            initialName: response.data.name,
            familyDescription: response.data.description,
            subFamily: response.data.subFamily,
            parentA: response.data.parentA.name,
            parentA_Birthdate: response.data.parentA.birthdate,
            parentB: response.data.parentB.name,
            parentB_Birthdate: response.data.parentB.birthdate,

            marriageDate: response.data.marriageDate
              ? response.data.marriageDate.split("T")[0]
              : "",
            marriageLocation: response.data.marriageLocation,
            children: response.data.children,
          });

          //Add children in here (By name and date)
          let childrenNames = [];
          let children_Birthdates = [];

          for (let i = 0; i < response.data.children.length; i++) {
            childrenNames.push(response.data.children[i].name);
            children_Birthdates.push(response.data.children[i].birthdate);
          }

          this.setState({
            children: [...childrenNames],
            children_Birthdates: [...children_Birthdates],
          });

          //console.log("Children:", this.state.children);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    //Read in people to enter in family form dropdowns
    axios
      .get(getServerUrl() + "/read/person")
      .then((response) => {
        console.log("Person Response: ", response.data);
        this.setState({ persons: response.data });
      })
      .catch(function (error) {
        //console.log(error);
      });
  }

  //Submit form data here -----------------------------------------------
  onSubmitFamily(e) {
    e.preventDefault();

    //serviceson
    const familyToSubmit = {
      name: this.state.familyName,
      description: this.state.familyDescription,
      subFamily: this.state.subFamily,
      parentA: this.state.parentA,
      parentA_Birthdate: this.state.parentA_Birthdate,
      parentB: this.state.parentB,
      parentB_Birthdate: this.state.parentB_Birthdate,
      marriageDate: this.state.marriageDate,
      marriageDateYearOnly: this.state.marriageDateYearOnly,
      marriageLocation: this.state.marriageLocation,
      children: this.state.children,
      children_Birthdates: this.state.children_Birthdates,
    };

    //Name and parents must be filled in at the very least.
    if (
      familyToSubmit.name == "" ||
      familyToSubmit.name == null ||
      familyToSubmit.parentA == "" ||
      familyToSubmit.parentA == null ||
      familyToSubmit.parentB == "" ||
      familyToSubmit.parentB == null
    )
      return;

    //console.log("Sending JSON data:", familyToSubmit.children);

    if (this.props.editing) {
      //Edit a family or...
      axios
        .post(
          getServerUrl() + "/edit/family/" + this.state.objectId,
          familyToSubmit
        )
        .then((res) => {
          //console.log(res.data);
          alert(res.data);
          window.location.replace(getClientUrl() + "/admin");
        });
    } //Add a new family
    else {
      axios.post(getServerUrl() + "/add/family", familyToSubmit).then((res) => {
        //console.log(res.data);
        alert(res.data);
        window.location.replace(getClientUrl() + "/admin");
      });
    }
  }

  onChangeFamilyName(e) {
    this.setState({ familyName: e.target.value });
  }

  onChangeFamilyDescription(e) {
    this.setState({ familyDescription: e.target.value });
  }

  onChangeSubFamily(e) {
    this.setState({ subFamily: e.target.checked });
  }

  //Give a selection of people
  personDropdown() {
    return this.state.persons.map(function (currentPerson, i) {
      return (
        <option
          value={
            currentPerson.name +
            " | " +
            (currentPerson.birthdate
              ? currentPerson.birthdate.split("T")[0]
              : "")
          }
        ></option>
      );
    });
  }

  onChangeParentA(e) {
    //Split em apart as a name and date to search for
    var nameAndDate = e.target.value.split(" | ");

    if (nameAndDate.length > 1) {
      this.setState({ parentA: nameAndDate[0] });
      this.setState({ parentA_Birthdate: nameAndDate[1] + "T00:00:00.000Z" });
    } else {
      this.setState({ parentA: e.target.value });
    }

    //console.log(this.state.parentA, this.state.parentA_Birthdate);
  }

  onChangeParentB(e) {
    //Split em apart as a name and date to search for
    var nameAndDate = e.target.value.split(" | ");

    if (nameAndDate.length > 1) {
      this.setState({ parentB: nameAndDate[0] });
      this.setState({ parentB_Birthdate: nameAndDate[1] + "T00:00:00.000Z" });
    } else {
      this.setState({ parentB: e.target.value });
    }
  }

  onChangeMarriageDate(e) {
    this.setState({ marriageDate: e.target.value });
  }

  onChangeMarriageDateYearOnly(e) {
    this.setState({ marriageDateYearOnly: e.target.checked });
  }

  onChangeMarriageLocation(e) {
    this.setState({ marriageLocation: e.target.value });
  }

  onChangeChild(e) {
    //Split em apart as a name and date to search for
    var nameAndDate = e.target.value.split(" | ");

    //Get a copy of the previous child state arrays to modify them
    var newChildren = [...this.state.children];
    var newChildren_Birthdates = [...this.state.children_Birthdates];

    //Add a child with a name and date
    if (nameAndDate.length > 1) {
      newChildren[e.target.list.id] = nameAndDate[0];
      newChildren_Birthdates[e.target.list.id] =
        nameAndDate[1] + "T00:00:00.000Z";
    } else {
      newChildren[e.target.list.id] = e.target.value;
    }

    this.setState({
      children: newChildren,
      children_Birthdates: newChildren_Birthdates,
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
            value={currentChild.name}
            onChange={obj.onChangeChild}
            list={i}
            role="childInput"
          />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => obj.removeChildInput(i)}
            value={i}
          >
            X
          </button>
          <datalist id={i}>{obj.personDropdown()}</datalist>
        </div>
      );
    });
  }

  addChildInput() {
    //console.log("Adding child", this);
    this.setState((prevState) => ({
      children: [...prevState.children, ""],
    }));
  }

  //Remove a specific child
  removeChildInput(index) {
    //console.log("Removing child", index);
    //console.log("Children before removal", this.state.children);

    let newChildrenArray = [];

    if (index > -1 && index < this.state.children.length) {
      newChildrenArray = [...this.state.children];
      newChildrenArray.splice(index, 1);

      this.setState({
        children: newChildrenArray,
      });
    } else console.log("Invalid array index");
  }

  render() {
    return (
      <div className="container">
        {/*Submit family form*/}

        <h1>
          {this.props.editing
            ? "Edit Family: " + this.state.initialName
            : "Add a Family"}
        </h1>
        <h2>
          <i>{this.state.initialName}</i>
        </h2>
        <form onSubmit={this.onSubmitFamily}>
          <div className="form-group">
            <label>Family Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.familyName}
              onChange={this.onChangeFamilyName}
              required
              role="familyNameInput"
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

          <div
            className="form-group"
            data-toggle="tooltip"
            data-placement="right"
            title="A sub family won't show up on the (currently unused) sidebar. Ignore this box unless the side bar gets reimplemented."
          >
            <label>Sub Family: &nbsp; </label>{" "}
            <input
              type="checkbox"
              checked={this.state.subFamily}
              onClick={this.onChangeSubFamily}
            ></input>
            <button
              type="button"
              class="btn btn-link btn-sm"
              data-toggle="tooltip"
              data-placement="top"
              disabled
            >
              ?
            </button>
          </div>

          <div className="form-group">
            <label>Parent A: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.parentA}
              onChange={this.onChangeParentA}
              list="parentA"
              required
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
              required
            />
            <datalist id="parentB">{this.personDropdown()}</datalist>
          </div>

          <div className="form-group">
            <label>Marriage Date: </label>
            <br></br>
            <input
              type="date"
              value={this.state.marriageDate}
              onChange={this.onChangeMarriageDate}
              name="marriage-date"
              min="1750-01-01"
              max="2020-12-31"
            ></input>
            <br></br>
            <label>Show Year Only: &nbsp; </label>
            <input
              type="checkbox"
              checked={this.state.marriageDateYearOnly}
              onClick={this.onChangeMarriageDateYearOnly}
            ></input>
          </div>

          <div className="form-group">
            <label>Marriage Location: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.marriageLocation}
              onChange={this.onChangeMarriageLocation}
            />
          </div>

          {this.childInputList()}

          <button
            type="button"
            onClick={this.addChildInput}
            class="btn btn-secondary"
            role="addChild"
          >
            + Child
          </button>

          <div className="form-group">
            <input
              type="submit"
              value={this.props.editing ? "Update Family" : "Add Family"}
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default FamilyForm;
