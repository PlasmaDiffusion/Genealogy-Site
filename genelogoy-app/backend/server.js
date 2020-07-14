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

routes.route("/add/family").post(function (req, res) {
  console.log(req.body);

  //Test info
  /*const parentA = new Person({
    name: "Test Name",

    description: "Some desc",
    birthdate: new Date("December 17, 1995 03:24:00"),
    deathdate: new Date("December 19, 2012 03:24:00"),
  });

  const parentB = new Person({
    name: "Test NameB",

    description: "Some other desc",
    birthdate: new Date("December 17, 1985 03:24:00"),
    deathdate: new Date("September 17, 1995 03:24:00"),
  });

  const children = [];
  children.push(
    new Person({
      name: "Test Child",
      //Extra information
      description: "Dead from the coronavirus",
      birthdate: new Date("December 17, 2000 03:24:00"),
      deathdate: new Date("September 17, 2020 03:24:00"),
    })
  );

  let family = new Family({
    parentA: parentA,
    parentB: parentB,
    children: children,
  });*/

  //let family = new Family(req.body);
  res.status(200);
  /*

  
  family
    .save()
    .then((family) => {
      res.status(200).json({ family: "family added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new family failed");
    });*/
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
