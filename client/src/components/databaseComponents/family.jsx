import React, { Component } from "react";
import Person from "./person";
import { Collapse } from "react-collapse";
import { formatDate } from "../formatDate";

//Render family for a table

const Family = (props) => {
  return (
    <React.Fragment>
      <Collapse isOpened={props.viewingTable}>
        <th>
          {props.family.name} {props.family.subFamily ? "(Sub Family)" : ""}
        </th>
        <th>
          <i>{props.family.description}</i>
        </th>
        <tr>
          <td>
            <Person //ParentA
              name={props.family.parentA.name}
              description={props.family.parentA.description}
              birthdate={props.family.parentA.birthdate}
              deathdate={props.family.parentA.deathdate}
              _id={props.family.parentA._id}
              viewingTable={true}
            />
          </td>
          <td>
            <Person //ParentB
              name={props.family.parentB.name}
              description={props.family.parentB.description}
              birthdate={props.family.parentB.birthdate}
              deathdate={props.family.parentB.deathdate}
              _id={props.family.parentB._id}
              viewingTable={true}
            />
          </td>
        </tr>
        <tr>
          <td>
            Marriage Date:
            {props.family.marriageDate
              ? formatDate(
                  props.family.marriageDate,
                  props.family.marriageDateYearOnly
                )
              : ""}
          </td>
          <td>Marriage Location: {props.family.marriageLocation}</td>
        </tr>

        <Collapse isOpened={props.family.children.length > 0}>
          <tr id={props.family._id}>
            <i>Children</i>
            {props.family.children.map((child) => (
              <React.Fragment>
                <Person //Iterate through child data here
                  name={child.name}
                  description={child.description}
                  birthdate={child.birthdate}
                  brithdateYearOnly={child.birthdateYearOnly}
                  deathdate={child.deathdate}
                  deathdateYearOnly={child.deathdateYearOnly}
                  _id={child._id}
                  viewingTable={true}
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
