const chai = require("chai");
const chaiHttp = require("chai-http");
const ParkingLot = require("../dao/model/ParkingLot");
const Point = require("../dao/model/Point");
const User = require("../dao/model/User");
const PersistentManager = require("../dao/PersistentManager");
const Utils = require("./integration-utils");

chai.use(chaiHttp);
chai.should();
const app = require("../index");
let agent = chai.request.agent(app);

/* Some useful data to use for tests */
const testUser = new User(1, "test1@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", null, "testFristName", "testLastName", "390123456789", "Local Guide", 1);
const notAuthorizedUser = new User(2, "test2@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", null, null, null, null, "Hiker", 1);
const credentials = { username: testUser.email, password: "Password1234." };
const wrongCredentials = { username: testUser.email, password: "wrongPassword" };
const notAuthorizedCredentials = { username: notAuthorizedUser.email, password: "Password1234." };
const testParkingLotPoint1 = new Point(1, "parking lot", 1, 0, null, 10.0, 10.0);
const testParkingLotPoint2 = new Point(2, "parking lot", 1, 0, null, 20.0, 20.0);
const testParkingLotPoint3 = new Point(3, "parking lot", 1, 0, null, 30.0, 30.0);
const testParkingLot1 = new ParkingLot(1, "testName1", testParkingLotPoint1.pointId, testUser.userId, 1000.0, 100);
const testParkingLot2 = new ParkingLot(2, "testName2", testParkingLotPoint2.pointId, testUser.userId, 2000.0, 200);
const testParkingLot3 = new ParkingLot(3, "testName3", testParkingLotPoint3.pointId, testUser.userId, 3000.0, 300);
const testParkingLots = [testParkingLot1, testParkingLot2, testParkingLot3];
const notExistingUser = testUser.userId + 1;


/*****************************************************************************************************
*              POST /api/parkingLots
*****************************************************************************************************/
describe("POST /api/parkingLots", function () {
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
	
	Utils.postParkingLot(agent, "post a parking lot", 201, credentials, testParkingLot1.parkingLotName, testParkingLotPoint1.latitude, testParkingLotPoint1.longitude, testParkingLot1.altitude, testParkingLot1.capacity);
	Utils.postParkingLot(agent, "return 401 because of not authenticated user", 401, wrongCredentials, testParkingLot1.parkingLotName, testParkingLotPoint1.latitude, testParkingLotPoint1.longitude, testParkingLot1.altitude, testParkingLot1.capacity);
	Utils.postParkingLot(agent, "return 401 because of not authorized user", 401, notAuthorizedCredentials, testParkingLot1.parkingLotName, testParkingLotPoint1.latitude, testParkingLotPoint1.longitude, testParkingLot1.altitude, testParkingLot1.capacity);
	Utils.postParkingLot(agent, "return 422 because of wrong parkingLotName format", 422, credentials, 1, testParkingLotPoint1.latitude, testParkingLotPoint1.longitude, testParkingLot1.altitude, testParkingLot1.capacity);
	Utils.postParkingLot(agent, "return 422 because of wrong latitude format", 422, credentials, testParkingLot1.parkingLotName, "wrongLatitudeFormat", testParkingLotPoint1.longitude, testParkingLot1.altitude, testParkingLot1.capacity);
	Utils.postParkingLot(agent, "return 422 because of wrong longitude format", 422, credentials, testParkingLot1.parkingLotName, testParkingLotPoint1.latitude, "wrongLongitudeFormat", testParkingLot1.altitude, testParkingLot1.capacity);
	Utils.postParkingLot(agent, "return 422 because of wrong altitude format", 422, credentials, testParkingLot1.parkingLotName, testParkingLotPoint1.latitude, testParkingLotPoint1.longitude, "wrongAltitudeFormat", testParkingLot1.capacity);
	Utils.postParkingLot(agent, "return 422 because of wrong capacity format", 422, credentials, testParkingLot1.parkingLotName, testParkingLotPoint1.latitude, testParkingLotPoint1.longitude, testParkingLot1.altitude, "wrongCapacityFormat");
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