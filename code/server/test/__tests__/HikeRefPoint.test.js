const PersistentManager = require("../../dao/PersistentManager");
const HikeRefPoint = require("../../dao/model/HikeRefPoint");
const Hike = require("../../dao/model/Hike");
const Point = require("../../dao/model/Point");
const User = require("../../dao/model/User");
const Utils = require("../unit-utils");

/* Some useful data to use for tests */
const testGpx = "rocciamelone.gpx";
const testUser = new User(1, "test@email.it", "testSalt", "testPassword", null, "testFirstname", "testLastname", "390123456789", "testRole", 1);
const testRefPoint1 = new Point(1, "reference point", 0, 0, "testRefPointName1", 10.0, 10.0);
const testRefPoint2 = new Point(2, "reference point", 0, 0, "testRefPointName2", 20.0, 20.0);
const testRefPoint3 = new Point(3, "reference point", 0, 0, "testRefPointName3", 30.0, 30.0);
const testRefPoint4 = new Point(4, "reference point", 0, 0, "testRefPointName4", 40.0, 40.0);
const testStartPoint1 = new Point(5, "start point", 0, 0, "Start point of testHike1", 50.0, 50.0);
const testEndPoint1 = new Point(6, "end point", 0, 0, "End point of testHike1", 60.0, 60.0);
const testStartPoint2 = new Point(7, "start point", 0, 0, "Start point of testHike2", 70.0, 70.0);
const testEndPoint2 = new Point(8, "end point", 0, 0, "End point of testHike2", 80.0, 80.0);
const testHike1 = new Hike(1, "testTitle1", testUser.userId, `gpx/${testGpx}`, 1, 1, 1, 10.0, "01:01", 10.0, 10.0, "testDifficulty1", "testDescription1", testStartPoint1.pointId, testEndPoint1.pointId);
const testHike2 = new Hike(2, "testTitle2", testUser.userId, `gpx/${testGpx}`, 2, 2, 2, 20.0, "02:02", 20.0, 20.0, "testDifficulty2", "testDescription2", testStartPoint2.pointId, testEndPoint2.pointId);
const testHikeRefPoint1 = new HikeRefPoint(testHike1.hikeId, testRefPoint1.pointId);
const testHikeRefPoint2 = new HikeRefPoint(testHike1.hikeId, testRefPoint2.pointId);
const testHikeRefPoint3 = new HikeRefPoint(testHike2.hikeId, testRefPoint3.pointId);
const testHikeRefPoint4 = new HikeRefPoint(testHike2.hikeId, testRefPoint4.pointId);
const testHikeRefPoints = [testHikeRefPoint1, testHikeRefPoint2, testHikeRefPoint3, testHikeRefPoint4];
const notExistingHikeRefPoint = { hikeId: testHike1.hikeId + testHike2.hikeId, pointId: testRefPoint1.pointId + testRefPoint2.pointId + testRefPoint3.pointId + testRefPoint4.pointId };

/*****************************************************************************************************
*              storeHikeRefPoint()
*****************************************************************************************************/
describe("Test storeHikeRefPoint", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
      PersistentManager.store(Point.tableName, testRefPoint1),
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1)
		]);
		await PersistentManager.store(Hike.tableName, testHike1);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testStoreHikeRefPoint("store the hikeRefPoint", testHikeRefPoint1);
	Utils.testStoreHikeRefPoint("reject because of not existing hikeId foreign key", { ...testHikeRefPoint1, hikeId: notExistingHikeRefPoint.hikeId }, 404);
	Utils.testStoreHikeRefPoint("reject because of not existing pointId foreign key", { ...testHikeRefPoint1, pointId: notExistingHikeRefPoint.pointId }, 404);
})


/*****************************************************************************************************
*              existsHikeRefPoint()
*****************************************************************************************************/
describe("Test existsHikeRefPoint", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testRefPoint1),
			PersistentManager.store(Point.tableName, testRefPoint2),
			PersistentManager.store(Point.tableName, testRefPoint3),
			PersistentManager.store(Point.tableName, testRefPoint4),
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2)
		]);
		await Promise.all([
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2)
		]);
    await Promise.all([
      PersistentManager.store(HikeRefPoint.tableName, testHikeRefPoint1),
      PersistentManager.store(HikeRefPoint.tableName, testHikeRefPoint2),
      PersistentManager.store(HikeRefPoint.tableName, testHikeRefPoint3),
      PersistentManager.store(HikeRefPoint.tableName, testHikeRefPoint4)
    ]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testExistsHikeRefPoint("return true", "hikeId", testHikeRefPoint1.hikeId, true);
	Utils.testExistsHikeRefPoint("return true", "pointId", testHikeRefPoint1.pointId, true);
	Utils.testExistsHikeRefPoint("return false", "hikeId", notExistingHikeRefPoint.hikeId, false);
	Utils.testExistsHikeRefPoint("return false", "pointId", notExistingHikeRefPoint.pointId, false);
})


/*****************************************************************************************************
*              loadAllByAttributeHikeRefPoint()
*****************************************************************************************************/
describe("Test loadAllByAttributeHikeRefPoint", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
      PersistentManager.store(Point.tableName, testRefPoint1),
			PersistentManager.store(Point.tableName, testRefPoint2),
			PersistentManager.store(Point.tableName, testRefPoint3),
			PersistentManager.store(Point.tableName, testRefPoint4),
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2)
		]);
		await Promise.all([
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2)
		]);
    await Promise.all([
      PersistentManager.store(HikeRefPoint.tableName, testHikeRefPoint1),
      PersistentManager.store(HikeRefPoint.tableName, testHikeRefPoint2),
      PersistentManager.store(HikeRefPoint.tableName, testHikeRefPoint3),
      PersistentManager.store(HikeRefPoint.tableName, testHikeRefPoint4)
    ]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testLoadAllByAttributeHikeRefPoint("load all hikeRefPoints by attribute", "hikeId", testHikeRefPoint1.hikeId);
	Utils.testLoadAllByAttributeHikeRefPoint("load all hikeRefPoints by attribute", "pointId", testHikeRefPoint1.pointId);
})