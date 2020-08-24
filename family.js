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

  //If this is a "sub family", people can access it only after clicking on a main family.
  subFamily: Boolean,

  //People within the family have two parents and x number of children
  parentA: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
  parentB: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
});

//Have a root family name that appears on the home page. One clicked, it shows all other families with that name
let FamilyGroup = new Schema({
  names: [String],
  linkOrder: [Number],
});

module.exports = {
  family: mongoose.model("Family", Family),
  person: mongoose.model("Person", Person),
  FamilyGroup: mongoose.model("FamilyGroup", FamilyGroup),
};
