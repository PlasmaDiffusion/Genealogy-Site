import React, { Component } from "react";
import axios from "axios";
import { getClientUrl, getServerUrl } from "./getUrl.js";
import { formatDate } from "./formatDate.js";
import NullChecker from "./databaseComponents/classes/nullChecker.js";
import TreeData from "./databaseComponents/classes/treeData.js";

//Each component is a branch on a tree. It shows the family, then the parents, then the children all in their own lists. It can create more components recursively.
class FamilyBranch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: "",
      name: "",
      description: "",
      children: [],
      parentA: "",
      parentB: "",
      marriageDate: "",
      marriageLocation: "",
      treeData: { name: "", children: [] },
    };

    this.myRef = React.createRef();

    this.getChildrenLI = this.getChildrenLI.bind(this);
    this.getStartedFamiliesLI = this.getStartedFamiliesLI.bind(this);
    this.makeTreeData = this.makeTreeData.bind(this);
  }

  //Load in stuff for each family branch
  componentDidMount() {
    axios
      .get(getServerUrl() + "/read/family/" + this.props.familyId)
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

        this.setState({ children: [...this.state.children.sort()] });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidUpdate() {
    //Check if the root part of the tree
    if (this.props.baseId == this.props.familyId) {
      console.log("treeDataStart", this.myRef);

      var children = this.makeTreeData(this.myRef.current);
      /*this.setState({
        treeData: { name: this.state.name, children: children },
      });*/
    }
  }

  makeTreeData(element) {
    var childData = [];

    if (element.children) {
      let children = element.children;
      for (let i = 0; i < children.length; i++) {
        let html = children[i].innerHTML;
        if (true) {
          if (!html.includes("<"))
            console.log(
              "treeDataChildrenInnerHtml",
              children[i],
              children[i].tagName,
              html
            );
        }
      }

      //return childData;
    }

    return childData;
  }

  getStartedFamiliesLI(child) {
    if (child.startedFamilies) {
      let baseFamilyId = this.props.baseId;
      return (
        <ul>
          {child.startedFamilies.map((startedFamily, i) => {
            return (
              <FamilyBranch
                familyId={startedFamily._id}
                baseId={baseFamilyId}
              />
            );
          })}
        </ul>
      );
    } else return;
  }

  getChildrenLI() {
    return (
      <React.Fragment>
        <u>{this.state.children.length > 0 ? "Children" : ""}</u>
        <ul>
          {this.state.children.map((child, i) => {
            return (
              <React.Fragment>
                <li>{child.name}</li>
                {this.getStartedFamiliesLI(child)}
              </React.Fragment>
            );
          })}
        </ul>
      </React.Fragment>
    );
  }

  render() {
    return (
      <ul ref={this.myRef}>
        <li>
          <a
            href={
              this.props.familyId
                ? "/family/ ?id=" +
                  this.props.familyId +
                  "&baseId=" +
                  this.props.baseId
                : null
            }
            title={this.state.description}
          >
            {this.state.name}
          </a>
        </li>

        <ul>
          <li>{this.state.parentA.name}</li>
          <li>{this.state.parentB.name}</li>
          {this.getChildrenLI()}
        </ul>
      </ul>
    );
  }
}

export default FamilyBranch;
