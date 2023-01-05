const chai = require("chai");
const chaiHttp = require("chai-http");
const SelectedHike = require("../dao/model/SelectedHike");
const Hike = require("../dao/model/Hike");
const Point = require("../dao/model/Point");
const User = require("../dao/model/User");
const PersistentManager = require("../dao/PersistentManager");
const Utils = require("./integration-utils");

chai.use(chaiHttp);
chai.should();
const app = require("../index");
const agent = chai.request.agent(app);


/* Some useful data to use for tests */
const testGpx = "test.gpx";
const testUser = new User(1, "test1@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", null, "testFristName", "testLastName", "390123456789", "Hiker", 1);
const notAuthorizedUser = new User(2, "test2@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", null, null, null, null, "Local Guide", 1);
const credentials = { username: testUser.email, password: "Password1234." };
const wrongCredentials = { username: testUser.email, password: "wrongPassword" };
const notAuthorizedCredentials = { username: notAuthorizedUser.email, password: "Password1234." };
const testStartPoint1 = new Point(1, "start point", 0, 0, "Start point of testHike1", 10.000, 10.000);
const testEndPoint1 = new Point(2, "end point", 0, 0, "End point of testHike1", 10.010, 10.010);
const testStartPoint2 = new Point(3, "start point", 0, 0, "Start point of testHike2", 30.0, 30.0);
const testEndPoint2 = new Point(4, "end point", 0, 0, "End point of testHike2", 40.0, 40.0);
const testStartPoint3 = new Point(5, "start point", 0, 0, "Start point of testHike3", 50.0, 50.0);
const testEndPoint3 = new Point(6, "end point", 0, 0, "End point of testHike3", 60.0, 60.0);
const testHike1 = new Hike(1, "testTitle1", testUser.userId, `gpx/${testGpx}`, 1, 1, 1, 10.0, "01:01", 10.0, 10.0, "testDifficulty1", "testDescription1", testStartPoint1.pointId, testEndPoint1.pointId);
const testHike2 = new Hike(2, "testTitle2", testUser.userId, `gpx/${testGpx}`, 2, 2, 2, 20.0, "02:02", 20.0, 20.0, "testDifficulty2", "testDescription2", testStartPoint2.pointId, testEndPoint2.pointId);
const testHike3 = new Hike(3, "testTitle3", testUser.userId, `gpx/${testGpx}`, 3, 3, 3, 30.0, "03:03", 30.0, 30.0, "testDifficulty3", "testDescription3", testStartPoint3.pointId, testEndPoint3.pointId);
const testSelectedHike1 = new SelectedHike(1, testHike1.hikeId, testUser.userId, "ongoing", "01/01/2023, 01:01:01", null);
const testSelectedHike2 = new SelectedHike(2, testHike2.hikeId, testUser.userId, "ongoing", "02/01/2023, 02:02:02", null);
const testSelectedHike3 = new SelectedHike(3, testHike3.hikeId, testUser.userId, "finished", "03/01/2023, 03:03:03", "03/01/2023, 04:04:04");
const testSelectedHikes = [testSelectedHike1, testSelectedHike2, testSelectedHike3];
const notExistingSelectedHike = testSelectedHike1.selectedHikeId + testSelectedHike2.selectedHikeId + testSelectedHike3.selectedHikeId;
const notExistingHike = testHike1.hikeId + testHike2.hikeId + testHike3.hikeId;
const notExistingUser = testUser.userId + 1;




/*****************************************************************************************************
*              POST /api/selectedHikes/start
*****************************************************************************************************/
describe("POST /api/selectedHikes/start", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await Promise.all([
			PersistentManager.store(User.tableName, testUser),
			PersistentManager.store(User.tableName, notAuthorizedUser)
		]);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
		  ]);
		  await Promise.all([
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2),
		  ]);
		
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.startSelectedHike(agent, "start selected hike", 201, credentials, testHike1.hikeId, testSelectedHike1.startTime);
	Utils.startSelectedHike(agent, "return 401 because of not authenticated user", 401, wrongCredentials, testHike1.hikeId, testSelectedHike1.startTime);
	Utils.startSelectedHike(agent, "return 401 because of not authenticated user", 401, notAuthorizedCredentials, testHike1.hikeId, testSelectedHike1.startTime);
	

	
});


/*****************************************************************************************************
*              GET /api/selectedHikes/
*****************************************************************************************************/
describe("GET /api/selectedHikes/", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await Promise.all([
			PersistentManager.store(User.tableName, testUser),
			PersistentManager.store(User.tableName, notAuthorizedUser)
		]);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
		  ]);
		  await Promise.all([
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2),
		  ]);
		  await Promise.all([
			PersistentManager.store(SelectedHike.tableName, testSelectedHike1),
			
		  ]);
		
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.getSelectedHike(agent, "get selected hike", 201, credentials, testSelectedHike1.selectedHikeId, testSelectedHike1.startTime);
	Utils.getSelectedHike(agent, "return 401 because of not authenticated user", 401, wrongCredentials, testSelectedHike1.selectedHikeId, testSelectedHike1.startTime);
	Utils.getSelectedHike(agent, "return 401 because of not authenticated user", 401, notAuthorizedCredentials, testSelectedHike1.selectedHikeId, testSelectedHike1.startTime);
	Utils.getSelectedHike(agent, "return 404 because of not existing hike with hikeId = :hikeId", 401, notAuthorizedCredentials, testSelectedHike1.selectedHikeId, testSelectedHike1.startTime);
	
	

});

/*****************************************************************************************************
*              PUT /api/selectedHikes/:selectedHikeId/terminate
*****************************************************************************************************/
describe("PUT /api/selectedHikes/:selectedHikeId/terminate", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
    await Promise.all([
      PersistentManager.store(Point.tableName, testStartPoint1),
      PersistentManager.store(Point.tableName, testEndPoint1),
      PersistentManager.store(Point.tableName, testStartPoint2),
      PersistentManager.store(Point.tableName, testEndPoint2),
    ]);
    await Promise.all([
      PersistentManager.store(Hike.tableName, testHike1),
      PersistentManager.store(Hike.tableName, testHike2),
    ]);
    await Promise.all([
      PersistentManager.store(SelectedHike.tableName, testSelectedHike1),
      PersistentManager.store(SelectedHike.tableName, testSelectedHike2),
    ]);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.putTerminateSelectedHike(agent, "terminate selected hike", 201, credentials, testSelectedHike1.selectedHikeId, testSelectedHike3.endTime);
	Utils.putTerminateSelectedHike(agent, "return 401 because of not authenticated user", 401, wrongCredentials, testSelectedHike1.selectedHikeId, testSelectedHike3.endTime);
	Utils.putTerminateSelectedHike(agent, "return 401 because of not authorized user", 401, notAuthorizedCredentials, testSelectedHike1.selectedHikeId, testSelectedHike3.endTime);
	Utils.putTerminateSelectedHike(agent, "return 404 because of not existing hike with hikeId = :hikeId", 404, credentials, notExistingSelectedHike, testSelectedHike3.endTime);
	Utils.putTerminateSelectedHike(agent, "return 422 because of wrong :selectedHikeId format", 422, credentials, "wrongSelectedHikeIdFormat", testSelectedHike3.endTime);
	Utils.putTerminateSelectedHike(agent, "return 422 because of wrong time type format", 422, credentials, testSelectedHike1.selectedHikeId, 1);
});


/*****************************************************************************************************
*              Other tests
*****************************************************************************************************/
describe("Other tests", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});
});