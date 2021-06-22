import React, { Component } from "react";

import axios from "axios";
import { getClientUrl, getServerUrl } from "../../../services/getUrl.js";

class PersonForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Input for a person
      name: "",
      initialName: "",
      description: "",
      birthdate: "",
      birthdateYearOnly: false,
      deathdate: "",
      deathdateYearOnly: false,
      objectId: "",
      confirmedDelete: false,
      startedFamilies: [],
      families: [],
      collapsed: true,
    };

    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeBirthdate = this.onChangeBirthdate.bind(this);
    this.onChangeDeathdate = this.onChangeDeathdate.bind(this);
    this.onChangeBirthdateYearOnly = this.onChangeBirthdateYearOnly.bind(this);
    this.onChangeDeathdateYearOnly = this.onChangeDeathdateYearOnly.bind(this);
    this.onChangeBirthLocation = this.onChangeBirthLocation.bind(this);
    this.onChangeDeathLocation = this.onChangeDeathLocation.bind(this);

    this.onSubmitPerson = this.onSubmitPerson.bind(this);
    this.onChangeStartedFamilies = this.onChangeStartedFamilies.bind(this);
  }

  //Connect to the databaes and get data here! ------------------------------
  componentDidMount() {
    //console.log("About to connect", window.location.search);

    if (this.props.editing) {
      //Read in a specific person if editing
      var url = new URLSearchParams(window.location.search);
      var id = url.get("id");
      this.setState({ objectId: id });

      axios
        .get(getServerUrl() + "/read/person/" + id)
        .then((response) => {
          //console.log("Person Response: ", response.data);
          this.setState({
            name: response.data.name,
            initialName: response.data.name,
            description: response.data.description,
            birthdate: response.data.birthdate.split("T")[0], //Must al  ys be a birthdate
            deathdate: response.data.deathdate
              ? response.data.deathdate.split("T")[0] //Death dates aren't required so check if they exist
              : "",
            birthdateYearOnly: response.data.birthdateYearOnly,
            deathdateYearOnly: response.data.deathdateYearOnly,
            birthLocation: response.data.birthLocation,
            deathLocation: response.data.deathLocation,
            startedFamilies: response.data.startedFamilies,
          });
          //Add families in here (By name)
          let startedFamilyNames = [];

          for (let i = 0; i < response.data.startedFamilies.length; i++) {
            startedFamilyNames.push(response.data.startedFamilies[i].name);
          }

          this.setState({
            startedFamilies: [...startedFamilyNames],
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    axios
      .get(getServerUrl() + "/read/family/")
      .then((response) => {
        //console.log("Family Response: ", response.data);
        this.setState({
          families: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //Submit form data here
  onSubmitPerson(e) {
    e.preventDefault();

    const submittedPerson = {
      name: this.state.name,
      description: this.state.description,
      birthdate: this.state.birthdate,
      deathdate: this.state.deathdate,
      birthdateYearOnly: this.state.birthdateYearOnly,
      deathdateYearOnly: this.state.deathdateYearOnly,
      birthLocation: this.state.birthLocation,
      deathLocation: this.state.deathLocation,
      startedFamilies: this.state.startedFamilies,
    };

    if (this.props.editing) {
      //Edit the person or...
      axios
        .post(
          getServerUrl() + "/edit/person/" + this.state.objectId,
          submittedPerson
        )
        .then((res) => {
          alert(res.data);
          window.location.replace(getClientUrl() + "/admin");
        });
    } //Add a new one
    else {
      axios
        .post(getServerUrl() + "/add/person", submittedPerson)
        .then((res) => {
          alert(res.data);
          window.location.replace(getClientUrl() + "/admin");
        });

      //Reset input values
      this.setState({
        name: "",
        description: "",
        birthdate: "",
        deathdate: "",
      });
    }
  }

  //onChange Events below (for adding a person)
  onChangeName(e) {
    this.setState({ name: e.target.value });
    this.props.onFormUpdated(this.props.personTitle, this.state);
  }

  onChangeDescription(e) {
    this.setState({ description: e.target.value });
    this.props.onFormUpdated(this.props.personTitle, this.state);

  }

  onChangeBirthdate(e) {
    this.setState({ birthdate: e.target.value });
    this.props.onFormUpdated(this.props.personTitle, this.state);

  }

  onChangeDeathdate(e) {
    this.setState({ deathdate: e.target.value });
    this.props.onFormUpdated(this.props.personTitle, this.state);
  }

  onChangeBirthdateYearOnly(e) {
    //console.log("Birthdate yearonly");
    this.setState({ birthdateYearOnly: e.target.checked });
    this.props.onFormUpdated(this.props.personTitle, this.state);
  }

  onChangeDeathdateYearOnly(e) {
    //console.log("Deathdate yearonly");
    this.setState({ deathdateYearOnly: e.target.checked });
    this.props.onFormUpdated(this.props.personTitle, this.state);
  }

  onChangeBirthLocation(e) {
    this.setState({ birthLocation: e.target.value });
    this.props.onFormUpdated(this.props.personTitle, this.state);
  }

  onChangeDeathLocation(e) {
    this.setState({ deathLocation: e.target.value });
    this.props.onFormUpdated(this.props.personTitle, this.state);
  }

  onChangeStartedFamilies(e) {
    let newFamilies = [...this.state.startedFamilies];

    newFamilies[e.target.list.id] = e.target.value;

    this.setState({
      startedFamilies: newFamilies,
    });
  }

  //Give a selection of existing families
  familyDropDown() {
    return this.state.families.map(function (currentFamily, i) {
      return <option value={currentFamily.name}>{currentFamily.name}</option>;
    });
  }


  toggleCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {

    return (
      <div>
        <React.Fragment>
          <button className="btn btn-warning btn-block" onClick={this.toggleCollapse}>{this.props.personTitle}</button>
        </React.Fragment>

        {(!this.state.collapsed) ? (
          <div className="borders">
            {/*Edit person form*/}
            <h1>{this.props.editing ? "Edit Person" : "Add a Person"}</h1>
            <h2>
              <i>{this.state.initialName}</i>
            </h2>
            <form onSubmit={this.onSubmitPerson}>
              <div className="form-group">
                <label>Name: </label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.name}
                  onChange={this.onChangeName}
                  required
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
                <label>Birthdate: </label> <br></br>
                <input
                  type="date"
                  value={this.state.birthdate}
                  onChange={this.onChangeBirthdate}
                  name="trip-start"
                  min="1750-01-01"
                  max="2020-12-31"
                  required
                ></input>
                <br></br>
                <label>Show Year Only: &nbsp; </label>
                <input
                  type="checkbox"
                  checked={this.state.birthdateYearOnly}
                  onClick={this.onChangeBirthdateYearOnly}
                ></input>
              </div>

              <div className="form-group">
                <label>Birth Location: </label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.birthLocation}
                  onChange={this.onChangeBirthLocation}
                />
              </div>

              <div className="form-group">
                <label>Deathdate: </label> <br></br>
                <input
                  type="date"
                  value={this.state.deathdate}
                  onChange={this.onChangeDeathdate}
                  name="trip-start"
                  min="1750-01-01"
                  max="2020-12-31"
                ></input>
                <br></br>
                <label>Show Year Only: &nbsp; </label>
                <input
                  type="checkbox"
                  checked={this.state.deathdateYearOnly}
                  onClick={this.onChangeDeathdateYearOnly}
                ></input>
              </div>

              <div className="form-group">
                <label>Death Location: </label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.deathLocation}
                  onChange={this.onChangeDeathLocation}
                />
              </div>

            </form>
          </div>
        )
          : ""}


      </div>
    );
  }
}

export default PersonForm;
