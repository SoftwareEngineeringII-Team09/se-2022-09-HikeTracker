const chai = require("chai");
const chaiHttp = require("chai-http");
const Hike = require("../dao/model/Hike");
const SelectedHike = require("../dao/model/SelectedHike");
const Point = require("../dao/model/Point");
const Hut = require("../dao/model/Hut");
const ParkingLot = require("../dao/model/ParkingLot");
const User = require("../dao/model/User");
const HikeRefPoint = require("../dao/model/HikeRefPoint");
const PersistentManager = require("../dao/PersistentManager");
const Utils = require("./integration-utils");

chai.use(chaiHttp);
chai.should();
const app = require("../index");
const agent = chai.request.agent(app);


/* Some useful data to use for tests */
const testGpx = "test.gpx";
const testHikeImage = "hike1.jpg";
const testHutImage = "hut1.jpg";
const testEditableGpx = "test_editable.gpx";
const testUser = new User(1, "test1@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", null, "testFristName", "testLastName", "390123456789", "Local Guide", 1);
const notAuthorizedUser = new User(2, "test2@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", null, null, null, null, "Hiker", 1);
const testUserHiker = new User(3, "test3@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", null, null, null, null, "Hiker", 1);
const credentials = { username: testUser.email, password: "Password1234." };
const credentialsHiker = { username: testUserHiker.email, password: "Password1234." };
const wrongCredentials = { username: testUser.email, password: "wrongPassword" };
const notAuthorizedCredentials = { username: notAuthorizedUser.email, password: "Password1234." };
const testStartPoint1 = new Point(1, "start point", 0, 0, "Start point of testHike1", 10.0, 10.0);
const testEndPoint1 = new Point(2, "end point", 0, 0, "End point of testHike1", 20.0, 20.0);
const testStartPoint2 = new Point(3, "start point", 0, 0, "Start point of testHike2", 30.0, 30.0);
const testEndPoint2 = new Point(4, "end point", 0, 0, "End point of testHike2", 40.0, 40.0);
const testStartPoint3 = new Point(5, "start point", 0, 0, "Start point of testHike3", 50.0, 50.0);
const testEndPoint3 = new Point(6, "end point", 0, 0, "End point of testHike3", 60.0, 60.0);
const testHike1 = new Hike(1, "testTitle1", testUser.userId, `gpx/${testGpx}`, 1, 1, 1, 10.0, "240", 10.0, 10.0, "testDifficulty1", "testDescription1", testStartPoint1.pointId, testEndPoint1.pointId,`hikeImage/${testHikeImage}`);
const testHike2 = new Hike(2, "testTitle2", testUser.userId, `gpx/${testGpx}`, 2, 2, 2, 20.0, "241", 20.0, 20.0, "testDifficulty2", "testDescription2", testStartPoint2.pointId, testEndPoint2.pointId,`hikeImage/${testHikeImage}`);
const testHike3 = new Hike(3, "testTitle3", testUser.userId, `gpx/${testGpx}`, 3, 3, 3, 30.0, "241", 30.0, 30.0, "testDifficulty3", "testDescription3", testStartPoint3.pointId, testEndPoint3.pointId,`hikeImage/${testHikeImage}`);
const testHikes = [testHike1, testHike2, testHike3];
const testHutPoint1 = new Point(7, "hut", 0, 1, null, 10.0, 10.0);
const testHutPoint2 = new Point(8, "hut", 0, 1, null, 10.0, 10.0);
const testPotHutPoint1 = new Point(11, "hut", 0, 1, null, 45.0, 7.0);
const testHut1 = new Hut(1, "testName1", testHutPoint1.pointId, testUser.userId, 1, 1, 1, 1, 10.0, 1000.0, "390123456789", "testHutEmail1@email.com", "www.testHutWebSite1.com",`hutImage/${testHutImage}`);
const testHut2 = new Hut(2, "testName2", testHutPoint2.pointId, testUser.userId, 1, 1, 1, 1, 10.0, 1000.0, "390123456789", "testHutEmail2@email.com", "www.testHutWebSite2.com",`hutImage/${testHutImage}`);
const testHut3 = new Hut(3, "testName3", testPotHutPoint1.pointId, testUser.userId, 1, 1, 1, 1, 10.0, 1000.0, "390123456789", "testHutEmail3@email.com", "www.testHutWebSite3.com",`hutImage/${testHutImage}`);
const testParkingLotPoint = new Point(9, "parking lot", 1, 0, null, 10.0, 10.0);
const testParkingLot = new ParkingLot(1, "testName", testParkingLotPoint.pointId, testUser.userId,  1000.0, 100);
const notExistingUser = testUser.userId + 1;
const notExistingHike = testHike1.hikeId + testHike2.hikeId + testHike3.hikeId;
const testRefPointList = [{ name: "testRefname1", coords: [111,222]},{name: "testRefname2",coords: [111,222]}];
const testHutList = [1,2]
const testRefPoint = new Point(10, "reference point", 0, 0, null, 10.0, 10.0);
const testHikeRefPoint = new HikeRefPoint(testHike1.hikeId,testRefPoint.pointId);
const testSelectedHike1 = new SelectedHike(1, testHike1.hikeId, testUserHiker.userId, "finished", "01/01/2023, 01:01:01", "01/01/2023, 02:02:02");
const testSelectedHike2 = new SelectedHike(2, testHike1.hikeId, testUserHiker.userId, "finished", "01/01/2023, 03:03:03", "01/01/2023, 04:04:04");
const testSelectedHike3 = new SelectedHike(3, testHike1.hikeId, testUserHiker.userId, "ongoing", "01/01/2023, 01:01:01", null);
const testSelectedHike4 = new SelectedHike(4, testHike1.hikeId, testUserHiker.userId, "ongoing", "01/01/2023, 02:02:02", null);
const testFinishedHikes = [testSelectedHike1, testSelectedHike2];


