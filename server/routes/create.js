const express = require("express");
const routes = express.Router();
const { Person, Family, FamilyGroup } = require("../server");
const { findPeople, findFamilies } = require("../serverFunctions");

//Add a person
routes.post("/add/person", function (req, res) {
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
routes.post("/add/family", async function (req, res) {
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

//Add a root family and overwrite the old one (Name and number only)
routes.post("/add/familyGroup", async function (req, res) {
  console.log("Body", req.body);

  //Remove older ones
  FamilyGroup.deleteMany({}, function (err) {
    if (err) return handleError(err);
    // deleted at most one tank document
    else {
      console.log("Deleted old family group");
    }
  });

  let familyGroup = new FamilyGroup(req.body);

  familyGroup
    .save()
    .then((familyGroup) => {
      console.log("Created new family group", familyGroup);
      res.status(200).json("Family Groups modified successfully.");
    })
    .catch((err) => {
      res.status(400).send("Adding new set of Family Groups failed");
    });
});

module.exports = routes;
