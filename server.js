const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 4000;
const routes = express.Router();
const path = require("path");
const { findPeople, findFamilies } = require("./serverFunctions");

var Family = require("./family.js").family;
exports.Family = Family;
var Person = require("./family.js").person;
exports.Person = Person;
var FamilyGroup = require("./family.js").FamilyGroup;
exports.FamilyGroup = FamilyGroup;

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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

exports.routes = routes;

app.use(cors());
app.use(bodyParser.json());
app.use("/", require("./routes/create"));
app.use("/", require("./routes/read"));
app.use("/", require("./routes/update"));
app.use("/", require("./routes/delete"));

// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
