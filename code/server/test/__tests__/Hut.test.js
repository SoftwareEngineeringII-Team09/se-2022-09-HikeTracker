const PersistentManager = require("../../dao/PersistentManager");
const Point = require("../../dao/model/Point");
const User = require("../../dao/model/User");
const HutDailySchedule = require("../../dao/model/HutDailySchedule");
const Utils = require("../unit-utils");
const Hut = require("../../dao/model/Hut");

/* Some useful data to use for tests */
const testUser = new User(1, "test@email.it", "testSalt", "testPassword", null, "testFirstname", "testLastname", "390123456789", "testRole", 1);
const pointHut1 = new Point(1, "start point", 0, 1, null, 10.0, 10.0, 10.0);
const pointHut2 = new Point(
  2,
  "reference point",
  0,
  1,
  null,
  13.3245,
  24.678,
  4444.5675
);
const pointHut3 = new Point(
  3,
  "reference point",
  0,
  1,
  null,
  24.768,
  35.87968,
  499.647574
);

const Hut1DailySchedule = new HutDailySchedule(1, 1, "9:00", "13:00");

const testHut1 = new Hut(
  1,
  "hutTestName1",
  pointHut1.pointId,
  testUser.userId,
  4017,
  2,
  1,
  50,
  20
);

const testHut2 = new Hut(
  2,
  "hutTestName1",
  pointHut2.pointId,
  testUser.userId,
  4017,
  2,
  1,
  50,
  20
);

const testHut3 = new Hut(
  3,
  "hutTestName1",
  pointHut3.pointId,
  testUser.userId,
  4017,
  2,
  1,
  50,
  20
);
const testHuts = [testHut1, testHut2, testHut3];
const nonExistPointId = 789999;
const notExistingUser = testUser.userId + 66;
const notExistHutId = 4534353;
const expectedGetAllHutsProperties = [
  "hutId",
  "hutName",
  "city",
  "province",
  "region",
  "numOfBeds",
  "cost",
  "latitude",
  "longitude",
  "altitude",
  "schedule",
];

/*****************************************************************************************************
 *              storeHut()
 *****************************************************************************************************/
describe("Test storeHut", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
    await Promise.all([
      PersistentManager.store(User.tableName, testUser),
      PersistentManager.store(Point.tableName, pointHut1),
      PersistentManager.store(Point.tableName, pointHut2),
      PersistentManager.store(Point.tableName, pointHut3),
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testStoreHut("store the hut successfully", testHut1);
  Utils.testStoreHut(
    "reject because of not existing point",
    { ...testHut1, pointId: nonExistPointId },
    404
  );

  Utils.testStoreHut(
    "reject because of not existing writerId foreign key",
    { ...testHut1, writerId: notExistingUser },
    404
  );
});

/*****************************************************************************************************
 *              existsHut()
 *****************************************************************************************************/
describe("Test existsHut", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();

    await Promise.all([
      PersistentManager.store(User.tableName, testUser),
      PersistentManager.store(Point.tableName, pointHut1),
      PersistentManager.store(Point.tableName, pointHut2),
      PersistentManager.store(Point.tableName, pointHut3),
    ]);
    await Promise.all([
      PersistentManager.store(Hut.tableName, testHut1),
      PersistentManager.store(Hut.tableName, testHut2),
      PersistentManager.store(Hut.tableName, testHut3),
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testExistsHut("return true", "hutId", testHut1.hutId, true);
  Utils.testExistsHut("return false", "hutId", notExistHutId, false);
});

/*****************************************************************************************************
 *              loadOneByAttributeHut()
 *****************************************************************************************************/
// describe("Test loadOneByAttributeHut", () => {
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
 *              defineHut()
 *****************************************************************************************************/
describe("Test defineHut", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
    // TODO: insert here if you need other test teardown function calls
  });

  Utils.testDefineHut(
    "define a hut",
    testHut1.hutName,
    testUser.userId,
    testHut1.city,
    testHut1.province,
    testHut1.region,
    testHut1.numOfBeds,
    testHut1.cost,
    pointHut1.latitude,
    pointHut1.longitude,
    pointHut1.altitude
  );
  Utils.testDefineHut(
    "reject because of not existing writerId foreign key",
    testHut1.hutName,
    notExistingUser,
    testHut1.city,
    testHut1.province,
    testHut1.region,
    testHut1.numOfBeds,
    testHut1.cost,
    pointHut1.latitude,
    pointHut1.longitude,
    pointHut1.altitude,
    404
  );
});

/*****************************************************************************************************
 *              getAllHuts()
 *****************************************************************************************************/
describe("Test getAllHuts", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();

    await Promise.all([
      PersistentManager.store(User.tableName, testUser),
      PersistentManager.store(Point.tableName, pointHut1),
      PersistentManager.store(Point.tableName, pointHut2),
      PersistentManager.store(Point.tableName, pointHut3),
    ]);
    await Promise.all([
      PersistentManager.store(Hut.tableName, testHut1),
      PersistentManager.store(Hut.tableName, testHut2),
      PersistentManager.store(Hut.tableName, testHut3),
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testGetAllHuts(
    "get all huts",
    testHuts.length,
    expectedGetAllHutsProperties
  );
});
