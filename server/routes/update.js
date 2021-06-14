const express = require("express");
const routes = express.Router();
const { Person, Family, FamilyGroup } = require("../server");
const { findPeople, findFamilies } = require("../serverFunctions");

//Update a family
routes.post("/edit/family/:id", async function (req, res) {
  console.log("Editing", req.params.id);

  console.log("Body", req.body);

  //Declare variables to find
  var parentA = "";
  var parentB = "";
  var children = [];
  try {
    //Find the first and second parent
    ({ parentA, parentB } = await findPeople(req, parentA, parentB, children));
  } catch (e) {
    res.status(400).json("Updating family failed " + err);
  } finally {
    console.log("Family Name", req.body.name);

    try {
      //Now update the family if everything was found
      Family.findById(req.params.id, function (err, family) {
        if (err) console.log(err);
        else {
          family.name = req.body.name;
          family.description = req.body.description;
          family.subFamily = req.body.subFamily;
          family.FamilyGroup = family.parentA = parentA._id;
          family.parentB = parentB._id;
          family.marriageDate = req.body.marriageDate;
          family.marriageDateYearOnly = req.body.marriageDateYearOnly;
          family.marriageLocation = req.body.marriageLocation;
          family.children = children;
          family
            .save()
            .then((family) => {
              console.log("Added", family);
              res.status(200).json("Family updated successfully");
            })
            .catch((err) => {
              res.status(400).json("Updating family failed");
            });
        }
      });
    } catch {
      res.status(400).json("Updating family failed " + err);
    }
  }
});

//Update a person
routes.post("/edit/person/:id", function (req, res) {
  console.log(req.params);

  Person.findById(req.params.id, async function (err, person) {
    if (!person) res.status(404).send("data is not found");
    else {
      person.name = req.body.name;
      person.description = req.body.description;
      person.birthdate = req.body.birthdate;
      person.birthdateYearOnly = req.body.birthdateYearOnly;
      person.deathdate = req.body.deathdate;
      person.deathdateYearOnly = req.body.deathdateYearOnly;
      person.birthLocation = req.body.birthLocation;
      person.deathLocation = req.body.deathLocation;
      person.startedFamilies = await findFamilies(req);

      person
        .save()
        .then((person) => {
          res.json("Person updated!");
        })
        .catch((err) => {
          res.status(400).send("Update not possible");
        });
    }
  });
});

//Update a family group (Name only)
routes.post("/edit/familyGroup/", async function (req, res) {
  console.log("Body", req.body);

  FamilyGroup.findOne(async function (err, familyGroup) {
    if (!familyGroup) res.status(404).send("data is not found");
    else {
      if (req.body.name) familyGroup.name = req.body.name;
      if (req.body.linkOrder) familyGroup.linkOrder = req.body.linkOrder;

      familyGroup
        .save()
        .then((familyGroup) => {
          res.json("Family Group updated!");
        })
        .catch((err) => {
          res.status(400).send("Update not possible");
        });
    }
  });
});

module.exports = routes;