/*****************************************************************************************************
*              POST /api/hikes
*****************************************************************************************************/
describe("POST /api/hikes", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await Promise.all([
			PersistentManager.store(User.tableName, testUser),
			PersistentManager.store(User.tableName, notAuthorizedUser)
		]);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.postHike(agent, "post a hike", 201, credentials, testHike1.title, testHike1.expectedTime, testHike1.difficulty, testHike1.description, testHike1.city, testHike1.province, testHike1.region, testGpx,testHikeImage);
	Utils.postHike(agent, "return 401 because of not authenticated user", 401, wrongCredentials, testHike1.title, testHike1.expectedTime, testHike1.difficulty, testHike1.description, testHike1.city, testHike1.province, testHike1.region, testGpx,testHikeImage);
	Utils.postHike(agent, "return 401 because of not authorized user", 401, notAuthorizedCredentials, testHike1.title, testHike1.expectedTime, testHike1.difficulty, testHike1.description, testHike1.city, testHike1.province, testHike1.region, testGpx,testHikeImage);
	/* Add these tests with wrong body data format after solving body validation issue */
	// Utils.postHike(agent, "return 422 because of wrong title format", 422, credentials, 1, testHike1.expectedTime, testHike1.difficulty, testHike1.description, testHike1.city, testHike1.province, testHike1.region), testGpx;
	// Utils.postHike(agent, "return 422 because of wrong expectedTime format", 422, credentials, testHike1.title, 1, testHike1.difficulty, testHike1.description, testHike1.city, testHike1.province, testHike1.region, testGpx);
	// Utils.postHike(agent, "return 422 because of wrong difficulty format", 422, credentials, testHike1.title, testHike1.expectedTime, 1, testHike1.description, testHike1.city, testHike1.province, testHike1.region, testGpx);
	// Utils.postHike(agent, "return 422 because of wrong description format", 422, credentials, testHike1.title, testHike1.expectedTime, testHike1.difficulty, 1, testHike1.city, testHike1.province, testHike1.region, testGpx);
	// Utils.postHike(agent, "return 422 because of wrong city format", 422, credentials, testHike1.title, testHike1.expectedTime, testHike1.difficulty, testHike1.description, "wrongCityFormat", testHike1.province, testHike1.region, testGpx);
	// Utils.postHike(agent, "return 422 because of wrong province format", 422, credentials, testHike1.title, testHike1.expectedTime, testHike1.difficulty, testHike1.description, testHike1.city, "wrongCityProvince", testHike1.region, testGpx);
	// Utils.postHike(agent, "return 422 because of wrong region format", 422, credentials, testHike1.title, testHike1.expectedTime, testHike1.difficulty, testHike1.description, testHike1.city, testHike1.province, "wrongRegionFormat", testGpx);
});


