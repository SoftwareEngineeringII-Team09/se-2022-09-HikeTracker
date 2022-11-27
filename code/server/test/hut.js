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
const testUser = {
  userId: 1,
  email: "test@email.it",
  salt: "testSalt",
  password: "testPassword",
  firstname: "testFirstname",
  lastname: "testLastname",
  mobile: "390123456789",
  role: "testRole",
  active: 0,
};
const testHutPoint1 = new Point(1, "hut", 0, 1, null, 10.0, 10.0, 10.0);
const testHutPoint2 = new Point(2, "hut", 0, 1, null, 20.0, 20.0, 20.0);
const testHutPoint3 = new Point(3, "hut", 0, 1, null, 30.0, 30.0, 30.0);
const testHut1 = new Hut(
  1,
  "testName1",
  testHutPoint1.pointId,
  testUser.userId,
  1,
  1,
  1,
  1,
  10.0
);
const testHut2 = new Hut(
  2,
  "testName2",
  testHutPoint2.pointId,
  testUser.userId,
  2,
  2,
  2,
  2,
  20.0
);
const testHut3 = new Hut(
  3,
  "testName3",
  testHutPoint3.pointId,
  testUser.userId,
  3,
  3,
  3,
  3,
  30.0
);
const testHuts = [testHut1, testHut2, testHut3];
const notExistingUser = testUser.userId + 1;

/*****************************************************************************************************
 *              POST /api/huts/writers/:writerId
 *****************************************************************************************************/
describe("POST /api/huts/writers/:writerId", function () {
  /* Test Setup */
  this.beforeAll(async () => {
    await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
  });

  /* Test Teardown */
  this.afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.postHut(
    agent,
    "post a hut",
    201,
    testUser.userId,
    testHut1.hutName,
    testHut1.city,
    testHut1.province,
    testHut1.region,
    testHut1.numOfBeds,
    testHut1.cost,
    testHutPoint1.latitude,
    testHutPoint1.longitude,
    testHutPoint1.altitude
  );
  Utils.postHut(
    agent,
    "return 404 because of not existing writer with writerId = :writerId",
    404,
    notExistingUser,
    testHut1.hutName,
    testHut1.city,
    testHut1.province,
    testHut1.region,
    testHut1.numOfBeds,
    testHut1.cost,
    testHutPoint1.latitude,
    testHutPoint1.longitude,
    testHutPoint1.altitude
  );
  Utils.postHut(
    agent,
    "return 422 because of wrong :writerId format",
    422,
    "wrongWriterIdFormat",
    testHut1.hutName,
    testHut1.city,
    testHut1.province,
    testHut1.region,
    testHut1.numOfBeds,
    testHut1.cost,
    testHutPoint1.latitude,
    testHutPoint1.longitude,
    testHutPoint1.altitude
  );
  Utils.postHut(
    agent,
    "return 422 because of wrong hutName format",
    422,
    testUser.userId,
    1,
    testHut1.city,
    testHut1.province,
    testHut1.region,
    testHut1.numOfBeds,
    testHut1.cost,
    testHutPoint1.latitude,
    testHutPoint1.longitude,
    testHutPoint1.altitude
  );
  Utils.postHut(
    agent,
    "return 422 because of wrong city format",
    422,
    testUser.userId,
    testHut1.hutName,
    "wrongCityFormat",
    testHut1.province,
    testHut1.region,
    testHut1.numOfBeds,
    testHut1.cost,
    testHutPoint1.latitude,
    testHutPoint1.longitude,
    testHutPoint1.altitude
  );
  Utils.postHut(
    agent,
    "return 422 because of wrong province format",
    422,
    testUser.userId,
    testHut1.hutName,
    testHut1.city,
    "wrongProvinceFormat",
    testHut1.region,
    testHut1.numOfBeds,
    testHut1.cost,
    testHutPoint1.latitude,
    testHutPoint1.longitude,
    testHutPoint1.altitude
  );
  Utils.postHut(
    agent,
    "return 422 because of wrong region format",
    422,
    testUser.userId,
    testHut1.hutName,
    testHut1.city,
    testHut1.province,
    "wrongRegionFormat",
    testHut1.numOfBeds,
    testHut1.cost,
    testHutPoint1.latitude,
    testHutPoint1.longitude,
    testHutPoint1.altitude
  );
  Utils.postHut(
    agent,
    "return 422 because of wrong numOfBeds format",
    422,
    testUser.userId,
    testHut1.hutName,
    testHut1.city,
    testHut1.province,
    testHut1.region,
    "wrongNumOfBedsFormat",
    testHut1.cost,
    testHutPoint1.latitude,
    testHutPoint1.longitude,
    testHutPoint1.altitude
  );
  Utils.postHut(
    agent,
    "return 422 because of wrong cost format",
    422,
    testUser.userId,
    testHut1.hutName,
    testHut1.city,
    testHut1.province,
    testHut1.region,
    testHut1.numOfBeds,
    "wrongCostFormat",
    testHutPoint1.latitude,
    testHutPoint1.longitude,
    testHutPoint1.altitude
  );
  Utils.postHut(
    agent,
    "return 422 because of wrong latitude format",
    422,
    testUser.userId,
    testHut1.hutName,
    testHut1.city,
    testHut1.province,
    testHut1.region,
    testHut1.numOfBeds,
    testHut1.cost,
    "wrongLatitudeFormat",
    testHutPoint1.longitude,
    testHutPoint1.altitude
  );
  Utils.postHut(
    agent,
    "return 422 because of wrong longitude format",
    422,
    testUser.userId,
    testHut1.hutName,
    testHut1.city,
    testHut1.province,
    testHut1.region,
    testHut1.numOfBeds,
    testHut1.cost,
    testHutPoint1.latitude,
    "wrongLongitudeFormat",
    testHutPoint1.altitude
  );
  Utils.postHut(
    agent,
    "return 422 because of wrong altitude format",
    422,
    testUser.userId,
    testHut1.hutName,
    testHut1.city,
    testHut1.province,
    testHut1.region,
    testHut1.numOfBeds,
    testHut1.cost,
    testHutPoint1.latitude,
    testHutPoint1.longitude,
    "wrongAltitudeFormat"
  );
});

