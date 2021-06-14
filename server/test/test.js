const { doesNotMatch } = require("assert");
var assert = require("assert");

const mongoose = require("mongoose");

//Make mongoose disconnect after all tests
after(function () {
  mongoose.disconnect();
  console.log("Connection closed");
});

//testRoutes.js will do the rest
