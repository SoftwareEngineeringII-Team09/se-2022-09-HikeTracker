const PersistentManager = require("../../dao/PersistentManager");
const ParkingLotManager = require("../../controllers/UserManager");
const Utils = require("../unit-utils");

describe("Test", () => {
  /* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

  test("Example", async () => {
    expect(true).toEqual(true);
  });

});