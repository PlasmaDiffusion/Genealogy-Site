const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 4000;
const routes = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use("/", routes);

var ObjectID = require("mongodb").ObjectID;
var Family = require("./family.js").family;
var Person = require("./family.js").person;

const uri =
  "mongodb+srv://admin:" +
  process.env.MONGO_PASS +
  "@cluster0-qjfez.mongodb.net/geneology?retryWrites=true&w=majority";
const connection = mongoose.connection;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});

async function findPeople(req, parentA, parentB, children) {
  await Person.findOne({ name: req.body.parentA }, function (err, person) {
    if (err) return handleError(err);
    parentA = person;
    console.log("ParentA found ", person);
  });

  //Find the second parent
  await Person.findOne({ name: req.body.parentB }, function (err, person) {
    if (err) return handleError(err);
    parentB = person;
    console.log("ParentB found ", person);
  });

  let childrenToFind = req.body.children;

  //Find the children parent
  for (let i = 0; i < childrenToFind.length; i++) {
    await Person.findOne({ name: childrenToFind[i] }, function (err, person) {
      if (err) return handleError(err);
      if (person == null) return "Failed to find " + req.body.children[i];
      children.push(person);
      console.log("Child found ", person);
    });
  }
  return { parentA, parentB };
}

routes.route("/read/person").get(function (req, res) {
  Person.find(function (err, persons) {
    if (err) {
      console.log(err);
    } else {
      res.json(persons);
    }
  });
});

routes.route("/read/family").get(function (req, res) {
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
  console.log(req.params.id);

  Person.findById(req.params.id, function (err, persons) {
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
    .populate("children")
    .exec(function (err, family) {
      if (err) {
        console.log(err);
      } else {
        res.json(family);
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
          family.parentA = parentA._id;
          family.parentB = parentB._id;
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

  Person.findById(req.params.id, function (err, person) {
    if (!person) res.status(404).send("data is not found");
    else {
      person.name = req.body.name;
      person.description = req.body.description;
      person.birthdate = req.body.deathdate;
      person.deathdate = req.body.birthdate;

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
      res.status(200).json("Family added successfully.");
    })
    .catch((err) => {
      res.status(400).send("adding new family failed");
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
      parentA: parentA._id,
      parentB: parentB._id,
      children: children,
    });

    family
      .save()
      .then((family) => {
        console.log("Added", family);
        res.status(200).json("Family added successfully.");
      })
      .catch((err) => {
        res.status(400).send("adding new family failed");
      });
  }
});
