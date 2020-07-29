const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Person = new Schema({
  name: String,
  //Extra information
  description: String,
  birthdate: Date,
  deathdate: Date,

  //Every person can create a family
  startedFamilies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Family" }],
});

let Family = new Schema({
  name: String,
  description: String,

  //People within the family have two parents and x number of children
  parentA: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
  parentB: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
});

module.exports = {
  family: mongoose.model("Family", Family),
  person: mongoose.model("Person", Person),
};
