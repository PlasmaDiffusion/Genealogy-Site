const { doesNotMatch } = require("assert");
var assert = require("assert");

const mongoose = require("mongoose");

var tests = 0;

// Will run after every test in every file
afterEach(function () {
  tests++;
  if (tests >= 4) {
    mongoose.disconnect();
    console.log("Sequlize connection closed");
  }
});

/*after(async function () {
  mongoose.disconnect();
  console.log("Connection closed");
});*/

//testRoutes.js will do the rest
