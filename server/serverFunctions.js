var Family = require("./family.js").family;
var Person = require("./family.js").person;

//Find people in the database by name and birthdate
async function findPeople(req, parentA, parentB, children) {
  await Person.findOne(
    { name: req.body.parentA, birthdate: req.body.parentA_Birthdate },
    function (err, person) {
      if (err) return handleError(err);
      parentA = person;
      console.log("ParentA found ", person);
    }
  );

  //Find the second parent
  await Person.findOne(
    { name: req.body.parentB, birthdate: req.body.parentB_Birthdate },
    function (err, person) {
      if (err) return handleError(err);
      parentB = person;
      console.log("ParentB found ", person);
    }
  );

  let childrenToFind = req.body.children;
  let childrenBirthdates = req.body.children_Birthdates;

  console.log("Children trying to find:", childrenToFind);

  //Find the children parent
  for (let i = 0; i < childrenToFind.length; i++) {
    await Person.findOne(
      { name: childrenToFind[i], birthdate: childrenBirthdates[i] },
      function (err, person) {
        if (err) return handleError(err);
        if (person == null) return "Failed to find " + req.body.children[i];
        children.push(person);
        console.log("Child found ", person);
      }
    );
  }
  return { parentA, parentB };
}
exports.findPeople = findPeople;

async function findFamilies(req) {
  let familiesToFind = req.body.startedFamilies;

  let startedFamilies = [];

  //Find some families
  for (let i = 0; i < familiesToFind.length; i++) {
    await Family.findOne({ name: familiesToFind[i] }, function (err, family) {
      if (err) return handleError(err);
      if (family == null) return "Failed to find " + familiesToFind[i].name;
      startedFamilies.push(family);
    });
  }
  console.log("Found these families", startedFamilies);
  return startedFamilies;
}
exports.findFamilies = findFamilies;
