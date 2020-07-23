import React, { Component } from "react";
import Person from "./person";
import { Collapse } from "react-collapse";

//Render family for a table

const Family = (props) => {
  return (
    <React.Fragment>
      <Collapse isOpened={props.viewingTable}>
        <th>{props.family.name}</th>
        <th>Description: {props.family.description}</th>
        <tr>
          <td>
            <Person //Iterate through child data here
              name={props.family.parentA.name}
              description={props.family.parentA.description}
              birthdate={props.family.parentA.birthdate}
              deathdate={props.family.parentA.deathdate}
              _id={props.family.parentA._id}
            />
          </td>
          <td>
            <Person //Iterate through child data here
              name={props.family.parentB.name}
              description={props.family.parentB.description}
              birthdate={props.family.parentB.birthdate}
              deathdate={props.family.parentB.deathdate}
              _id={props.family.parentB._id}
            />
          </td>
        </tr>
        {/*<tr>
        <button
          class="btn btn-primary"
          type="button"
          data-toggle="collapse"
          data-target={"#" + props.family._id}
          aria-expanded="false"
          aria-controls={"#" + props.family._id}
          onClick={() => {}}
        >
          Show Children
        </button>
      </tr>*/}

        <Collapse isOpened={props.editable}>
          <tr id={props.family._id}>
            <i>Children</i>
            {props.family.children.map((child) => (
              <React.Fragment>
                <Person //Iterate through child data here
                  name={child.name}
                  description={child.description}
                  birthdate={child.birthdate}
                  deathdate={child.deathdate}
                  _id={child._id}
                />
                <br></br>
              </React.Fragment>
            ))}
          </tr>
        </Collapse>

        {/*<Collapse isOpened={props.showChildren}>*/}
        <tr>
          <h3>
            <a href={"/edit/family/ ?id=" + props.family._id}>Edit Family</a>
          </h3>
        </tr>
        {/*</Collapse>*/}
      </Collapse>
    </React.Fragment>
  );
};

export default Family;
