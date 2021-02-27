var assert = require("assert");

var tests = 0;

// Will run after every test in every file
afterEach(function () {
  tests++;
  if (tests >= 8) {
    //sequelize.close();
    console.log("Sequlize connection closed");
  }
});

//ShopItem read testing -----------------------------------------------------------------------------------
describe("The shopItem model object using find", function () {
  it("should not be null with id 1", async function () {
    //const shopItem = await models.shopItem.findByPk(1);
    //assert.notStrictEqual("undefined", shopItem);
  });
});
