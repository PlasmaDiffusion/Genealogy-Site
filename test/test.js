var assert = require("assert");
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://admin:" +
  process.env.MONGO_PASS +
  "@cluster0-qjfez.mongodb.net/geneology?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

after(function () {
  mongoose.disconnect();
  console.log("Connection closed");
});

//testRoutes.js will do the rest
