const express = require("express");
const routes = express.Router();
const { Person, Family, FamilyGroup } = require("../server");

//Remove a person
routes.route("/delete/person").post(function (req, res) {
  console.log("Removing person", req.body);

  Person.deleteOne({ _id: req.body.id }, function (err) {
    if (err) return handleError(err);
    else res.status(200).json("The person was deleted.");
  });
});

//Remove a family
routes.route("/delete/family").post(function (req, res) {
  console.log("Removing family", req.body);

  Family.deleteOne({ _id: req.body.id }, function (err) {
    if (err) return handleError(err);
    else res.status(200).json("The family was deleted.");
  });
});

//Delete a root family (Name and number only)
routes.route("/delete/familyGroup/:id").post(async function (req, res) {
  FamilyGroup.deleteOne({ _id: req.body.id }, function (err) {
    if (err) return handleError(err);
    else res.status(200).json("The family group was deleted.");
  });
});

module.exports = routes;
