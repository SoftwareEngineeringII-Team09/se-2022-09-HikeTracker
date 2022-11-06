const PersistentManager = require("../../dao/PersistentManager");
const ParkingLotManager = require("../../controllers/ParkingLotManager");
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
