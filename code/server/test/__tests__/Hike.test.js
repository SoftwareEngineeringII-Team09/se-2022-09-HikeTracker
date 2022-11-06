const PersistentManager = require("../../dao/PersistentManager");
const HikeManager = require("../../controllers/HikeManager");
const { clearAll } = require("../utils");

describe("Test", () => {

  /* Test Setup */
  beforeAll(clearAll);
  /* Test Teardown */
  afterAll(clearAll);

  test("Example", async () => {
    expect(true).toEqual(true);
  });

});
