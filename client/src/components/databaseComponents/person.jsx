import React, { Component } from "react";
import { formatDate } from "../formatDate";

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
        <td>
          <i>Born</i>{" "}
          {props.birthdate != null ? formatDate(props.birthdate) : ""}
        </td>
      </tr>
      <tr>
        <td>
          <i>Died</i>{" "}
          {props.deathdate != null ? formatDate(props.deathdate) : ""}
        </td>
      </tr>
    </div>
  );
};

export default Person;
