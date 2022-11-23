const PersistentManager = require("../../dao/PersistentManager");
const Point = require("../../dao/model/Point");
const ParkingLot = require("../../dao/model/ParkingLot");
const User = require("../../dao/model/User");
const Utils = require("../unit-utils");

/* Some useful data to use for tests */
const testUser = { userId: 1, email: "test@email.it", salt: "testSalt", password: "testPassword", firstname: "testFirstname", lastname: "testLastname", mobile: "390123456789", role: "testRole", active: 0 };
const testParkingLotPoint1 = new Point(1, "parking lot", 1, 0, null, 10.0, 10.0, 10.0);
const testParkingLotPoint2 = new Point(2, "parking lot", 1, 0, null, 20.0, 20.0, 20.0);
const testParkingLotPoint3 = new Point(3, "parking lot", 1, 0, null, 30.0, 30.0, 30.0);
const testParkingLot1 = new ParkingLot(1, "testName1", testParkingLotPoint1.pointId, testUser.userId);
const testParkingLot2 = new ParkingLot(2, "testName2", testParkingLotPoint2.pointId, testUser.userId);
const testParkingLot3 = new ParkingLot(3, "testName3", testParkingLotPoint3.pointId, testUser.userId);
const testParkingLots = [testParkingLot1, testParkingLot2, testParkingLot3];
const notExistingParkingLot = testParkingLot1.parkingLotId + testParkingLot2.parkingLotId + testParkingLot3.parkingLotId; 
const notExistingPoint = testParkingLotPoint1.pointId + testParkingLotPoint2.pointId + testParkingLotPoint3.pointId;
const notExistingUser = testUser.userId + 1;

/*****************************************************************************************************
*              storeParkingLot()
*****************************************************************************************************/
describe("Test storeParkingLot", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await PersistentManager.store(Point.tableName, testParkingLotPoint1);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testStoreParkingLot("store the parking lot", testParkingLot1);
	Utils.testStoreParkingLot("reject because of not existing pointId foreign key", { ...testParkingLot1, pointId: notExistingPoint }, 404);
	Utils.testStoreParkingLot("reject because of not existing writerId foreign key", { ...testParkingLot1, writerId: notExistingUser }, 404)
})


/*****************************************************************************************************
*              existsParkingLot()
*****************************************************************************************************/
describe("Test existsParkingLot", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testParkingLotPoint1),
			PersistentManager.store(Point.tableName, testParkingLotPoint2),
			PersistentManager.store(Point.tableName, testParkingLotPoint3)
		]);
		await Promise.all([
			PersistentManager.store(ParkingLot.tableName, testParkingLot1),
			PersistentManager.store(ParkingLot.tableName, testParkingLot2),
			PersistentManager.store(ParkingLot.tableName, testParkingLot3)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testExistsParkingLot("return true", "parkingLotId", testParkingLot1.parkingLotId, true);
	Utils.testExistsParkingLot("return false", "parkingLotId", notExistingParkingLot, false);
})


/*****************************************************************************************************
*              loadOneByAttributeParkingLot()
*****************************************************************************************************/
describe("Test loadOneByAttributeParkingLot", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testParkingLotPoint1),
			PersistentManager.store(Point.tableName, testParkingLotPoint2),
			PersistentManager.store(Point.tableName, testParkingLotPoint3)
		]);
		await Promise.all([
			PersistentManager.store(ParkingLot.tableName, testParkingLot1),
			PersistentManager.store(ParkingLot.tableName, testParkingLot2),
			PersistentManager.store(ParkingLot.tableName, testParkingLot3)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testLoadOneByAttributeParkingLot("load a parking lot by attribute", "parkingLotId", testParkingLot1.parkingLotId);
	Utils.testLoadOneByAttributeParkingLot("return 404 for non existing parking lot", "parkingLotId", notExistingParkingLot, 404);
})


/*****************************************************************************************************
*              defineParkingLot()
*****************************************************************************************************/
describe("Test defineParkingLot", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testDefineParkingLot("define a parking lot", testUser.userId, testParkingLot1.parkingLotName, testParkingLotPoint1.latitude, testParkingLotPoint1.longitude, testParkingLotPoint1.altitude);
	Utils.testDefineParkingLot("return 404 because of not existing writerId foreign key", notExistingUser, testParkingLot1.parkingLotName, testParkingLotPoint1.latitude, testParkingLotPoint1.longitude, testParkingLotPoint1.altitude, 404);
})
