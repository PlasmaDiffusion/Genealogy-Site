import React, { Component } from "react";
import axios from "axios";
import { getClientUrl, getServerUrl } from "./getUrl.js";
import { formatDate } from "./formatDate.js";
import NullChecker from "./databaseComponents/classes/nullChecker.js";

//Each component is a branch on a tree. It shows the family, then the parents, then the children all in their own lists. It can create more components recursively.
class FamilyBranch extends Component {
  constructor(props) {
    super(props);

    this.setState({
      name: "",
      description: "",
      children: "",
      parentA: "",
      parentB: "",
      marriageDate: "",
      marriageLocation: "",
    });

    this.getChildrenLI = this.getChildrenLI.bind(this);
    this.getStartedFamiliesLI = this.getStartedFamiliesLI.bind(this);
  }

  //Load in stuff for each family branch
  componentDidMount() {
    axios
      .get(getServerUrl() + "/read/family/" + this.props.family._id)
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
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getStartedFamiliesLI(child) {
    if (child.startedFamilies)
      return (
        <ul>
          {child.startedFamilies.map((startedFamily, i) => {
            return <FamilyBranch family={startedFamily} />;
          })}
        </ul>
      );
    else return;
  }

  getChildrenLI() {
    return (
      <ul>
        {this.props.family.children.map((child, i) => {
          return (
            <React.Fragment>
              <li>{child.name}</li>
              {this.getStartedFamiliesLI(child)}
            </React.Fragment>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <ul>
        <li>
          <a
            href={
              this.props.family._id
                ? "/family/ ?id=" + this.props.family._id
                : null
            }
            title={this.props.family.description}
          >
            {this.props.family.name}
          </a>
        </li>

        <ul>
          <li>{this.props.family.parentA.name}</li>
          <li>{this.props.family.parentB.name}</li>
          {this.getChildrenLI()}
        </ul>
      </ul>
    );
  }
}

export default FamilyBranch;
