const chai = require("chai");
const chaiHttp = require("chai-http");
const Hut = require("../dao/model/Hut");
const Point = require("../dao/model/Point");
const User = require("../dao/model/User");
const PersistentManager = require("../dao/PersistentManager");
const Utils = require("./integration-utils");

chai.use(chaiHttp);
chai.should();
const app = require("../index");
let agent = chai.request.agent(app);

/* Some useful data to use for tests */
const testUserLocalGuide = new User(1, "test1@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", null, "testFristName", "testLastName", "390123456789", "Local Guide", 1);
const testUserHiker = new User(2, "test2@email.com", "4bb8105ea6fa6e3530cfda3d25fea37f", "72fc8865b5ea227c621e54e7b9872c48da0fff8b25fe9a8394ce5438f9f7de45", null, null, null, null, "Hiker", 1);
const credentialsLocalGuide = { username: testUserLocalGuide.email, password: "Password1234." };
const credentialsHiker = { username: testUserHiker.email, password: "Password1234." };
const wrongCredentials = { username: testUserLocalGuide.email, password: "wrongPassword" };
const testHutPoint1 = new Point(1, "hut", 0, 1, null, 10.0, 10.0);
const testHutPoint2 = new Point(2, "hut", 0, 1, null, 20.0, 20.0);
const testHutPoint3 = new Point(3, "hut", 0, 1, null, 30.0, 30.0);
const testHut1 = new Hut(1, "testName1", testHutPoint1.pointId, testUserLocalGuide.userId, 1, 1, 1, 1, 10.0, 1000.0, "391012345678", "testHutEmail1@email.com", "www.testHutWebSite1.com");
const testHut2 = new Hut(2, "testName2", testHutPoint2.pointId, testUserLocalGuide.userId, 2, 2, 2, 2, 20.0, 2000.0, "392012345678", "testHutEmail2@email.com", "www.testHutWebSite2.com");
const testHut3 = new Hut(3, "testName3", testHutPoint3.pointId, testUserLocalGuide.userId, 3, 3, 3, 3, 30.0, 3000.0, "393012345678", "testHutEmail3@email.com", "www.testHutWebSite3.com");
const testHuts = [testHut1, testHut2, testHut3];
const notExistingUser = testUserLocalGuide.userId + 1;

/*****************************************************************************************************
 *              POST /api/huts/
 *****************************************************************************************************/
// describe("POST /api/huts/", function () {
//   /* Test Setup */
//   this.beforeAll(async () => {
//     await Utils.clearAll();
//     await PersistentManager.store(User.tableName, testUserLocalGuide);
//   });

//   /* Test Teardown */
//   this.afterAll(async () => {
//     await Utils.clearAll();
//   });

