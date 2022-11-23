const PersistentManager = require("../../dao/PersistentManager");
const HikeManager = require("../../controllers/HikeManager");
const Point = require("../../dao/model/Point");
const Hike = require("../../dao/model/Hike");
const User = require("../../dao/model/User");
const Utils = require("../unit-utils");

/* Some useful data to use for tests */
const testGpx = "rocciamelone.gpx";
const testUser = { userId: 1, email: "test@email.it", salt: "testSalt", password: "testPassword", firstname: "testFirstname", lastname: "testLastname", mobile: "390123456789", role: "testRole", active: 0 };
const testStartPoint1 = new Point(1, "start point", 0, 0, "Start point of testHike1", 10.0, 10.0, 10.0);
const testEndPoint1 = new Point(2, "end point", 0, 0, "End point of testHike1", 20.0, 20.0, 20.0);
const testStartPoint2 = new Point(3, "start point", 0, 0, "Start point of testHike2", 30.0, 30.0, 30.0);
const testEndPoint2 = new Point(4, "end point", 0, 0, "End point of testHike2", 40.0, 40.0, 40.0);
const testStartPoint3 = new Point(5, "start point", 0, 0, "Start point of testHike3", 50.0, 50.0, 50.0);
const testEndPoint3 = new Point(6, "end point", 0, 0, "End point of testHike3", 60.0, 60.0, 60.0);
const testHike1 = new Hike(1, "testTitle1", testUser.userId, `gpx/${testGpx}`, 1, 1, 1, 10.0, "01:01", 10.0, 10.0, "testDifficulty1", "testDescription1", testStartPoint1.pointId, testEndPoint1.pointId);
const testHike2 = new Hike(2, "testTitle2", testUser.userId, `gpx/${testGpx}`, 2, 2, 2, 20.0, "02:02", 20.0, 20.0, "testDifficulty2", "testDescription2", testStartPoint2.pointId, testEndPoint2.pointId);
const testHike3 = new Hike(3, "testTitle3", testUser.userId, `gpx/${testGpx}`, 3, 3, 3, 30.0, "03:03", 30.0, 30.0, "testDifficulty3", "testDescription3", testStartPoint3.pointId, testEndPoint3.pointId);
const testHikes = [testHike1, testHike2, testHike3];
const notExistingHike = testHike1.hikeId + testHike2.hikeId + testHike3.hikeId;
const notExistingPoint = testStartPoint1.pointId + testStartPoint2.pointId + testStartPoint3.pointId + testEndPoint1.pointId + testEndPoint2.pointId + testEndPoint3.pointId;
const notExistingUser = testUser.userId + 1;
const expectedGetAllHikesProperties = ["hikeId", "title", "writer", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint"];
const expectedGetHikeByIdProperties = ["hikeId", "title", "writer", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint", "referencePoints", "track"];


/*****************************************************************************************************
*              storeHike()
*****************************************************************************************************/
describe("Test storeHike", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testStoreHike("store the hike", testHike1);
	Utils.testStoreHike("reject because of not existing startPoint foreign key", { ...testHike1, startPoint: notExistingPoint }, 404);
	Utils.testStoreHike("reject because of not existing endPoint foreign key", { ...testHike1, endPoint: notExistingPoint }, 404);
	Utils.testStoreHike("reject because of not existing writerId foreign key", { ...testHike1, writerId: notExistingUser }, 404)
})


/*****************************************************************************************************
*              updateHike()
*****************************************************************************************************/
describe("Test updateHike", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
			PersistentManager.store(Point.tableName, testStartPoint3),
			PersistentManager.store(Point.tableName, testEndPoint3)
		]);
		await Promise.all([
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2),
			PersistentManager.store(Hike.tableName, testHike3)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testUpdateHike("update the hike", { ...testHike1, title: "updatedTitle" }, "hikeId", testHike1.hikeId);
	Utils.testUpdateHike("reject because of not existing hike with attributeName = value", { ...testHike1, title: "updatedTitle" }, "hikeId", notExistingHike, 404)
	Utils.testUpdateHike("reject because of not existing writerId foreign key", { ...testHike1, writerId: notExistingUser }, "hikeId", testHike1.hikeId, 404);
	Utils.testUpdateHike("reject because of not existing startPoint foreign key", { ...testHike1, startPoint: notExistingPoint }, "hikeId", testHike1.hikeId, 404);
	Utils.testUpdateHike("reject because of not existing endPoint foreign key", { ...testHike1, endPoint: notExistingPoint }, "hikeId", testHike1.hikeId, 404);
})


