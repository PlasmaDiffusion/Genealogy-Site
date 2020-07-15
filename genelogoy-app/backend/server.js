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

let Family = require("./family.js").family;
let Person = require("./family.js").person;

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
  Family.find(function (err, families) {
    if (err) {
      console.log(err);
    } else {
      res.json(families);
    }
  });
});

routes.route("/update/:id").post(function (req, res) {
  Family.findById(req.params.id, function (err, family) {
    if (!family) res.status(404).send("data is not found");
    else family.parentA = req.body.parentA;
    family.parentB = req.body.parentB;
    family.children = req.body.children;
    family
      .save()
      .then((family) => {
        res.json("family updated!");
      })
      .catch((err) => {
        res.status(400).send("Update not possible");
      });
  });
});

routes.route("/add/family").post(async function (req, res) {
  console.log("Body", req.body);

  //Declare variables to find
  var parentA = "";
  var parentB = "";
  var children = [];
  try {
    //Find the first parent
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
  } catch (e) {
    console.log(e);
  } finally {
    console.log("Family Name", req.body.name);

    //Now save the family if everything was found
    let family = new Family({
      name: req.body.name,
      description: req.body.description,
      parentA: parentA,
      parentB: parentB,
      children: children,
    });

    family
      .save()
      .then((family) => {
        console.log("Added", family);
        res.status(200).json({ family: "family added successfully" });
      })
      .catch((err) => {
        res.status(400).send("adding new family failed");
      });
  }
});

routes.route("/add/person").post(function (req, res) {
  console.log(req.body);

  let person = new Person(req.body);

  person
    .save()
    .then((person) => {
      res.status(200).json({ person: "family added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new family failed");
    });
});
