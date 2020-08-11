const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Person = new Schema({
  name: String,
  //Extra information
  description: String,
  birthdate: Date,
  birthdateYearOnly: Boolean,
  deathdate: Date,
  deathdateYearOnly: Boolean,
  birthLocation: String,
  deathLocation: String,

  //Every person can create a family
  startedFamilies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Family" }],
});

let Family = new Schema({
  name: String,
  description: String,
  marriageDate: Date,
  marriageDateYearOnly: Boolean,
  marriageLocation: String,

  //If this is a "sub family", people can access it after clicking on a root family.
  subFamily: Boolean,
  rootFamily: { type: mongoose.Schema.Types.ObjectId, ref: "Family" },

  //People within the family have two parents and x number of children
  parentA: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
  parentB: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
});

module.exports = {
  family: mongoose.model("Family", Family),
  person: mongoose.model("Person", Person),
};
