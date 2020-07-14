const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Person = new Schema({
  name: String,
  //Extra information
  description: String,
  birthdate: Date,
  deathdate: Date,
  //References to parents
  //parentA_id: Number,
  //parentB_id: Number,
});

let Family = new Schema({
  name: String,
  description: String,

  //People within the family have two parents and x number of children
  parentA: Person,
  parentB: Person,
  children: [Person],
});

module.exports = {
  family: mongoose.model("Family", Family),
  person: mongoose.model("Person", Person),
};
