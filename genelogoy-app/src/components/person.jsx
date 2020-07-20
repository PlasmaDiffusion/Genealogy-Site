import React, { Component } from "react";

//Render person to appear in family table
const Person = (props) => {
  return (
    <div id={props._id}>
      <tr>
        <td>
          {props.name}

          <a
            href={
              props.name != "(Deleted)" ? "/edit/person/ ?id=" + props._id : ""
            }
          >
            {props.name != "(Deleted)" ? " Edit" : ""}
          </a>
        </td>
      </tr>
      <tr>
        <td>{props.description}</td>
      </tr>
      <tr>
        <td>{props.birthdate != null ? props.birthdate.split("T")[0] : ""}</td>
      </tr>
      <tr>
        <td>{props.deathdate != null ? props.deathdate.split("T")[0] : ""}</td>
      </tr>
    </div>
  );
};

export default Person;