/*****************************************************************************************************
*             PUT  /api/hikes/:hikeId/refPoints
*****************************************************************************************************/
describe("PUT /api/hikes/:hikeId/refPoints", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
			PersistentManager.store(Point.tableName, testRefPoint),	
		]);
		await Promise.all([			
			PersistentManager.store(Hike.tableName, testHike1),
			//PersistentManager.store(Hike.tableName, testHike2),	
		]);
		
		await Promise.all([				
			PersistentManager.store(HikeRefPoint.tableName, testHikeRefPoint),
		]);
	
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});
	
	Utils.putRefPoint(agent, "put a reference point list", 201, credentials, testHike1.hikeId, testRefPointList);
	Utils.putRefPoint(agent, "return 401 because of not authenticated user", 401, wrongCredentials,  testHike1.hikeId, testRefPointList);
	//update refpoint
	Utils.putRefPoint(agent, "should return 422 as wrong hikeId format",422, credentials, "wrongHikeIdFormat", testRefPointList);
});


/*****************************************************************************************************
*             PUT  /api/hikes/:hikeId/huts
*****************************************************************************************************/
describe("PUT /api/hikes/:hikeId/huts", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
			PersistentManager.store(Point.tableName,testHutPoint1),
			PersistentManager.store(Point.tableName,testHutPoint2)
		]);
		await Promise.all([			
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2),	
			PersistentManager.store(Hut.tableName, testHut1),
			PersistentManager.store(Hut.tableName, testHut2)
		]);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.putHutList(agent, "put a hut list", 201, credentials, testHike1.hikeId, testHutList);
	Utils.putHutList(agent, "return 401 because of not authenticated user", 401, wrongCredentials, testHike1.hikeId, testHutList);
	Utils.putHutList(agent, "should return 422 as wrong hikeId format", 422, credentials, "wrongHikeIdFormat", testHutList);
});


