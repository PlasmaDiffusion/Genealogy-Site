import React, { Component } from "react";

//You can change the below class into a single function like above
class NavBar extends Component {
  render() {
    return (
      <React.Fragment>
        <div id="mySidenav" class="sidenav">
          <a href="#">Family1</a>
          <a href="#">Family2</a>
          <a href="#">Family3</a>
          <a href="#">Family4</a>
        </div>
        {/*!-- Page Content to be filled in*/}
      </React.Fragment>
    );
  }

  //Get a bunch of family links from a database here
}

/*const NavBar = ({ totalCounters }) => {
  return (
    <React.Fragment>
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Navbar{" "}
          <span className="badge badge-pill badge-secondary">
            {totalCounters}
          </span>
        </a>
      </nav>

  );
};*/

export default NavBar;
