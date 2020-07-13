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

let Family = require("./family.js");

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

routes.route("/read").get(function (req, res) {
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

routes.route("/add").post(function (req, res) {
  console.log(req.body);

  let family = new Family(req.body);

  family
    .save()
    .then((family) => {
      res.status(200).json({ family: "family added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new family failed");
    });
});
