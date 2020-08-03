import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import NullChecker from "./classes/nullChecker.js";
import { getClientUrl, getServerUrl } from "../getUrl.js";
import FamilyForm from "./familyForm";

import axios from "axios";

//Show a form to add families, but also
class FamilyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      families: [],
      persons: [],

      //Input for a family
      name: "",
      initialName: "",
      description: "",
      parentA: "",
      parentB: "",
      children: [],
    };

    this.onChangeParentA = this.onChangeParentA.bind(this);
    this.onChangeParentB = this.onChangeParentB.bind(this);
    this.onChangeFamilyName = this.onChangeFamilyName.bind(this);
    this.onChangeFamilyDescription = this.onChangeFamilyDescription.bind(this);

    this.onSubmitFamily = this.onSubmitFamily.bind(this);
    this.onDeleteFamily = this.onDeleteFamily.bind(this);
    this.childInputList = this.childInputList.bind(this);
    this.onChangeChild = this.onChangeChild.bind(this);
    this.addChildInput = this.addChildInput.bind(this);
    this.removeChildInput = this.removeChildInput.bind(this);
  }

  //Connect to the databaes and get family data here! <------------------------------
  componentDidMount() {
    //Read in the family being edited
    var url = new URLSearchParams(window.location.search);
    var id = url.get("id");
    this.setState({ objectId: id });

    console.log("About to connect to " + getServerUrl() + "/read/family/" + id);

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
          initialName: response.data.name,
          description: response.data.description,
          parentA: response.data.parentA.name,
          parentB: response.data.parentB.name,
          children: response.data.children,
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    //Read in people to be selected
    axios
      .get(getServerUrl() + "/read/person")
      .then((response) => {
        console.log("Person Response: ", response.data);
        //Set people for dropdown menu
        this.setState({ persons: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //Give a selection of people
  personDropdown() {
    return this.state.persons.map(function (currentPerson, i) {
      return <option value={currentPerson.name}>{currentPerson.name}</option>;
    });
  }

  //Submit the family here! <-----------------------------------------------------
  onSubmitFamily(e) {
    e.preventDefault();

    //Json
    const updatedFamily = {
      name: this.state.name,
      description: this.state.description,
      parentA: this.state.parentA,
      parentB: this.state.parentB,
      marriageDate: this.state.marriageDate,
      marriageLocation: this.state.marriageLocation,
      children: this.state.children,
    };

    axios
      .post(
        getServerUrl() + "/edit/family/" + this.state.objectId,
        updatedFamily
      )
      .then((res) => {
        console.log(res.data);
        alert(res.data);
        window.location.replace(getClientUrl() + "/admin");
      });
  }

  //Submit form data FOR DELETING
  onDeleteFamily(e) {
    e.preventDefault();
    //Confirm the delete
    if (window.confirm("Really delete this family?")) {
      const deleteData = {
        id: this.state.objectId,
      };

      axios.post(getServerUrl() + "/delete/family", deleteData).then((res) => {
        alert(res.data);
        window.location.replace(getClientUrl() + "/admin");
      });
    }
  }

  onChangeFamilyName(e) {
    this.setState({ name: e.target.value });
  }

  onChangeFamilyDescription(e) {
    this.setState({ description: e.target.value });
  }

  onChangeParentA(e) {
    this.setState({ parentA: e.target.value });
  }

  onChangeParentB(e) {
    this.setState({ parentB: e.target.value });
  }

  onChangeChild(e) {
    let newChildren = [...this.state.children];

    newChildren[e.target.list.id] = e.target.value;

    this.setState({
      children: newChildren,
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
          />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => obj.removeChildInput(i)}
            value={i}
          >
            X
          </button>
          <datalist id={i}>{obj.personDropdown()}</datalist>{" "}
        </div>
      );
    });
  }

  addChildInput() {
    console.log("Adding child", this);
    this.setState((prevState) => ({
      children: [...prevState.children, ""],
    }));
  }

  //Remove a specific child
  removeChildInput(index) {
    console.log("Removing child", index);
    console.log("Children before removal", this.state.children);

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
      <div class="container">
        {/*Edit family form*/}
        <FamilyForm editing={true} />

        {/*Delete family form*/}
        <form onSubmit={this.onDeleteFamily}>
          <div className="form-group">
            <input
              type="submit"
              value="Delete Family"
              className="btn btn-danger"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default FamilyEditor;
