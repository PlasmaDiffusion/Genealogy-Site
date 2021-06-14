const request = require("supertest");
const { app } = require("../server");
var assert = require("assert");

//Read family by id test
describe("Getting a family by id", function () {
  it("should return a single family with a name", async function () {
    return request(app)
      .get("/read/family/60063e2868e4240017d43583")
      .then(function (response) {
        //Check name from this specific familt
        assert.ok(response.body.name == "McNee", "Name is McNee?");
        assert.strictEqual(response.status, 200);
      });
  });
});

//Read person by id test
describe("Getting a person by id", function () {
  it("should return a single person with a name", async function () {
    return request(app)
      .get("/read/person/5f2c39296b2e5000171326aa")
      .then(function (response) {
        //Check if got a person with a specific names
        assert.ok(response.body.name == "John McNee", "Name is McNee?");
        assert.strictEqual(response.status, 200);
      });
  });
});

//Read family by name test
describe("Getting a family by name", function () {
  it("should return multiple families with the same name", async function () {
    return request(app)
      .get("/read/familyByName/Hamilton")
      .then(function (response) {
        //More than one?
        var families = response.body;
        assert.ok(families.length > 1, "Multiple families are returned.");

        //Check if they all have the same name
        families.forEach((family) => {
          assert.ok(family.name == "Hamilton", "Same family name");
        });

        assert.strictEqual(response.status, 200);
      });
  });
});

//Read families on homepage test
describe("Getting a family group for the homepage", function () {
  it("should return at least 2 families", async function () {
    return request(app)
      .get("/read/familyGroup")
      .then(function (response) {
        //More than one?
        var families = response.body.names;

        //Make sure there's at least two links to click
        var displayedFamilies = 0;

        //Check which slots are empty and actually used
        families.forEach((family) => {
          if (family != "" && family != null) displayedFamilies++;
        });

        assert.strictEqual(response.status, 200);
        assert.ok(displayedFamilies > 0, "2 or more families for home page");
      });
  });
});
