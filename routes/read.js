const express = require("express");
const routes = express.Router();
const { Person, Family, FamilyGroup } = require("../server");

//Get people
routes.get("/read/person", (req, res) => {
  Person.find()
    .populate("startedFamilies")
    .exec(function (err, persons) {
      if (err) {
        console.log(err);
      } else {
        res.json(persons);
      }
    });
});
routes.get("/read/family", (req, res) => {
  //console.log("Reading in all families");
  Family.find()
    .populate("parentA")
    .populate("parentB")
    .populate("children") // Populate the person object references
    .exec(function (err, families) {
      if (err) {
        console.log(err);
      } else {
        res.json(families);
      }
    });
});
//Read root families for the homepage
routes.get("/read/familyGroup", async function (req, res) {
  FamilyGroup.findOne().exec(function (err, rootFamilies) {
    if (err) {
      console.log(err);
    } else {
      console.log(rootFamilies);
      res.json(rootFamilies);
    }
  });
});
//Get a person (read in json data)
routes.get("/read/person/:id", function (req, res) {
  //console.log(req.params.id);
  Person.findById(req.params.id)
    .populate("startedFamilies")
    .exec(function (err, persons) {
      if (err) {
        console.log(err);
      } else {
        console.log(persons);
        res.json(persons);
      }
    });
});
//Get a family (read in json data)
routes.get("/read/family/:id", function (req, res) {
  Family.findById(req.params.id)
    .populate("parentA")
    .populate("parentB")
    .populate({
      path: "children",
      populate: {
        path: "startedFamilies",
        model: "Family",
        populate: {
          path: "parentA",
          model: "Person",
        },
      },
    })
    .exec(function (err, family) {
      if (err) {
        console.log(err);
      } else {
        res.json(family);
        console.log("Reading...", family);
      }
    });
});
//Get all families containing a particular name
routes.get("/read/familyByName/:name", function (req, res) {
  Family.find({ name: { $regex: req.params.name, $options: "i" } })
    .populate("parentA")
    .populate("parentB")
    .populate({
      path: "children",
      populate: {
        path: "startedFamilies",
        model: "Family",
        populate: {
          path: "parentA",
          model: "Person",
        },
      },
    })
    .exec(function (err, family) {
      if (err) {
        console.log(err);
      } else {
        res.json(family);
        console.log("Read in this from name", req.params.name, family);
      }
    });
});

module.exports = routes;
