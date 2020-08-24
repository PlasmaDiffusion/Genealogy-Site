import React, { Component } from "react";
import { getClientUrl, getServerUrl } from "../getUrl.js";
import Sorter from "./classes/sorter.js";
import axios from "axios";

//On the home page show family group links. After you click a group, only show families containing that group name.
class FamilyLinkTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      familyNames: [],
      familyLinkOrder: [],
      families: [],
      rootFamilyId: "", //Root family that all sub families should belong to
      specificFamilyName: "",
      firstFamilyId: "",
    };

    //Grid size goes here
    this.rows = 5;
    this.cols = 5;

    this.displayFamily = this.displayFamily.bind(this);
  }

  //Read in data
  componentDidMount() {
    //Read in family groups if on the home page (Basically just names of families to search for)

    axios
      .get(getServerUrl() + "/read/familyGroup")
      .then((response) => {
        //Collect families here
        console.log("Family Response: ", response.data);
        if (this.props.onHomePage)
          this.setState({ familyNames: response.data.names });
        this.setState({ familyLinkOrder: response.data.linkOrder });
        console.log("Fam", this.state.familyNames);
        console.log("Link order", this.state.familyLinkOrder);

        //Read all families of a particular name
        if (!this.props.onHomePage) {
          let url = new URLSearchParams(window.location.search);
          let nameToSearchFor = url.get("name");
          this.setState({
            specificFamilyName: nameToSearchFor + " Family Tree",
          });

          console.log("searching for ", nameToSearchFor);

          axios
            .get(getServerUrl() + "/read/familyByName/" + nameToSearchFor)
            .then((response) => {
              //Collect families here
              this.organizeSpecificFamilies(response);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //Call this function once a list of families from the server has been obtained.
  organizeSpecificFamilies(response) {
    console.log("Family Response By Name: ", response.data);

    //Sort families by their name
    let sorter = new Sorter();
    let sortedFamilies = sorter.sortFamilies(response.data);

    //Now display the families in the grid order set in the database (It's another sort, but this)
    let unorderedFamilies = [...sortedFamilies];
    let orderedFamilies = [];

    //Go through each family, then go through each ordered link. If the order value matches the index, set that family there
    unorderedFamilies.map((family, index) => {
      this.state.familyLinkOrder.map((order, i) => {
        //If the order value matches the index, set that family under i
        if (order - 1 == index) orderedFamilies[i] = family;

        //Save the id of what was the first family to be used later
        if (index == 0) this.setState({ firstFamilyId: family._id });
      });
    });

    this.setState({
      families: [...orderedFamilies],
    });

    console.log("Fam", this.state.families);
  }

  //Either return the family of the particular index or return nothing if it doesn't exist
  displayFamily(i) {
    return this.state.familyNames[i] || this.state.families[i] ? (
      this.props.onHomePage ? (
        <Family name={this.state.familyNames[i]} key={i} onHomePage={true} />
      ) : (
        <Family
          name={this.state.families[i].name}
          key={i}
          onHomePage={false}
          _id={this.state.families[i]._id}
          baseId={this.state.firstFamilyId}
        />
      )
    ) : (
      <h2 style={{ visibility: "hidden" }}>|</h2>
    );
  }

  //Get a column of a single input field
  getTreeColumn(index) {
    return <div class="col-sm-2">{this.displayFamily(index)}</div>;
  }

  //Get a row of several input fields
  getTreeRow(index) {
    //Simulate a for loop
    let colArray = [];
    for (let i = 0; i < this.cols; i++) colArray.push("");

    return (
      <div class="row">
        {colArray.map((val, i) => this.getTreeColumn(index + i))}
      </div>
    );
  }

  //Render a sidebar with links to families
  render() {
    //Simualte a for loop
    let rowArray = [];
    for (let i = 0; i < this.rows; i++) rowArray.push("");

    return (
      <React.Fragment>
        <h1 class="treeBg d-flex justify-content-center">
          {this.state.specificFamilyName}
        </h1>
        <div class="treeBg">
          {/*<h1 class="d-flex justify-content-center">Creating Family Trees</h1>*/}
          <img
            src={process.env.PUBLIC_URL + "/images/bigTree.png"}
            class="img-fluid treeImg"
          ></img>
          <div class="container position-absolute img-fluid treeLink">
            {rowArray.map((val, index) => this.getTreeRow(index * this.cols))}
          </div>
          {/*
              <h2 style={{ visibility: "hidden" }}> | </h2>
        */}
        </div>
      </React.Fragment>
    );
  }
}

//Put links here to either a family tree page (when on the home page) or a link to a specific family
const Family = (props) => (
  <React.Fragment>
    <h2 class=" d-flex justify-content-center">
      {props.onHomePage ? (
        <a href={"/familyTree/ ?name=" + props.name}>{props.name}</a>
      ) : (
        <a href={"/family/ ?id=" + props._id + "&baseId=" + props.baseId}>
          {props.name}
        </a>
      )}
    </h2>
  </React.Fragment>
);

export default FamilyLinkTree;
