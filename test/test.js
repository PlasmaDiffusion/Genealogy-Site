const { doesNotMatch } = require("assert");
var assert = require("assert");

const mongoose = require("mongoose");

var tests = 0;

after(async function () {
  mongoose.disconnect();
  console.log("Connection closed");
});

//testRoutes.js will do the rest
