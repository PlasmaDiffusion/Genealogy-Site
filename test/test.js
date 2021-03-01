var assert = require("assert");
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://admin:" +
  process.env.MONGO_PASS +
  "@cluster0-qjfez.mongodb.net/geneology?retryWrites=true&w=majority";

before(function () {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});
after(function () {
  console.log("Connection closed");
  mongoose.disconnect();
});

//testRoutes.js will do the rest
