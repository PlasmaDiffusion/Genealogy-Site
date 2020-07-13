import React, { Component } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

const Family = (props) => (
  <tr>
    <td>{props.family.parentA}</td>
    <td>{props.family.parentB}</td>
    <td>{/*<Link to={"/edit/" + props.todo._id}>Edit</Link>*/}</td>
  </tr>
);

class FamilyPost extends Component {
  constructor(props) {
    super(props);
    this.state = { families: [], parentA: "", parentB: "" };

    this.onChangeTodoParentA = this.onChangeTodoParentA.bind(this);
    this.onChangeTodoParentB = this.onChangeTodoParentB.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    console.log("About to connect");
    axios
      .get("http://localhost:4000/read")
      .then((response) => {
        console.log("Response: ", response.data);
        this.setState({ families: response.data });
        console.log("response: ", response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  familyList() {
    return this.state.families.map(function (currentFamily, i) {
      return <Family family={currentFamily} key={i} />;
    });
  }

  onSubmit(e) {
    e.preventDefault();

    console.log(`Form submitted:`);
    console.log(`ParentA: ${this.state.parentA}`);
    console.log(`ParentB: ${this.state.parentB}`);

    const newFamily = {
      parentA: this.state.parentA,
      parentB: this.state.parentB,
    };

    axios
      .post("http://localhost:4000/add", newFamily)
      .then((res) => console.log(res.data));

    this.setState({
      parentA: "",
      parentB: "",
    });
  }

  //onChange Events below
  onChangeTodoParentA(e) {
    this.setState({
      parentA: e.target.value,
    });
  }

  onChangeTodoParentB(e) {
    this.setState({
      parentB: e.target.value,
    });
  }

  render() {
    return (
      <div>
        <h3>Family List</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Parent A</th>
              <th>Parent B</th>
              <th>Child</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{this.familyList()}</tbody>
        </table>
        {/*WIP submit sut*/}
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Parent A: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.parentA}
              onChange={this.onChangeTodoParentA}
            />
          </div>
          <div className="form-group">
            <label>Parent B: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.parentB}
              onChange={this.onChangeTodoParentB}
            />
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Update Todo"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default FamilyPost;