//   Utils.postHut(
//     agent,
//     "post a hut",
//     201,
//     testUserLocalGuide.userId,
//     testHut1.hutName,
//     testHut1.city,
//     testHut1.province,
//     testHut1.region,
//     testHut1.numOfBeds,
//     testHut1.cost,
//     testHutPoint1.latitude,
//     testHutPoint1.longitude,
//		 testHut1.altitude,
//		 testHut1.phone,
//		 testHut1.email,
//     testHut1.website
//   );
//   Utils.postHut(
//     agent,
//     "return 404 because of not existing writer with writerId = :writerId",
//     404,
//     notExistingUser,
//     testHut1.hutName,
//     testHut1.city,
//     testHut1.province,
//     testHut1.region,
//     testHut1.numOfBeds,
//     testHut1.cost,
//     testHutPoint1.latitude,
//     testHutPoint1.longitude,
//		 testHut1.altitude,
//		 testHut1.phone,
//		 testHut1.email,
//     testHut1.website
//   );
//   Utils.postHut(
//     agent,
//     "return 422 because of wrong :writerId format",
//     422,
//     "wrongWriterIdFormat",
//     testHut1.hutName,
//     testHut1.city,
//     testHut1.province,
//     testHut1.region,
//     testHut1.numOfBeds,
//     testHut1.cost,
//     testHutPoint1.latitude,
//     testHutPoint1.longitude,
//		 testHut1.altitude,
//		 testHut1.phone,
//		 testHut1.email,
//     testHut1.website
//   );
//   Utils.postHut(
//     agent,
//     "return 422 because of wrong hutName format",
//     422,
//     testUserLocalGuide.userId,
//     1,
//     testHut1.city,
//     testHut1.province,
//     testHut1.region,
//     testHut1.numOfBeds,
//     testHut1.cost,
//     testHutPoint1.latitude,
//     testHutPoint1.longitude,
//		 testHut1.altitude,
//		 testHut1.phone,
//		 testHut1.email,
//     testHut1.website
//   );
//   Utils.postHut(
//     agent,
//     "return 422 because of wrong city format",
//     422,
//     testUserLocalGuide.userId,
//     testHut1.hutName,
//     "wrongCityFormat",
//     testHut1.province,
//     testHut1.region,
//     testHut1.numOfBeds,
//     testHut1.cost,
//     testHutPoint1.latitude,
//     testHutPoint1.longitude,
//		 testHut1.altitude,
//		 testHut1.phone,
//		 testHut1.email,
//     testHut1.website
//   );
//   Utils.postHut(
//     agent,
//     "return 422 because of wrong province format",
//     422,
//     testUserLocalGuide.userId,
//     testHut1.hutName,
//     testHut1.city,
//     "wrongProvinceFormat",
//     testHut1.region,
//     testHut1.numOfBeds,
//     testHut1.cost,
//     testHutPoint1.latitude,
//     testHutPoint1.longitude,
//		 testHut1.altitude,
//		 testHut1.phone,
//		 testHut1.email,
//     testHut1.website
//   );
//   Utils.postHut(
//     agent,
//     "return 422 because of wrong region format",
//     422,
//     testUserLocalGuide.userId,
//     testHut1.hutName,
//     testHut1.city,
//     testHut1.province,
//     "wrongRegionFormat",
//     testHut1.numOfBeds,
//     testHut1.cost,
//     testHutPoint1.latitude,
//     testHutPoint1.longitude,
//		 testHut1.altitude,
//		 testHut1.phone,
//		 testHut1.email,
//     testHut1.website
//   );
//   Utils.postHut(
//     agent,
//     "return 422 because of wrong numOfBeds format",
//     422,
//     testUserLocalGuide.userId,
//     testHut1.hutName,
//     testHut1.city,
//     testHut1.province,
//     testHut1.region,
//     "wrongNumOfBedsFormat",
//     testHut1.cost,
//     testHutPoint1.latitude,
//     testHutPoint1.longitude,
//		 testHut1.altitude,
//		 testHut1.phone,
//		 testHut1.email,
//     testHut1.website
//   );
//   Utils.postHut(
//     agent,
//     "return 422 because of wrong cost format",
//     422,
//     testUserLocalGuide.userId,
//     testHut1.hutName,
//     testHut1.city,
//     testHut1.province,
//     testHut1.region,
//     testHut1.numOfBeds,
//     "wrongCostFormat",
//     testHutPoint1.latitude,
//     testHutPoint1.longitude,
//		 testHut1.altitude,
//		 testHut1.phone,
//		 testHut1.email,
//     testHut1.website
//   );
//   Utils.postHut(
//     agent,
//     "return 422 because of wrong latitude format",
//     422,
//     testUserLocalGuide.userId,
//     testHut1.hutName,
//     testHut1.city,
//     testHut1.province,
//     testHut1.region,
//     testHut1.numOfBeds,
//     testHut1.cost,
//     "wrongLatitudeFormat",
//     testHutPoint1.longitude,
//		 testHut1.altitude,
//		 testHut1.phone,
//		 testHut1.email,
//     testHut1.website
//   );
//   Utils.postHut(
//     agent,
//     "return 422 because of wrong longitude format",
//     422,
//     testUserLocalGuide.userId,
//     testHut1.hutName,
//     testHut1.city,
//     testHut1.province,
//     testHut1.region,
//     testHut1.numOfBeds,
//     testHut1.cost,
//     testHutPoint1.latitude,
//     "wrongLongitudeFormat",
//		 testHut1.altitude,
//		 testHut1.phone,
//		 testHut1.email,
//     testHut1.website
//   );
//   Utils.postHut(
//     agent,
//     "return 422 because of wrong altitude format",
//     422,
//     testUserLocalGuide.userId,
//     testHut1.hutName,
//     testHut1.city,
//     testHut1.province,
//     testHut1.region,
//     testHut1.numOfBeds,
//     testHut1.cost,
//     testHutPoint1.latitude,
//     testHutPoint1.longitude,
//		 "wrongAltitudeFormat",
//		 testHut1.phone,
//		 testHut1.email,
//     testHut1.website
//   );
//   Utils.postHut(
//     agent,
//     "return 422 because of wrong phoe format",
//     422,
//     testUserLocalGuide.userId,
//     testHut1.hutName,
//     testHut1.city,
//     testHut1.province,
//     testHut1.region,
//     testHut1.numOfBeds,
//     testHut1.cost,
//     testHutPoint1.latitude,
//     testHutPoint1.longitude,
//		 "wrongAltitudeFormat",
//		 1,
//		 testHut1.email,
//     testHut1.website
//   );
//   Utils.postHut(
//     agent,
//     "return 422 because of wrong email format",
//     422,
//     testUserLocalGuide.userId,
//     testHut1.hutName,
//     testHut1.city,
//     testHut1.province,
//     testHut1.region,
//     testHut1.numOfBeds,
//     testHut1.cost,
//     testHutPoint1.latitude,
//     testHutPoint1.longitude,
//		 "wrongAltitudeFormat",
//		 testHut1.phone,
//		 1,
//     testHut1.website
//   );
//   Utils.postHut(
//     agent,
//     "return 422 because of wrong website format",
//     422,
//     testUserLocalGuide.userId,
//     testHut1.hutName,
//     testHut1.city,
//     testHut1.province,
//     testHut1.region,
//     testHut1.numOfBeds,
//     testHut1.cost,
//     testHutPoint1.latitude,
//     testHutPoint1.longitude,
//		 "wrongAltitudeFormat",
//		 testHut1.phone,
//		 testHut1.email,
//     1
//   );
// });

