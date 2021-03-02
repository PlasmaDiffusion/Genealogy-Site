var assert = require("assert");

const mongoose = require("mongoose");

after(async function () {
  mongoose.disconnect();
  console.log("Connection closed");
});

//testRoutes.js will do the rest
