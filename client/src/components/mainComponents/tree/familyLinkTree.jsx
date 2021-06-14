import React, { Component } from "react";
import { getClientUrl, getServerUrl } from "../../../services/getUrl.js";
import Sorter from "../../../services/sorter.js";
import axios from "axios";
import "./tree.scss";
import FamilyGrid from "./familyGrid";

//On the home page show family group links. After you click a group, only show families containing that group name.
class FamilyLinkTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      familyNames: [],
      familyLinkOrder: [], //Order families are displayed on the grid
      families: [],
      rootFamilyName: "", //Root family would be the McNee family. Sub families would be McNee 1896, McNee 1900, etc.
      rootFamilyId: "",
    };
  }

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
              //console.log(error);
            });
        }
      })
      .catch(function (error) {
        //console.log(error);
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
        if (index == 0) this.setState({ rootFamilyId: family._id });
      });
    });

    this.setState({
      families: [...orderedFamilies],
    });

    //console.log("Fam", this.state.families);
  }

  render(){
    return <FamilyGrid
    familyNames={this.state.familyNames}
    families={this.state.families}
    rootFamilyName={this.state.rootFamilyName}
    rootFamilyId={this.state.rootFamilyId}
    familyNames={this.state.familyNames}
    onHomePage={this.props.onHomePage}
    />
  }
}

export default FamilyLinkTree;
