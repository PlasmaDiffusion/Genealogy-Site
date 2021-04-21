import React, { Component } from "react";
import { Collapse } from "react-collapse";
import { formatDate } from "../../services/formatDate";

//Render person to appear in family table
const Person = (props) => {
  return (
    <React.Fragment>
      <Collapse isOpened={props.viewingTable}>
        <div id={props._id}>
          <tr>
            <td>
              {props.name}

              <a
                href={
                  props.name != "(Deleted)"
                    ? "/edit/person/ ?id=" + props._id
                    : ""
                }
              >
                {props.name != "(Deleted)" ? " Edit Person" : ""}
              </a>
            </td>
          </tr>
          <tr>
            <td>{props.description}</td>
          </tr>
          <tr>
            <td>
              <i>Born </i>
              {props.birthdate
                ? formatDate(props.birthdate, props.birthdateYearOnly)
                : ""}
            </td>
          </tr>
          <tr>
            <td>
              <i>Died </i>
              {props.deathdate
                ? formatDate(props.deathdate, props.deathdateYearOnly)
                : ""}
            </td>
          </tr>
        </div>
      </Collapse>
    </React.Fragment>
  );
};

export default Person;
