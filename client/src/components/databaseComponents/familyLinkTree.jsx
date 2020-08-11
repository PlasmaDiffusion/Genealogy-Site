import React, { Component } from "react";
import { getClientUrl, getServerUrl } from "../getUrl.js";

import axios from "axios";

//Read in families, and show non sub families as links on the sidebar.
class FamilyLinkTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      families: [],
    };

    //Refs can't normally be used with arrays :(
    this.ref0 = React.createRef();
    this.ref1 = React.createRef();
    this.ref2 = React.createRef();
    this.ref3 = React.createRef();
    this.ref4 = React.createRef();
    this.ref5 = React.createRef();
    this.ref6 = React.createRef();
    this.ref7 = React.createRef();
    this.ref8 = React.createRef();

    this.familyList = this.familyList.bind(this);
    this.displayFamily = this.displayFamily.bind(this);
  }

  getRefArray() {
    return [
      this.ref0.current,
      this.ref1.current,
      this.ref2.current,
      this.ref3.current,
      this.ref4.current,
      this.ref5.current,
      this.ref6.current,
      this.ref7.current,
      this.ref8.current,
    ];
  }

  //Read in data
  componentDidMount() {
    console.log("About to connect to " + getServerUrl() + "/read/family");

    axios
      .get(getServerUrl() + "/read/family")
      .then((response) => {
        console.log("Family Response: ", response.data);
        this.setState({ families: response.data });

        var refs = this.getRefArray();
        console.log("refs", refs);
        refs[0] = (
          <Family
            family={this.state.families[0]}
            key={0}
            editing={this.props.editing}
          />
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //Either return the family of the particular index or return nothing if it doesn't exist
  displayFamily(i) {
    return this.state.families[i] ? (
      <Family
        family={this.state.families[i]}
        key={i}
        editing={this.props.editing}
      />
    ) : (
      ""
    );
  }

  //Show links to families
  familyList() {
    var thisObj = this;
    return this.state.families.map(function (currentFamily, i) {
      return currentFamily.subFamily ? (
        ""
      ) : i % 2 == 0 ? (
        <React.Fragment>
          {/*New row*/}
          <div class="row">
            <Family
              family={currentFamily}
              key={i}
              editing={thisObj.props.editing}
            />
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/*No new row*/}
          <div class="col-sm">
            <Family
              family={currentFamily}
              key={i}
              editing={thisObj.props.editing}
            />
          </div>
        </React.Fragment>
      );
    });
  }

  //Render a sidebar with links to families
  render() {
    return (
      <React.Fragment>
        <img
          src={process.env.PUBLIC_URL + "/images/bigTree.png"}
          id={"treeImg"}
        ></img>
        <div class="container">
          <div class="row">
            <div class="col-sm">
              <h1> {this.displayFamily(0)} </h1>
            </div>
            <div class="col-sm">
              <h1 style={{ visibility: "hidden" }}> | </h1>
            </div>
            <div class="col-sm">
              <h1> {this.displayFamily(1)} </h1>
            </div>
          </div>
          <div class="row">
            <div class="col-sm">
              <h1 style={{ visibility: "hidden" }}> | </h1>
            </div>
            <div class="col-sm">
              <h1 style={{ visibility: "hidden" }}> | </h1>
            </div>
            <div class="col-sm">
              <h1 style={{ visibility: "hidden" }}> | </h1>
            </div>
          </div>
          <div class="row">
            <div class="col-sm">
              <h1> {this.displayFamily(1)} </h1>
            </div>
            <div class="col-sm">
              <h1 style={{ visibility: "hidden" }}> | </h1>
            </div>
            <div class="col-sm">
              <h1> {this.displayFamily(0)} </h1>
            </div>
          </div>
        </div>
        {this.familyList()}
      </React.Fragment>
    );
  }
}

//Put links here to later be put on the sidebar
const Family = (props) =>
  props.editing ? (
    <React.Fragment />
  ) : (
    <React.Fragment>
      <a
        href={
          "/family/ ?id=" + props.family._id + "&baseId=" + props.family._id
        }
        title={props.family.description}
      >
        {props.family.name}
      </a>
    </React.Fragment>
  );

export default FamilyLinkTree;
