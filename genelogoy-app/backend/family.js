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
  parentA: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
  parentB: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
});

module.exports = {
  family: mongoose.model("Family", Family),
  person: mongoose.model("Person", Person),
};