/*****************************************************************************************************
*              GET /api/hikes
*****************************************************************************************************/
describe("GET /api/hikes", function () {
	/* Test Setup */
	this.beforeAll(async () => {
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
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.getAllHikes(agent, "return the list of hikes", 200, testHikes.length);

});



/*****************************************************************************************************
*              GET /api/hikes/writers/:writerId
*****************************************************************************************************/
describe("GET /api/writers/:writerId", function () {
	/* Test Setup */
	this.beforeAll(async () => {
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
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.getHikeByWriterId(agent, "return all hikes written by user", 200, credentials, testUser.userId);	
	Utils.getHikeByWriterId(agent, "return 401 because of not authenticated user", 401, wrongCredentials,testUser.userId);
	Utils.getHikeByWriterId(agent, "return 422 because of wrong userId formate", 422, credentials, "wrongUserIdFormat");
});




/*****************************************************************************************************
*              GET /api/hikes/:hikeId
*****************************************************************************************************/
describe("GET /api/hikes/:hikeId", function () {
	/* Test Setup */
	this.beforeAll(async () => {
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
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.getHikeById(agent, "return the hike with hikeId = :hikeId", 200, testHike1.hikeId, testHike1);	
	Utils.getHikeById(agent, "return 404 because of not existing hike with hikeId = :hikeId", 404, notExistingHike);
	Utils.getHikeById(agent, "return 422 because of wrong :hikeId format", 422, "wrongHikeIdFormat");
});


/*****************************************************************************************************
*              GET /api/hikes/:hikeId/download
*****************************************************************************************************/
describe("GET /api/hikes/:hikeId/download", function () {
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
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.getHikeGpxById(agent, "return 200 because of correct download of hike's gpx", 200, credentials, testHike1.hikeId);
	Utils.getHikeGpxById(agent, "return 401 because of not authenticated user", 401, wrongCredentials, testHike1.hikeId);
	Utils.getHikeGpxById(agent, "return 404 because of not existing hike with hikeId = :hikeId", 404, credentials, notExistingHike);
	Utils.getHikeGpxById(agent, "return 422 because of wrong :hikeId format", 422, credentials, "wrongHikeIdFormat");
});


/*****************************************************************************************************
*              GET /api/hikes/:hikeId/potentialStartEndPoints
*****************************************************************************************************/
describe("GET /api/hikes/:hikeId/potentialStartEndPoints", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await Promise.all([
			PersistentManager.store(User.tableName, testUser),
			PersistentManager.store(User.tableName, notAuthorizedUser)
		]);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1)
		]);
		await PersistentManager.store(Hike.tableName, testHike1);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.getHikePotentialStartEndPoints(agent, "return the list of potential start/end points", 200, credentials, testHike1.hikeId);
	Utils.getHikePotentialStartEndPoints(agent, "return 401 because of not authenticated user", 401, wrongCredentials, testHike1.hikeId);
	Utils.getHikePotentialStartEndPoints(agent, "return 401 because of not authorized user", 401, notAuthorizedCredentials, testHike1.hikeId);
	Utils.getHikePotentialStartEndPoints(agent, "return 404 because of not existing hike with hikeId = :hikeId", 404, credentials, notExistingHike);
	Utils.getHikePotentialStartEndPoints(agent, "return 422 because of wrong :hikeId format", 422, credentials, "wrongHikeIdFormat");
});


/*****************************************************************************************************
*              PUT /api/hikes/:hikeId/startEndPoints
*****************************************************************************************************/
describe("PUT /api/hikes/:hikeId/startEndPoints", function () {
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
			PersistentManager.store(Point.tableName, testHutPoint1),
			PersistentManager.store(Point.tableName, testParkingLotPoint),
		]);
		await PersistentManager.store(ParkingLot.tableName, testParkingLot);
		await PersistentManager.store(Hut.tableName, testHut1);
		await PersistentManager.store(Hike.tableName, { ...testHike1, trackPath: `gpx/${testEditableGpx}` });
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.putHikeStartEndPoints(agent, "update hike's start/end points", 201, credentials, testHike1.hikeId, "hut", testHut1.hutId, "parking lot", testParkingLot.parkingLotId);
	Utils.putHikeStartEndPoints(agent, "return 401 because of not authenticated user", 401, wrongCredentials, testHike1.hikeId, "hut", testHut1.hutId, "parking lot", testParkingLot.parkingLotId);
	Utils.putHikeStartEndPoints(agent, "return 401 because of not authorized user", 401, notAuthorizedCredentials, testHike1.hikeId, "hut", testHut1.hutId, "parking lot", testParkingLot.parkingLotId);
	Utils.putHikeStartEndPoints(agent, "return 404 because of not existing hike with hikeId = :hikeId", 404, credentials, notExistingHike, "hut", testHut1.hutId, "parking lot", testParkingLot.parkingLotId);
	Utils.putHikeStartEndPoints(agent, "return 422 because of wrong :hikeId format", 422, credentials, "wrongHikeIdFormat", "hut", testHut1.hutId, "parking lot", testParkingLot.parkingLotId);
	Utils.putHikeStartEndPoints(agent, "return 422 because of wrong new start point type format", 422, credentials, testHike1.hikeId, credentials, 1, testHut1.hutId, "parking lot", testParkingLot.parkingLotId);
	Utils.putHikeStartEndPoints(agent, "return 422 because of wrong new start point id format", 422, credentials, testHike1.hikeId, credentials, "hut", "wrongIdFormat", "parking lot", testParkingLot.parkingLotId);
	Utils.putHikeStartEndPoints(agent, "return 422 because of wrong new end point type format", 422, credentials, testHike1.hikeId, credentials, "hut", testHut1.hutId, 1, testParkingLot.parkingLotId);
	Utils.putHikeStartEndPoints(agent, "return 422 because of wrong new end point id format", 422, credentials, testHike1.hikeId, credentials, "hut", testHut1.hutId, "parking lot", "wrongIdFormat");
});