// /*****************************************************************************************************
//  *              GET /api/huts/:hutId
//  *****************************************************************************************************/
// describe("GET /api/huts/:hutId", function () {
//   /* Test Setup */
//   this.beforeAll(async () => {
//     await Utils.clearAll();
//     await Promise.all([
//       PersistentManager.store(User.tableName, testUserLocalGuide),
//       PersistentManager.store(User.tableName, testUserHiker),
//     ]);
//     await Promise.all([
//       PersistentManager.store(Point.tableName, testHutPoint1),
//       PersistentManager.store(Point.tableName, testHutPoint2),
//       PersistentManager.store(Point.tableName, testHutPoint3),
//     ]);
//     await Promise.all([
//       PersistentManager.store(Hut.tableName, testHut1),
//       PersistentManager.store(Hut.tableName, testHut2),
//       PersistentManager.store(Hut.tableName, testHut3),
//     ]);
//   });

//   /* Test Teardown */
//   this.afterAll(async () => {
//     await Utils.clearAll();
//   });

//   Utils.getOneHut(agent, "return the hut", 200, credentialsHiker);
//   Utils.getOneHut(
//     agent,
//     "return 401 because of not authenticated user",
//     401,
//     wrongCredentials
//   );
//   Utils.getOneHut(
//     agent,
//     "return 401 because of not authorized user",
//     401,
//     credentialsLocalGuide
//   );
// });

// /*****************************************************************************************************
//  *              GET /api/huts/:hutId
//  *****************************************************************************************************/
// describe("GET /api/huts/:hutId", function () {
//   /* Test Setup */
//   this.beforeAll(async () => {
//     await Utils.clearAll();
//     await Promise.all([
//       PersistentManager.store(User.tableName, testUserLocalGuide),
//       PersistentManager.store(User.tableName, testUserHiker),
//     ]);
//     await Promise.all([
//       PersistentManager.store(Point.tableName, testHutPoint1),
//       PersistentManager.store(Point.tableName, testHutPoint2),
//       PersistentManager.store(Point.tableName, testHutPoint3),
//     ]);
//     await Promise.all([
//       PersistentManager.store(Hut.tableName, testHut1),
//       PersistentManager.store(Hut.tableName, testHut2),
//       PersistentManager.store(Hut.tableName, testHut3),
//     ]);
//   });

