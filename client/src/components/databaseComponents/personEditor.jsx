import React, { Component } from "react";

import axios from "axios";
import { getClientUrl, getServerUrl } from "../../services/getUrl.js";
import PersonForm from "./personForm";

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
    this.removeStartedFamilyInput = this.removeStartedFamilyInput.bind(this);
    this.onChangeStartedFamilies = this.onChangeStartedFamilies.bind(this);
  }

  //Connect to the databaes and get data here! <------------------------------
  componentDidMount() {
    //console.log("About to connect", window.location.search);

    var url = new URLSearchParams(window.location.search);
    var id = url.get("id");
    this.setState({ objectId: id });

    axios
      .get(getClientUrl() + "/read/person/" + id)
      .then((response) => {
        //console.log("Person Response: ", response.data);
        this.setState({
          name: response.data.name,
          initialName: response.data.name,
          description: response.data.description,
          birthdate: response.data.birthdate.split("T")[0],
          deathdate: response.data.deathdate.split("T")[0],
          birthLocation: response.data.birthLocation,
          deathLocation: response.data.deathLocation,
          startedFamilies: response.data.startedFamilies,
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(getClientUrl() + "/read/family/")
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

    //console.log(this.state.startedFamilies);

    const updatedPerson = {
      name: this.state.name,
      description: this.state.description,
      birthdate: this.state.birthdate,
      deathdate: this.state.deathdate,
      startedFamilies: this.state.startedFamilies,
    };
    const baseUrl =
      process.env.NODE_ENV == "development"
        ? "http://localhost:4000"
        : "https://geneology-site.herokuapp.com";

    axios
      .post(baseUrl + "/edit/person/" + this.state.objectId, updatedPerson)
      .then((res) => {
        alert(res.data);
        window.location.replace(getClientUrl() + "/admin");
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

      //console.log("About to delete this id:", deleteData);

      axios.post(getServerUrl() + "/delete/person", deleteData).then((res) => {
        alert(res.data);
        window.location.replace(getClientUrl() + "/admin");
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
    //console.log("Adding child", this);
    this.setState((prevState) => ({
      startedFamilies: [...prevState.startedFamilies, ""],
    }));
  }

  //Remove a specific child
  removeStartedFamilyInput(index) {
    //console.log("Children before removal", this.state.startedFamilies);

    let newFamilyArray = [];

    if (index > -1 && index < this.state.startedFamilies.length) {
      newFamilyArray = [...this.state.startedFamilies];
      newFamilyArray.splice(index, 1);

      this.setState({
        startedFamilies: newFamilyArray,
      });
    } //else console.log("Invalid array index");
  }

  render() {
    return (
      <div>
        <a href={getClientUrl() + "/admin"}>Back to Admin</a>
        <PersonForm editing={true} />

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
