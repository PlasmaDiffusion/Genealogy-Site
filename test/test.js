var assert = require("assert");

const { connection } = require("../server");

after(function () {
  connection.close();
  console.log("Connection closed");
});

//testRoutes.js will do the rest
