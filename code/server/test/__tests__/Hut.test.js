const PersistentManager = require("../../dao/PersistentManager");
const Point = require("../../dao/model/Point");
const User = require("../../dao/model/User");
const HutDailySchedule = require("../../dao/model/HutDailySchedule");
const Utils = require("../unit-utils");
const Hut = require("../../dao/model/Hut");

/* Some useful data to use for tests */
const testUser = new User(1, "test@email.it", "testSalt", "testPassword", null, "testFirstname", "testLastname", "390123456789", "testRole", 1);
const pointHut1 = new Point(1, "start point", 0, 1, null, 10.0, 10.0);
const pointHut2 = new Point(
  2,
  "reference point",
  0,
  1,
  null,
  13.3245,
  24.678
);
const pointHut3 = new Point(
  3,
  "reference point",
  0,
  1,
  null,
  24.768,
  35.87968
);

const Hut1DailySchedule = new HutDailySchedule(1, 1, "9:00", "13:00");
const testHutImage = "hut1.jpg";
const testHut1 = new Hut(
  1,
  "hutTestName1",
  pointHut1.pointId,
  testUser.userId,
  4017,
  2,
  1,
  50,
  20,
  1000.0,
  "391012345678", 
  "testHutEmail1@email1.com", 
  "www.testHutWebSite1.com",
  `hutImage/${testHutImage}`
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
  20,
  2000.0,
  "392012345678", 
  "testHutEmail1@email2.com", 
  "www.testHutWebSite2.com",
  `hutImage/${testHutImage}`
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
  20,
  3000.0,
  "393012345678", 
  "testHutEmail1@email3.com", 
  "www.testHutWebSite3.com",
  `hutImage/${testHutImage}`
);
const testHuts = [testHut1, testHut2, testHut3];
const notExistingPoint = pointHut1.pointId + pointHut2.pointId + pointHut3.pointId;
const notExistingUser = testUser.userId + 66;
const notExistingHut = testHut1.hutId + testHut2.hutId + testHut3.hutId;
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
  "phone",
  "email",
  "website",
  "schedule",
  "hutImage"
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
    { ...testHut1, pointId: notExistingPoint },
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
  Utils.testExistsHut("return false", "hutId", notExistingHut, false);
});

/*****************************************************************************************************
 *              loadOneByAttributeHut()
 *****************************************************************************************************/
describe("Test loadOneByAttributeHut", () => {
	beforeAll(async () => {
    await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
    await Promise.all([
      PersistentManager.store(Point.tableName, pointHut1),
      PersistentManager.store(Point.tableName, pointHut2),
      PersistentManager.store(Point.tableName, pointHut3)
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

	Utils.testLoadOneByAttributeHut(
    "load a hut by attribute",
    "hutId",
    testHut1.hutId
  );
  Utils.testLoadOneByAttributeHut(
    "reject because of not existing hut",
    "hutId",
    notExistingHut,
    404
  );
})

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
    // Insert here if you need other test teardown function calls
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
    testHut1.altitude,
    testHut1.phone,
    testHut1.email,
    testHut1.website, 
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
    testHut1.altitude,
    testHut1.phone,
    testHut1.email,
    testHut1.website,
    404
  );
});


/*****************************************************************************************************
 *              getHutById()
 *****************************************************************************************************/
describe("Test getHutById", () => {
	beforeAll(async () => {
    await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
    await Promise.all([
      PersistentManager.store(Point.tableName, pointHut1),
      PersistentManager.store(Point.tableName, pointHut2),
      PersistentManager.store(Point.tableName, pointHut3)
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

	Utils.testGetHutById(
    "get a hut by hutId",
    testHut1.hutId
  );
})


/*****************************************************************************************************
 *              getHutByPointId()
 *****************************************************************************************************/
describe("Test getHutByPointId", () => {
	beforeAll(async () => {
    await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
    await Promise.all([
      PersistentManager.store(Point.tableName, pointHut1),
      PersistentManager.store(Point.tableName, pointHut2),
      PersistentManager.store(Point.tableName, pointHut3)
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

	Utils.testGetHutByPointId(
    "get a hut by pointId",
    testHut1.pointId
  );
})


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
