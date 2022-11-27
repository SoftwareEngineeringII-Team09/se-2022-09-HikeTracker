const chai = require("chai");
const chaiHttp = require("chai-http");
const Hike = require("../dao/model/Hike");
const Point = require("../dao/model/Point");
const User = require("../dao/model/User");
const PersistentManager = require("../dao/PersistentManager");
const Utils = require("./integration-utils");

chai.use(chaiHttp);
chai.should();
const app = require("../index");
let agent = chai.request.agent(app);

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
const notExistingUser = testUser.userId + 1;
const notExistingHike = testHike1.hikeId + testHike2.hikeId + testHike3.hikeId;


/*****************************************************************************************************
*              POST /api/hikes/writers/:writerId
*****************************************************************************************************/
describe("POST /api/hikes/writers/:writerId", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.postHike(agent, "post a hike", 201, testUser.userId, testHike1.title, testHike1.expectedTime, testHike1.difficulty, testHike1.description, testHike1.city, testHike1.province, testHike1.region, testGpx);
	Utils.postHike(agent, "return 404 because of not existing writer with writerId = :writerId", 404, notExistingUser, testHike1.title, testHike1.expectedTime, testHike1.difficulty, testHike1.description, testHike1.city, testHike1.province, testHike1.region, testGpx);
	Utils.postHike(agent, "return 422 because of wrong :writerId format", 422, "wrongWriterIdFormat", testHike1.title, testHike1.expectedTime, testHike1.difficulty, testHike1.description, testHike1.city, testHike1.province, testHike1.region, testGpx)
	/* TODO add these tests with wrong body data format after solving body validation issue */
	// Utils.postHike(agent, "should return 422 because of wrong title format", 422, testUser.userId, 1, testHike1.expectedTime, testHike1.difficulty, testHike1.description, testHike1.city, testHike1.province, testHike1.region), testGpx;
	// Utils.postHike(agent, "should return 422 because of wrong expectedTime format", 422, testUser.userId, testHike1.title, 1, testHike1.difficulty, testHike1.description, testHike1.city, testHike1.province, testHike1.region, testGpx);
	// Utils.postHike(agent, "should return 422 because of wrong difficulty format", 422, testUser.userId, testHike1.title, testHike1.expectedTime, 1, testHike1.description, testHike1.city, testHike1.province, testHike1.region, testGpx);
	// Utils.postHike(agent, "should return 422 because of wrong description format", 422, testUser.userId, testHike1.title, testHike1.expectedTime, testHike1.difficulty, 1, testHike1.city, testHike1.province, testHike1.region, testGpx);
	// Utils.postHike(agent, "should return 422 because of wrong city format", 422, testUser.userId, testHike1.title, testHike1.expectedTime, testHike1.difficulty, testHike1.description, "wrongCityFormat", testHike1.province, testHike1.region, testGpx);
	// Utils.postHike(agent, "should return 422 because of wrong province format", 422, testUser.userId, testHike1.title, testHike1.expectedTime, testHike1.difficulty, testHike1.description, testHike1.city, "wrongCityProvince", testHike1.region, testGpx);
	// Utils.postHike(agent, "should return 422 because of wrong region format", 422, testUser.userId, testHike1.title, testHike1.expectedTime, testHike1.difficulty, testHike1.description, testHike1.city, testHike1.province, "wrongRegionFormat", testGpx);
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

	Utils.getHikeGpxById(agent, "return 200 because of correct download of hike's gpx", 200, testHike1.hikeId);
	Utils.getHikeGpxById(agent, "return 404 because of not existing hike with hikeId = :hikeId", 404, notExistingHike);
	Utils.getHikeGpxById(agent, "return 422 because of wrong :hikeId format", 422, "wrongHikeIdFormat");
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