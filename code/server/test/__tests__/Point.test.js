const PersistentManager = require("../../dao/PersistentManager");
const Point = require("../../dao/model/Point");
const User = require("../../dao/model/User");
const Utils = require("../unit-utils");

/* Some useful data to use for tests */
const testUser = new User(1, "test@email.it", "testSalt", "testPassword", null, "testFirstname", "testLastname", "390123456789", "testRole", 1);
const testPoint1 = new Point(1, "parking lot", 1, 0, null, 10.0, 10.0);
const testPoint2 = new Point(2, "parking lot", 1, 0, null, 20.0, 20.0);
const testPoint3 = new Point(3, "parking lot", 1, 0, null, 30.0, 30.0);
const testPoints = [testPoint1, testPoint2, testPoint3];
const notExistingPoint = testPoint1.pointId + testPoint2.pointId + testPoint3.pointId;

/*****************************************************************************************************
*              storePoint()
*****************************************************************************************************/
describe("Test storePoint", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testStorePoint("store the point successufully", testPoint1);
})


/*****************************************************************************************************
*              existsPoint()
*****************************************************************************************************/
describe("Test existsPoint", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
    await Promise.all([
			PersistentManager.store(Point.tableName, testPoint1),
			PersistentManager.store(Point.tableName, testPoint2),
			PersistentManager.store(Point.tableName, testPoint3)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testExistsPoint("return true", "pointId", testPoint1.pointId, true);
	Utils.testExistsPoint("return false", "pointId", notExistingPoint, false);
})


/*****************************************************************************************************
*              loadOneByAttributePoint()
*****************************************************************************************************/
describe("Test loadOneByAttributePoint", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
    await Promise.all([
			PersistentManager.store(Point.tableName, testPoint1),
			PersistentManager.store(Point.tableName, testPoint2),
			PersistentManager.store(Point.tableName, testPoint3)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testLoadOneByAttributePoint("load a point by attribute", "pointId", testPoint1.pointId);
	Utils.testLoadOneByAttributePoint("reject because of non existing point", "pointId", notExistingPoint, 404);
})