/*****************************************************************************************************
*              GET /api/hikes/:hikeId/linkable-huts",
*****************************************************************************************************/
describe("GET /api/hikes/:hikeId/linkable-huts", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
		await Promise.all([
			PersistentManager.store(Point.tableName, testStartPoint1),
			PersistentManager.store(Point.tableName, testEndPoint1),
			PersistentManager.store(Point.tableName, testStartPoint2),
			PersistentManager.store(Point.tableName, testEndPoint2),
			PersistentManager.store(Point.tableName,testHutPoint1),
			PersistentManager.store(Point.tableName,testHutPoint2),
			PersistentManager.store(Point.tableName,testPotHutPoint1),
		]);
		await Promise.all([			
			PersistentManager.store(Hike.tableName, testHike1),
			PersistentManager.store(Hike.tableName, testHike2),	
			PersistentManager.store(Hut.tableName, testHut1),
			PersistentManager.store(Hut.tableName, testHut2),	
			PersistentManager.store(Hut.tableName, testHut3),	
		]);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.getPotentialHut(agent, "return all potential huts", 200, credentials, testHike1.hikeId);
	Utils.getPotentialHut(agent, "return 401 because of not authenticated user", 401, wrongCredentials, testHike1.hikeId);
	Utils.getPotentialHut(agent, "return 422 as wronghikeIdFormat", 422, credentials, "wrongHikeIdFormat");
});

/*****************************************************************************************************
*              GET /api/hikes/all/completed
*****************************************************************************************************/
describe("GET /api/hikes/all/completed", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await Promise.all([
			PersistentManager.store(User.tableName, testUser),
			PersistentManager.store(User.tableName, testUserHiker)
		]);
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
		await Promise.all([
			PersistentManager.store(SelectedHike.tableName, testSelectedHike1),
			PersistentManager.store(SelectedHike.tableName, testSelectedHike2),
			PersistentManager.store(SelectedHike.tableName, testSelectedHike3),
			PersistentManager.store(SelectedHike.tableName, testSelectedHike4)
		]);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.getAllCompletedHikes(agent, "return the list of completed hikes", 200, credentialsHiker, testFinishedHikes.length);
	Utils.getAllCompletedHikes(agent, "return 401 because of not authenticated user", 401, wrongCredentials, testFinishedHikes.length);
	Utils.getAllCompletedHikes(agent, "return 401 because of not authorized user", 401, credentials, testFinishedHikes.length);
});


/*****************************************************************************************************
*              GET /api/hikes/writers/:writerId
*****************************************************************************************************/
describe("GET /api/hikes/writers/:writerId", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await Promise.all([
			await PersistentManager.store(User.tableName, testUser),
			await PersistentManager.store(User.tableName, notAuthorizedUser)
		]);
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
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.getAllHikesByWriter(agent, "return the list of hikes of the writer", 200, credentials, testUser.userId, testHikes.length);
	Utils.getAllHikesByWriter(agent, "return 422 because of wrong :writerId format", 422, credentials, "wrongWriterIdFormat", testHikes.length);
	Utils.getAllHikesByWriter(agent, "return 401 because of not authenticated user", 401, wrongCredentials, testUser.userId, testHikes.length);
	Utils.getAllHikesByWriter(agent, "return 401 because of not authorized user", 401, notAuthorizedCredentials, testUser.userId, testHikes.length);
	Utils.getAllHikesByWriter(agent, "return 401 because of :hikerId !== req.user.userId", 401, credentials, notAuthorizedUser.userId, testHikes.length);
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