import { Component } from "react";

//Use this class to check if families have references to deleted people.
class NullChecker {
  constructor() {}

  //Check for missing family member entries, and give them blank placeholder values
  familyNullCheck(responseData) {
    var obj = this;

    responseData.map(function (currentFamily, i) {
      console.log("Checking for null", currentFamily);
      if (currentFamily.parentA == null) {
        currentFamily.parentA = {
          name: "(Deleted)",
          description: "",
          birthdate: "",
          deathdate: "",
        };
      }
      if (currentFamily.parentB == null) {
        currentFamily.parentB = {
          name: "(Deleted)",
          description: "",
          birthdate: "",
          deathdate: "",
        };
      }
      //console.log("EH", currentFamily);

      obj.childrenNullCheck(currentFamily.children);
    });
  }

  //Check for any missing children
  childrenNullCheck(children) {
    children.map(function (currentChild, i) {
      if (currentChild == null) {
        currentChild = {
          name: "(Deleted)",
          description: "",
          birthdate: "",
          deathdate: "",
        };
      }
    });
  }
}

export default NullChecker;
