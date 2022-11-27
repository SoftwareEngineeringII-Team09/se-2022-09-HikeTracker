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
const testUser = { userId: 1, email: "test@email.it", salt: "testSalt", password: "testPassword", firstname: "testFirstname", lastname: "testLastname", mobile: "390123456789", role: "testRole", active: 0 };
const testParkingLotPoint1 = new Point(1, "parking lot", 1, 0, null, 10.0, 10.0, 10.0);
const testParkingLotPoint2 = new Point(2, "parking lot", 1, 0, null, 20.0, 20.0, 20.0);
const testParkingLotPoint3 = new Point(3, "parking lot", 1, 0, null, 30.0, 30.0, 30.0);
const testParkingLot1 = new ParkingLot(1, "testName1", testParkingLotPoint1.pointId, testUser.userId);
const testParkingLot2 = new ParkingLot(2, "testName2", testParkingLotPoint2.pointId, testUser.userId);
const testParkingLot3 = new ParkingLot(3, "testName3", testParkingLotPoint3.pointId, testUser.userId);
const testParkingLots = [testParkingLot1, testParkingLot2, testParkingLot3];
const notExistingUser = testUser.userId + 1;


/*****************************************************************************************************
*              POST /api/parkingLots/writers/:writerId
*****************************************************************************************************/
describe("POST /api/parkingLots/writers/:writerId", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await PersistentManager.store(User.tableName, testUser);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.postParkingLot(agent, "post a parking lot", 201, testUser.userId, testParkingLot1.parkingLotName, testParkingLotPoint1.latitude, testParkingLotPoint1.longitude, testParkingLotPoint1.altitude);
	Utils.postParkingLot(agent, "return 404 because of not existing writer with writerId = :writerId", 404, notExistingUser, testParkingLot1.parkingLotName, testParkingLotPoint1.latitude, testParkingLotPoint1.longitude, testParkingLotPoint1.altitude);
	Utils.postParkingLot(agent, "return 422 because of wrong :writerId format", 422, "wrongWriterIdFormat", testParkingLot1.parkingLotName, testParkingLotPoint1.latitude, testParkingLotPoint1.longitude, testParkingLotPoint1.altitude);
	Utils.postParkingLot(agent, "return 422 because of wrong parkingLotName format", 422, testUser.userId, 1, testParkingLotPoint1.latitude, testParkingLotPoint1.longitude, testParkingLotPoint1.altitude);
	Utils.postParkingLot(agent, "return 422 because of wrong latitude format", 422, testUser.userId, testParkingLot1.parkingLotName, "wrongLatitudeFormat", testParkingLotPoint1.longitude, testParkingLotPoint1.altitude);
	Utils.postParkingLot(agent, "return 422 because of wrong longitude format", 422, testUser.userId, testParkingLot1.parkingLotName, testParkingLotPoint1.latitude, "wrongLongitudeFormat", testParkingLotPoint1.altitude);
	Utils.postParkingLot(agent, "return 422 because of wrong altitude format", 422, testUser.userId, testParkingLot1.parkingLotName, testParkingLotPoint1.latitude, testParkingLotPoint1.longitude, "wrongAltitudeFormat");
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