/*****************************************************************************************************
*              deleteHike()
*****************************************************************************************************/
describe("Test deleteHike", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
			PersistentManager.store(Point.tableName, testStartPoint3),
			PersistentManager.store(Point.tableName, testEndPoint3)
		]);
		await Promise.all([
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2),
			PersistentManager.store(Hike.tableName, testHike3)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testDeleteHike("delete the hikes with attributeName = value", "hikeId", testHike1.hikeId);
})


/*****************************************************************************************************
*              deleteAllHike()
*****************************************************************************************************/
describe("Test deleteAllHike", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
			PersistentManager.store(Point.tableName, testStartPoint3),
			PersistentManager.store(Point.tableName, testEndPoint3)
		]);
		await Promise.all([
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2),
			PersistentManager.store(Hike.tableName, testHike3)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testDeleteAllHike("delete all hikes");
})


/*****************************************************************************************************
*              loadAllHike()
*****************************************************************************************************/
describe("Test loadAllHike", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
			PersistentManager.store(Point.tableName, testStartPoint3),
			PersistentManager.store(Point.tableName, testEndPoint3)
		]);
		await Promise.all([
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2),
			PersistentManager.store(Hike.tableName, testHike3)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testLoadAllHike("load all hikes", testHikes.length);
})


/*****************************************************************************************************
*              existsHike()
*****************************************************************************************************/
describe("Test existsHike", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
			PersistentManager.store(Point.tableName, testStartPoint3),
			PersistentManager.store(Point.tableName, testEndPoint3)
		]);
		await Promise.all([
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2),
			PersistentManager.store(Hike.tableName, testHike3)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testExistsHike("return true", "hikeId", testHike1.hikeId, true);
	Utils.testExistsHike("return false", "hikeId", notExistingHike, false);
})


/*****************************************************************************************************
*              loadOneByAttributeHike()
*****************************************************************************************************/
describe("Test loadOneByAttributeHike", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
			PersistentManager.store(Point.tableName, testStartPoint3),
			PersistentManager.store(Point.tableName, testEndPoint3)
		]);
		await Promise.all([
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2),
			PersistentManager.store(Hike.tableName, testHike3)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testLoadOneByAttributeHike("load a hike by attribute", "hikeId", testHike1.hikeId);
	Utils.testLoadOneByAttributeHike("return 404 for non existing hike", "hikeId", notExistingHike, 404);
})


/*****************************************************************************************************
*              loadAllByAttributeHike()
*****************************************************************************************************/
describe("Test loadAllByAttributeHike", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
			PersistentManager.store(Point.tableName, testStartPoint3),
			PersistentManager.store(Point.tableName, testEndPoint3)
		]);
		await Promise.all([
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2),
			PersistentManager.store(Hike.tableName, testHike3)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testLoadAllByAttributeHike("load all hikes by attribute", "writerId", testUser.userId);
})


/*****************************************************************************************************
*              defineHike()
*****************************************************************************************************/
// describe("Test defineHike", () => {
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
*              getAllHikes()
*****************************************************************************************************/
describe("Test getAllHikes", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
			PersistentManager.store(Point.tableName, testStartPoint3),
			PersistentManager.store(Point.tableName, testEndPoint3)
		]);
		await Promise.all([
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2),
			PersistentManager.store(Hike.tableName, testHike3)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testGetAllHikes("get all hikes", testHikes.length, expectedGetAllHikesProperties);
})


/*****************************************************************************************************
*              getHikeById()
*****************************************************************************************************/
describe("Test getHikeById", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
			PersistentManager.store(Point.tableName, testStartPoint3),
			PersistentManager.store(Point.tableName, testEndPoint3)
		]);
		await Promise.all([
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2),
			PersistentManager.store(Hike.tableName, testHike3)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testGetHikeByHikeId("get a hike by hikeId", testHike1.hikeId, expectedGetHikeByIdProperties, undefined);
	Utils.testGetHikeByHikeId("return 404 because of not existing hike with hikeId = hikeId", notExistingHike, undefined, 404);
})


/*****************************************************************************************************
*              getGpxPath()
*****************************************************************************************************/
describe("Test getGpxPath", () => {
	/* Test Setup */
	beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
			PersistentManager.store(Point.tableName, testStartPoint3),
			PersistentManager.store(Point.tableName, testEndPoint3)
		]);
		await Promise.all([
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2),
			PersistentManager.store(Hike.tableName, testHike3)
		]);
	});

	/* Test Teardown */
	afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.testGetGpxPath("get a gpx path by hikeId", testHike1.hikeId, testHike1.trackPath, undefined);
	Utils.testGetGpxPath("return 404 because of not existing hike with hikeId = hikeId", notExistingHike, undefined, 404);
})

