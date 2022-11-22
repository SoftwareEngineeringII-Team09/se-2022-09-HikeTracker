const PersistentManager = require("../../dao/PersistentManager");
const HutManager = require("../../controllers/HikeManager");
const Point = require("../../dao/model/Point");
const User = require("../../dao/model/User");
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

/* Some useful data to use for tests */
// TODO: insert here useful data for tests

/*****************************************************************************************************
*              storeHut()
*****************************************************************************************************/
// describe("Test storeHut", () => {
// 	/* Test Setup */
// 	beforeAll(async () => {
// 		await Utils.clearAll();
// 		// TODO: insert here if you need other test teardown function calls
// 	});

// 	/* Test Teardown */
// 	afterAll(async () => {
// 		await Utils.clearAll();
// 		// TODO: insert here if you need other test teardown function calls		 
// 	});

// 	// TODO: insert here the functions calls to perform the tests. The function should be defined in unit-utils.js
// })


/*****************************************************************************************************
*              existsHut()
*****************************************************************************************************/
// describe("Test existsHut", () => {
// 	/* Test Setup */
// 	beforeAll(async () => {
// 		await Utils.clearAll();
// 		// TODO: insert here if you need other test teardown function calls
// 	});

// 	/* Test Teardown */
// 	afterAll(async () => {
// 		await Utils.clearAll();
// 		// TODO: insert here if you need other test teardown function calls		 
// 	});

// 	// TODO: insert here the functions calls to perform the tests. The function should be defined in unit-utils.js
// })


/*****************************************************************************************************
*              loadOneByAttributeHut()
*****************************************************************************************************/
// describe("Test loadOneByAttributeHut", () => {
// 	/* Test Setup */
// 	beforeAll(async () => {
// 		await Utils.clearAll();
// 		// TODO: insert here if you need other test teardown function calls
// 	});

// 	/* Test Teardown */
// 	afterAll(async () => {
// 		await Utils.clearAll();
// 		// TODO: insert here if you need other test teardown function calls		 
// 	});

// 	// TODO: insert here the functions calls to perform the tests. The function should be defined in unit-utils.js
// })


/*****************************************************************************************************
*              defineHut()
*****************************************************************************************************/
// describe("Test defineHut", () => {
// 	/* Test Setup */
// 	beforeAll(async () => {
// 		await Utils.clearAll();
// 		// TODO: insert here if you need other test teardown function calls
// 	});

// 	/* Test Teardown */
// 	afterAll(async () => {
// 		await Utils.clearAll();
// 		// TODO: insert here if you need other test teardown function calls		 
// 	});

// 	// TODO: insert here the functions calls to perform the tests. The function should be defined in unit-utils.js
// })