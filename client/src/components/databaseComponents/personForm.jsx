import React, { Component } from "react";

import axios from "axios";

class PersonEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Input for a person
      name: "",
      initialName: "",
      description: "",
      birthdate: "",
      deathdate: "",
      objectId: "",
      confirmedDelete: false,
      startedFamilies: [],
      families: [],
    };

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeBirthdate = this.onChangeBirthdate.bind(this);
    this.onChangeDeathdate = this.onChangeDeathdate.bind(this);

    this.onSubmitPerson = this.onSubmitPerson.bind(this);
    this.addStartedFamilyInput = this.addStartedFamilyInput.bind(this);
    this.removeStartedFamilyInput = this.removeStartedFamilyInput.bind(this);
    this.onChangeStartedFamilies = this.onChangeStartedFamilies.bind(this);
  }

  //Connect to the databaes and get data here! ------------------------------
  componentDidMount() {
    console.log("About to connect", window.location.search);

    if (this.props.editing) {
      //Read in a specific person if editing
      var url = new URLSearchParams(window.location.search);
      var id = url.get("id");
      this.setState({ objectId: id });

      axios
        .get(window.location.origin + "/read/person/" + id)
        .then((response) => {
          console.log("Person Response: ", response.data);
          this.setState({
            name: response.data.name,
            initialName: response.data.name,
            description: response.data.description,
            birthdate: response.data.birthdate.split("T")[0],
            deathdate: response.data.deathdate.split("T")[0],
            startedFamilies: response.data.startedFamilies,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    axios
      .get("http://localhost:4000/read/family/")
      .then((response) => {
        console.log("Family Response: ", response.data);
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
      startedFamilies: this.state.startedFamilies,
    };

    if (this.props.editing) {
      //Edit the person or...
      axios
        .post(
          "http://localhost:4000/edit/person/" + this.state.objectId,
          submittedPerson
        )
        .then((res) => {
          alert(res.data);
          window.location.replace("http://localhost:3000/admin");
        });
    } //Add a new one
    else {
      axios
        .post("http://localhost:4000/add/person", submittedPerson)
        .then((res) => {
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

  //Dynamic "Add child" list
  startedFamiliesInputList() {
    var obj = this;
    return this.state.startedFamilies.map(function (currentFamily, i) {
      return (
        <div className="form-group">
          <label>Started Family: </label>
          <input
            type="text"
            className="form-control"
            value={currentFamily.name}
            onChange={obj.onChangeStartedFamilies}
            list={i}
          />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => obj.removeStartedFamilyInput(i)}
            value={i}
          >
            X
          </button>
          <datalist id={i}>{obj.familyDropDown()}</datalist>
        </div>
      );
    });
  }

  addStartedFamilyInput() {
    console.log("Adding child", this);
    this.setState((prevState) => ({
      startedFamilies: [...prevState.startedFamilies, ""],
    }));
  }

  //Remove a specific child
  removeStartedFamilyInput(index) {
    console.log("Children before removal", this.state.startedFamilies);

    let newFamilyArray = [];

    if (index > -1 && index < this.state.startedFamilies.length) {
      newFamilyArray = [...this.state.startedFamilies];
      newFamilyArray.splice(index, 1);

      this.setState({
        startedFamilies: newFamilyArray,
      });
    } else console.log("Invalid array index");
  }

  render() {
    return (
      <div>
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

          {this.startedFamiliesInputList()}

          <button
            type="button"
            onClick={this.addStartedFamilyInput}
            class="btn btn-secondary"
            data-toggle="tooltip"
            data-placement="top"
            title="You can add already existing families this person created here."
          >
            + Started Families
          </button>

          <div className="form-group">
            <input
              type="submit"
              value={
                this.props.editing
                  ? "Update Person: " + this.state.initialName
                  : "Add Person"
              }
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default PersonEditor;
