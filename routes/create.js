const express = require("express");
const routes = express.Router();
const { Person, Family, FamilyGroup } = require("../server");
const { findPeople, findFamilies } = require("../serverFunctions");

//Add a person
routes.route("/add/person").post(function (req, res) {
  console.log(req.body);

  let person = new Person(req.body);

  person
    .save()
    .then((person) => {
      res.status(200).json("Person added successfully.");
    })
    .catch((err) => {
      res.status(400).send("Adding new Person failed");
    });
});

//Add a family
routes.route("/add/family").post(async function (req, res) {
  console.log("Body", req.body);

  //Declare variables to find
  var parentA = "";
  var parentB = "";
  var children = [];
  try {
    //Find the first parent
    ({ parentA, parentB } = await findPeople(req, parentA, parentB, children));
  } catch (e) {
    console.log(e);
  } finally {
    console.log("Family Name", req.body.name);

    //Now save the family if everything was found
    let family = new Family({
      name: req.body.name,
      description: req.body.description,
      subFamily: req.body.subFamily,
      parentA: parentA._id,
      parentB: parentB._id,
      children: children,
      marriageDate: req.body.marriageDate,
      marriageDateYearOnly: req.body.marriageDateYearOnly,
      marriageLocation: req.body.marriageLocation,
    });

    family
      .save()
      .then((family) => {
        console.log("Added", family);
        res.status(200).json("Family added successfully.");
      })
      .catch((err) => {
        res.status(400).send("Adding new family failed");
      });
  }
});

//Add a root family (Name and number only)
routes.route("/add/FamilyGroup").post(async function (req, res) {
  console.log("Body", req.body);

  let FamilyGroup = new FamilyGroup(req.body);

  FamilyGroup.save()
    .then((FamilyGroup) => {
      res.status(200).json("Person added successfully.");
    })
    .catch((err) => {
      res.status(400).send("Adding new Person failed");
    });
});

module.exports = routes;
