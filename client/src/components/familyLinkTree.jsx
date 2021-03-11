import React, { Component } from "react";
import { getClientUrl, getServerUrl } from "./getUrl.js";
import Sorter from "./databaseComponents/classes/sorter.js";
import axios from "axios";

//On the home page show family group links. After you click a group, only show families containing that group name.
class FamilyLinkTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      familyNames: [],
      familyLinkOrder: [], //Order families are displayed on the grid
      families: [],
      rootFamilyId: "", //Root family would be the McNee family. Sub families would be McNee 1896, McNee 1900, etc.
      rootFamilyName: "",
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
        if (this.props.onHomePage)
          this.setState({ familyNames: response.data.names });
        
        this.setState({ familyLinkOrder: response.data.linkOrder });

        //Read all families of a particular name
        if (!this.props.onHomePage) {

          //Get the family name we're searching for.
          let url = new URLSearchParams(window.location.search);
          let nameToSearchFor = url.get("rootName");
          this.setState({
            rootFamilyName: nameToSearchFor,
          });

          //console.log("searching for ", nameToSearchFor);

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

    //Sort families by their name
    let sorter = new Sorter();
    let sortedFamilies = sorter.sortFamiliesByNameAndMarriage(response.data);

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

    //console.log("Fam", this.state.families);
  }

  //Either return the family of the particular index or return nothing if it doesn't exist (Either an empty grid or nothing will be returned)
  displayFamily(i, mobileRender) {
    return this.state.familyNames[i] || this.state.families[i] ? (
      this.props.onHomePage ? (
        <FamilyLink name={this.state.familyNames[i]} key={i} onHomePage={true} />
      ) : (
        <FamilyLink
          name={this.state.families[i].name}
          key={i}
          onHomePage={false}
          _id={this.state.families[i]._id}
          baseId={this.state.firstFamilyId}
          rootName={this.state.rootFamilyName}
        />
      )
    ) : (
      <h2 style={{ visibility: "hidden", display: (mobileRender ? "none" : "block") }}>|</h2>
    );
  }

  //Get a single family
  getTreeColumn(index, mobileRender) {
    if (mobileRender)
    {return <div className="row">{this.displayFamily(index, mobileRender)}
    </div>}
    else
    return <div className="col-sm-2">{this.displayFamily(index, mobileRender)}</div>;
  }

  //Get a row of several families
  getTreeRow(index, mobileRender) {
    //Simulate a for loop
    let colArray = [];
    for (let i = 0; i < this.cols; i++) colArray.push("");

    if (mobileRender)
    return (
      colArray.map((val, i) => this.getTreeColumn(index + i, mobileRender))
    );
    else
    return (
      <div className="row">
        {colArray.map((val, i) => this.getTreeColumn(index + i, mobileRender))}
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
        <h1 className="treeBg treeTitle smallFont-mobile">
          {this.state.rootFamilyName ? this.state.rootFamilyName + " Family Tree" : "Pick A Family"}
        </h1>
        <div className="treeBg">
          {/*<h1 className="d-flex justify-content-center">Creating Family Trees</h1>*/}
          <img
            src={process.env.PUBLIC_URL + "/images/bigTree.png"}
            className="img-fluid treeImg"
          ></img>
          {/* Render family grid */}
          <div className="container position-absolute img-fluid treeLink desktopOnly">
            {rowArray.map((val, index) => this.getTreeRow(index * this.cols, false))}
          </div>
          {/* Render family as a list for mobile */}
          <div className="container position-absolute img-fluid treeLink mobileOnly">
            {rowArray.map((val, index) => this.getTreeRow(index * this.cols, true))}
          </div>
          {/*
              <h2 style={{ visibility: "hidden" }}> | </h2>
        */}
        </div>
        {/* Extra blue background when page is height is more on mobile */}
        <div className="treeBg mobileOnly" >
          <div style={{padding: "30%"}}></div>
        </div>
      </React.Fragment>
    );
  }
}

//Put links here to either a family tree page (when on the home page) or a link to a specific family
const FamilyLink = (props) => (
  <React.Fragment>
    <h2 className=" d-flex justify-content-center familyLink">
      {props.onHomePage ? (
        <a href={"/familyTree/ ?rootName=" + props.name}>{props.name}</a>
      ) : (
        <a href={"/family/ ?id=" + props._id  + "&subFamilyName=" + props.name + "&rootName="+ props.rootName}>
          {props.name /* + "&baseId=" + props.baseId */}
        </a>
      )}
    </h2>
  </React.Fragment>
);

export default FamilyLinkTree;
