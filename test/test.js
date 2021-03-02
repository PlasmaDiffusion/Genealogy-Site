const { doesNotMatch } = require("assert");
var assert = require("assert");

const mongoose = require("mongoose");

//Data to connect to the database
const uri =
  "mongodb+srv://admin:" +
  process.env.MONGO_PASS +
  "@cluster0-qjfez.mongodb.net/geneology?retryWrites=true&w=majority";

beforeEach(async () => {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  await mongoose.connection.close();
});

after(async function () {
  mongoose.disconnect();
  console.log("Connection closed");
});

//testRoutes.js will do the rest
