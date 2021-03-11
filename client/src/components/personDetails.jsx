import React from "react";
import { formatDate } from "./formatDate.js";


//Parent "card". Reads in first name, middle name and last name and adds spaces if none are there. Dates are read in but ignore specific time
export const Parent = (props) => {
    return (
      <div class="col-lg">
        <div class="col-lg p-3 green text-white">
          <h2>{props.person.name.split(" ")[0]}</h2>
          <h2>
            {props.person.name.split(" ")[1] ? (
              props.person.name.split(" ")[1]
            ) : (
              <br></br>
            )}
          </h2>
          <h2>
            {props.person.name.split(" ")[2] ? (
              props.person.name.split(" ")[2]
            ) : (
              <br></br>
            )}
          </h2>
        </div>
        <div className="border">
        <p>
          <i>{props.person.description}</i>
        </p>
        <p>
          <b>
            {props.person.birthdate
              ? "Born: " +
                formatDate(props.person.birthdate, props.person.birthdateYearOnly)
              : ""}
            <br></br>
          </b>
          {props.person.birthLocation ? props.person.birthLocation : ""}
        </p>
        <p>
          <b>
            {props.person.deathdate
              ? "Died: " +
                formatDate(props.person.deathdate, props.person.deathdateYearOnly)
              : ""}
            <br></br>
          </b>
          {props.person.deathLocation ? props.person.deathLocation : ""}
        </p>
        </div>
      </div>
    );
  };
  
  //Child "card". On top of the usual stuff, display links to families these children started
export  const Child = (props) => {
    return (
      <div class="col-lg">
        <p class={"p-1 mb-0 darkGreen text-white "}>
          {props.person.name}
        </p>
        <div className="border mb-3">
        <p>
          <i>{props.person.description}</i>
        </p>
        <p>
          <b>
            {props.person.birthdate
              ? "Born: " +
                formatDate(props.person.birthdate, props.person.birthdateYearOnly)
              : ""}
            <br></br>
          </b>
          {props.person.birthLocation ? props.person.birthLocation : ""}
        </p>
        <p>
          <b>
            {props.person.deathdate
              ? "Died: " +
                formatDate(props.person.deathdate, props.person.deathdateYearOnly)
              : ""}
            <br></br>
          </b>
          {props.person.deathLocation ? props.person.deathLocation : ""}
        </p>
        <p>
          {props.person.startedFamilies.length > 0 ? <u>Started families</u> : ""}
          {props.person.startedFamilies.map((currentFamily) => (
            <React.Fragment>
              <br></br>
              <a
                href={
                  "/family/ ?id=" + currentFamily._id + "&baseId=" + props.baseId
                }
                title={currentFamily.description}
              >
                {currentFamily.name}
              </a>
            </React.Fragment>
          ))}
        </p>
        </div>
      </div>
    );
  };