/*****************************************************************************************************
 *              GET /api/huts/:hutId
 *****************************************************************************************************/
describe("GET /api/huts/:hutId", function () {
  /* Test Setup */
  this.beforeAll(async () => {
    await Utils.clearAll();
    await Promise.all([
      PersistentManager.store(User.tableName, testUserLocalGuide),
      PersistentManager.store(User.tableName, testUserHiker),
    ]);
    await Promise.all([
      PersistentManager.store(Point.tableName, testHutPoint1),
      PersistentManager.store(Point.tableName, testHutPoint2),
      PersistentManager.store(Point.tableName, testHutPoint3),
    ]);
    await Promise.all([
      PersistentManager.store(Hut.tableName, testHut1),
      PersistentManager.store(Hut.tableName, testHut2),
      PersistentManager.store(Hut.tableName, testHut3),
    ]);
  });

  /* Test Teardown */
  this.afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.getOneHut(agent, "return the hut", 200, credentialsHiker);
  Utils.getOneHut(
    agent,
    "return 401 because of not authenticated user",
    401,
    wrongCredentials
  );
  Utils.getOneHut(
    agent,
    "return 401 because of not authorized user",
    401,
    credentialsLocalGuide
  );
});

/*****************************************************************************************************
 *              GET /api/huts/:hutId
 *****************************************************************************************************/
describe("GET /api/huts/:hutId", function () {
  /* Test Setup */
  this.beforeAll(async () => {
    await Utils.clearAll();
    await Promise.all([
      PersistentManager.store(User.tableName, testUserLocalGuide),
      PersistentManager.store(User.tableName, testUserHiker),
    ]);
    await Promise.all([
      PersistentManager.store(Point.tableName, testHutPoint1),
      PersistentManager.store(Point.tableName, testHutPoint2),
      PersistentManager.store(Point.tableName, testHutPoint3),
    ]);
    await Promise.all([
      PersistentManager.store(Hut.tableName, testHut1),
      PersistentManager.store(Hut.tableName, testHut2),
      PersistentManager.store(Hut.tableName, testHut3),
    ]);
  });

  /* Test Teardown */
  this.afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.getOneHut(agent, "return the hut", 200, credentialsHiker);
  Utils.getOneHut(
    agent,
    "return 401 because of not authenticated user",
    401,
    wrongCredentials
  );
  Utils.getOneHut(
    agent,
    "return 401 because of not authorized user",
    401,
    credentialsLocalGuide
  );
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
