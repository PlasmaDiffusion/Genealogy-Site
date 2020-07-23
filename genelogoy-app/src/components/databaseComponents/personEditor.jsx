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
    this.onDeletePerson = this.onDeletePerson.bind(this);
    this.addStartedFamilyInput = this.addStartedFamilyInput.bind(this);
    this.onChangeStartedFamilies = this.onChangeStartedFamilies.bind(this);
  }

  //Connect to the databaes and get data here! <------------------------------
  componentDidMount() {
    console.log("About to connect", window.location.search);

    var url = new URLSearchParams(window.location.search);
    var id = url.get("id");
    this.setState({ objectId: id });

    axios
      .get("http://localhost:4000/read/person/" + id)
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

    console.log(this.state.startedFamilies);

    const updatedPerson = {
      name: this.state.name,
      description: this.state.description,
      birthdate: this.state.birthdate,
      deathdate: this.state.deathdate,
      startedFamilies: this.state.startedFamilies,
    };

    axios
      .post(
        "http://localhost:4000/edit/person/" + this.state.objectId,
        updatedPerson
      )
      .then((res) => {
        alert(res.data);
        window.location.replace("http://localhost:3000/admin");
      });
  }

  //Submit form data FOR DELETING
  onDeletePerson(e) {
    e.preventDefault();
    //Confirm the delete
    if (window.confirm("Reall delete this person?")) {
      const deleteData = {
        id: this.state.objectId,
      };

      console.log("About to delete this id:", deleteData);

      axios
        .post("http://localhost:4000/delete/person", deleteData)
        .then((res) => {
          alert(res.data);
          window.location.replace("http://localhost:3000/admin");
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

  render() {
    return (
      <div>
        {/*Edit person form*/}
        <h1>Edit Person</h1>
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
          >
            + Started Families
          </button>

          <div className="form-group">
            <input
              type="submit"
              value="Update Person"
              className="btn btn-primary"
            />
          </div>
        </form>

        {/*Delete person form*/}
        <form onSubmit={this.onDeletePerson}>
          <div className="form-group">
            <input
              type="submit"
              value="Delete Person"
              className="btn btn-danger"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default PersonEditor;
