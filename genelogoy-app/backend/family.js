const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Person = new Schema({
  name: {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
  },
});

let Family = new Schema({
  parentA: { type: String },
  parentB: { type: String },

  //children: [Person],
});

module.exports = mongoose.model("Family", Family);