//   /* Test Teardown */
//   this.afterAll(async () => {
//     await Utils.clearAll();
//   });

//   Utils.getOneHut(agent, "return the hut", 200, credentialsHiker);
//   Utils.getOneHut(
//     agent,
//     "return 401 because of not authenticated user",
//     401,
//     wrongCredentials
//   );
//   Utils.getOneHut(
//     agent,
//     "return 401 because of not authorized user",
//     401,
//     credentialsLocalGuide
//   );
// });


// /*****************************************************************************************************
// *              POST /api/huts
// *****************************************************************************************************/
// describe("POST /api/huts", function () {
// 	/* Test Setup */
// 	this.beforeAll(async () => {
// 		await Utils.clearAll();
// 		await Promise.all([
// 			PersistentManager.store(User.tableName, testUserLocalGuide),
// 			PersistentManager.store(User.tableName, testUserHiker)
// 		]);
// 	});

// 	/* Test Teardown */
// 	this.afterAll(async () => {
// 		await Utils.clearAll();
// 	});

// 	Utils.postHut(agent, "post a hut", 201, credentialsLocalGuide, testHut1.hutName, testHut1.city, testHut1.province, testHut1.region, testHut1.numOfBeds, testHut1.cost, testHutPoint1.latitude, testHutPoint1.longitude, testHut1.altitude, testHut1.phone, testHut1.email, testHut1.website);
// 	Utils.postHut(agent, "return 401 because of not authenticated user", 401, wrongCredentials, testHut1.hutName, testHut1.city, testHut1.province, testHut1.region, testHut1.numOfBeds, testHut1.cost, testHutPoint1.latitude, testHutPoint1.longitude, testHut1.altitude, testHut1.phone, testHut1.email, testHut1.website);
// 	Utils.postHut(agent, "return 401 because of not authorized user", 401, credentialsHiker, testHut1.hutName, testHut1.city, testHut1.province, testHut1.region, testHut1.numOfBeds, testHut1.cost, testHutPoint1.latitude, testHutPoint1.longitude, testHut1.altitude, testHut1.phone, testHut1.email, testHut1.website);
// 	Utils.postHut(agent, "return 422 because of wrong hutName format", 422, credentialsLocalGuide, 1, testHut1.city, testHut1.province, testHut1.region, testHut1.numOfBeds, testHut1.cost, testHutPoint1.latitude, testHutPoint1.longitude, testHut1.altitude, testHut1.phone, testHut1.email, testHut1.website);
// 	Utils.postHut(agent, "return 422 because of wrong city format", 422, credentialsLocalGuide, testHut1.hutName, "wrongCityFormat", testHut1.province, testHut1.region, testHut1.numOfBeds, testHut1.cost, testHutPoint1.latitude, testHutPoint1.longitude, testHut1.altitude, testHut1.phone, testHut1.email, testHut1.website);
// 	Utils.postHut(agent, "return 422 because of wrong province format", 422, credentialsLocalGuide, testHut1.hutName, testHut1.city, "wrongProvinceFormat", testHut1.region, testHut1.numOfBeds, testHut1.cost, testHutPoint1.latitude, testHutPoint1.longitude, testHut1.altitude, testHut1.phone, testHut1.email, testHut1.website);
// 	Utils.postHut(agent, "return 422 because of wrong region format", 422, credentialsLocalGuide, testHut1.hutName, testHut1.city, testHut1.province, "wrongRegionFormat", testHut1.numOfBeds, testHut1.cost, testHutPoint1.latitude, testHutPoint1.longitude, testHut1.altitude, testHut1.phone, testHut1.email, testHut1.website);
// 	Utils.postHut(agent, "return 422 because of wrong numOfBeds format", 422, credentialsLocalGuide, testHut1.hutName, testHut1.city, testHut1.province, testHut1.region, "wrongNumOfBedsFormat", testHut1.cost, testHutPoint1.latitude, testHutPoint1.longitude, testHut1.altitude, testHut1.phone, testHut1.email, testHut1.website);
// 	Utils.postHut(agent, "return 422 because of wrong cost format", 422, credentialsLocalGuide, testHut1.hutName, testHut1.city, testHut1.province, testHut1.region, testHut1.numOfBeds, "wrongCostFormat", testHutPoint1.latitude, testHutPoint1.longitude, testHut1.altitude, testHut1.phone, testHut1.email, testHut1.website);
// 	Utils.postHut(agent, "return 422 because of wrong latitude format", 422, credentialsLocalGuide, testHut1.hutName, testHut1.city, testHut1.province, testHut1.region, testHut1.numOfBeds, testHut1.cost, "wrongLatitudeFormat", testHutPoint1.longitude, testHut1.altitude, testHut1.phone, testHut1.email, testHut1.website);
// 	Utils.postHut(agent, "return 422 because of wrong longitude format", 422, credentialsLocalGuide, testHut1.hutName, testHut1.city, testHut1.province, testHut1.region, testHut1.numOfBeds, testHut1.cost, testHutPoint1.latitude, "wrongLongitudeFormat", testHut1.altitude, testHut1.phone, testHut1.email, testHut1.website);
// 	Utils.postHut(agent, "return 422 because of wrong altitude format", 422, credentialsLocalGuide, testHut1.hutName, testHut1.city, testHut1.province, testHut1.region, testHut1.numOfBeds, testHut1.cost, testHutPoint1.latitude, testHutPoint1.longitude, "wrongAltitudeFormat", testHut1.phone, testHut1.email, testHut1.website);
// 	Utils.postHut(agent, "return 422 because of wrong phone format", 422, credentialsLocalGuide, testHut1.hutName, testHut1.city, testHut1.province, testHut1.region, testHut1.numOfBeds, testHut1.cost, testHutPoint1.latitude, testHutPoint1.longitude, testHut1.altitude, 1, testHut1.email, testHut1.website);
// 	Utils.postHut(agent, "return 422 because of wrong email format", 422, credentialsLocalGuide, testHut1.hutName, testHut1.city, testHut1.province, testHut1.region, testHut1.numOfBeds, testHut1.cost, testHutPoint1.latitude, testHutPoint1.longitude, testHut1.altitude, testHut1.phone, 1, testHut1.website);
// 	Utils.postHut(agent, "return 422 because of wrong website format", 422, credentialsLocalGuide, testHut1.hutName, testHut1.city, testHut1.province, testHut1.region, testHut1.numOfBeds, testHut1.cost, testHutPoint1.latitude, testHutPoint1.longitude, testHut1.altitude, testHut1.phone, testHut1.email, 1);
// });


/*****************************************************************************************************
*              GET /api/huts
*****************************************************************************************************/
describe("GET /api/huts", function () {
	/* Test Setup */
	this.beforeAll(async () => {
		await Utils.clearAll();
		await Promise.all([
			PersistentManager.store(User.tableName, testUserLocalGuide),
			PersistentManager.store(User.tableName, testUserHiker)
		]);
		await Promise.all([
			PersistentManager.store(Point.tableName, testHutPoint1),
			PersistentManager.store(Point.tableName, testHutPoint2),
			PersistentManager.store(Point.tableName, testHutPoint3)
		]);
		await Promise.all([
			PersistentManager.store(Hut.tableName, testHut1),
			PersistentManager.store(Hut.tableName, testHut2),
			PersistentManager.store(Hut.tableName, testHut3)
		]);
	});

	/* Test Teardown */
	this.afterAll(async () => {
		await Utils.clearAll();
	});

	Utils.getAllHuts(agent, "return the list of huts", 200, credentialsHiker, testHuts.length);
	Utils.getAllHuts(agent, "return 401 because of not authenticated user", 401, wrongCredentials, testHuts.length);
	Utils.getAllHuts(agent, "return 401 because of not authorized user", 401, credentialsLocalGuide, testHuts.length);
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
