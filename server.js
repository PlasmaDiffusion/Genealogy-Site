const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 4000;
const routes = express.Router();
const path = require("path");
const { findPeople, findFamilies } = require("./serverFunctions");

app.use(cors());
app.use(bodyParser.json());
app.use("/", routes);

var ObjectID = require("mongodb").ObjectID;
var Family = require("./family.js").family;
exports.Family = Family;
var Person = require("./family.js").person;
exports.Person = Person;

const uri =
  "mongodb+srv://admin:" +
  process.env.MONGO_PASS +
  "@cluster0-qjfez.mongodb.net/geneology?retryWrites=true&w=majority";
const connection = mongoose.connection;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

// Choose the port and start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "client/build")));

// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

//Get people
routes.route("/read/person").get(function (req, res) {
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

routes.route("/read/family").get(function (req, res) {
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

//Get a family (read in json data)
routes.route("/read/person/:id").get(function (req, res) {
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
routes.route("/read/family/:id").get(function (req, res) {
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

//Update a family
routes.route("/edit/family/:id").post(async function (req, res) {
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
          family.parentA = parentA._id;
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
routes.route("/edit/person/:id").post(function (req, res) {
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

//Remove a person
routes.route("/delete/person").post(function (req, res) {
  console.log("Removing person", req.body);

  Person.deleteOne({ _id: req.body.id }, function (err) {
    if (err) return handleError(err);
    // deleted at most one tank document
    else res.status(200).json("The person was deleted.");
  });
});

//Remove a family
routes.route("/delete/family").post(function (req, res) {
  console.log("Removing family", req.body);

  Family.deleteOne({ _id: req.body.id }, function (err) {
    if (err) return handleError(err);
    // deleted at most one tank document
    else res.status(200).json("The family was deleted.");
  });
});

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
