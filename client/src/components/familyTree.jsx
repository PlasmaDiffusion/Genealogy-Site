import React, { Component } from "react";
import Tree from "react-tree-graph";
import "react-tree-graph/dist/style.css";
import FamilyBranch from "./familyBranch";
import { getClientUrl, getServerUrl } from "./getUrl.js";
import axios from "axios";

class FamilyTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      family: {
        name: "Loading",
        pathProps: {},
        textProps: { x: -25, y: 25 },
        children: [],
      },
      data: {
        name: "Colour",
        pathProps: {},
        textProps: { x: -25, y: 25 },
        children: [
          {
            name: "Black",
            pathProps: { className: "black" },
            textProps: { x: -25, y: 25 },
            children: [],
          },
          {
            name: "Blue",
            pathProps: { className: "blue" },
            textProps: { x: -25, y: 25 },
            color: "blue",
            children: [
              {
                name: "Aquamarine",
                textProps: { x: -25, y: 25 },
                color: "aquamarine",
                children: [],
              },
              {
                name: "Cyan",
                textProps: { x: -25, y: 25 },
                color: "cyan",
                children: [],
              },
              {
                name: "Navy",
                textProps: { x: -25, y: 25 },
                color: "navy",
                children: [],
              },
              {
                name: "Turquoise",
                textProps: { x: -25, y: 25 },
                color: "turquoise",
                children: [],
              },
            ],
          },
          {
            name: "Green",
            pathProps: { className: "green" },
            textProps: { x: -25, y: 25 },
            color: "green",
            children: [],
          },
          {
            name: "Purple",
            pathProps: { className: "purple" },
            textProps: { x: -25, y: 25 },
            color: "purple",
            children: [
              {
                name: "Indigo",
                textProps: { x: -25, y: 25 },
                color: "indigo",
                children: [],
              },
              {
                name: "Violet",
                textProps: { x: -25, y: 25 },
                color: "violet",
                children: [],
              },
            ],
          },
          {
            name: "Red",
            pathProps: { className: "red" },
            textProps: { x: -25, y: 25 },
            color: "red",
            children: [
              {
                name: "Crimson",
                textProps: { x: -25, y: 25 },
                color: "crimson",
                children: [],
              },
              {
                name: "Maroon",
                textProps: { x: -25, y: 25 },
                color: "maroon",
                children: [],
              },
              {
                name: "Scarlet",
                textProps: { x: -25, y: 25 },
                color: "scarlet",
                children: [],
              },
            ],
          },
          {
            name: "White",
            pathProps: { className: "grey" },
            textProps: { x: -25, y: 25 },
            color: "grey",
            children: [],
          },
          {
            name: "Yellow",
            pathProps: { className: "yellow" },
            textProps: { x: -25, y: 25 },
            color: "yellow",
            children: [],
          },
        ],
      },
    };
  }

  handleClick = (event: any, node: any) => {
    console.log("handle click ", event);
    console.log("handle click node", node);
    alert(`${node} got clicked`);
  };

  loadFamily(familyId, data) {
    axios
      .get(getServerUrl() + "/read/family/" + familyId)
      .then((response) => {
        console.log("Family Response: ", response.data);

        if (data) {
          console.log("B", response.data);

          return {
            name: response.data.name,
            children: [
              response.data.parentA,
              {
                name: response.data.parentB.name,
                children: response.data.children,
              },
            ],
          };
        }

        response.data.children.forEach(async (child) => {
          child.startedFamilies.forEach((family) => {
            family = this.loadFamily(family._id, family);
          });
          child.children = child.startedFamilies;
        });

        if (!data) {
          this.setState({
            family: {
              name: response.data.name,
              children: [
                response.data.parentA,
                {
                  name: response.data.parentB.name,
                  children: response.data.children,
                },
              ],
            },
          });
        }

        console.log("F", this.state.family);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //Read in data
  componentDidMount() {
    console.log(
      "About to connect to " +
        getServerUrl() +
        "/read/family/5f23132c7deb7f001757a935"
    );
    this.loadFamily("5f23132c7deb7f001757a935");
  }

  render() {
    return (
      <Tree
        animated={true}
        data={this.state.family}
        nodeProps={{ r: 15 }}
        margins={{ top: 20, bottom: 10, left: 20, right: 200 }}
        gProps={{
          className: "node",
          onClick: this.handleClick,
        }}
        textProps={{ x: -25, y: 25 }}
        height={700}
        width={1000}
      />
    );
  }
}

export default FamilyTree;
