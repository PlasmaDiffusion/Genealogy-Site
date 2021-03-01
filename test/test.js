var assert = require("assert");
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://admin:" +
  process.env.MONGO_PASS +
  "@cluster0-qjfez.mongodb.net/geneology?retryWrites=true&w=majority";
const connection = mongoose.connection;

before(function () {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});
after(async function () {
  console.log("Connection closed");
  await connection.close();
});

//testRoutes.js will do the rest
