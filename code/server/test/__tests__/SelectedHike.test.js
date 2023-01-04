const PersistentManager = require("../../dao/PersistentManager");
const SelectedHike = require("../../dao/model/SelectedHike");
const Hike = require("../../dao/model/Hike");
const Point = require("../../dao/model/Point");
const User = require("../../dao/model/User");
const Utils = require("../unit-utils");
const dayjs = require("dayjs");


/* Some useful data to use for tests */
const testGpx = "test.gpx";
const testUser = new User(1, "test@email.it", "testSalt", "testPassword", null, "testFirstname", "testLastname", "390123456789", "Hiker", 1);
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
 *              storeSelectedHike()
 *****************************************************************************************************/
describe("Test storeSelectedHike", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
    await Promise.all([
      PersistentManager.store(Point.tableName, testStartPoint1),
      PersistentManager.store(Point.tableName, testEndPoint1),
    ]);
    await PersistentManager.store(Hike.tableName, testHike1);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testStoreSelectedHike("store the selected hike successfully", testSelectedHike1);
  Utils.testStoreSelectedHike(
    "reject because of not existing hikeId foreign key",
    { ...testSelectedHike1, hikeId: notExistingHike },
    404
  );
  Utils.testStoreSelectedHike(
    "reject because of not existing hikerId foreign key",
    { ...testSelectedHike1, hikerId: notExistingUser },
    404
  );
});

/*****************************************************************************************************
 *              updateSelectedHike()
 *****************************************************************************************************/
describe("Test updateSelectedHike", () => {
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
      PersistentManager.store(Point.tableName, testEndPoint3),
    ]);
    await Promise.all([
      PersistentManager.store(Hike.tableName, testHike1),
      PersistentManager.store(Hike.tableName, testHike2),
      PersistentManager.store(Hike.tableName, testHike3),
    ]);
    await Promise.all([
      PersistentManager.store(SelectedHike.tableName, testSelectedHike1),
      PersistentManager.store(SelectedHike.tableName, testSelectedHike2),
      PersistentManager.store(SelectedHike.tableName, testSelectedHike3),
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testUpdateSelectedHike(
    "update the hike",
    { ...testSelectedHike1, status: "updatedStatus" },
    "selectedHikeId",
    testSelectedHike1.selectedHikeId
  );
  Utils.testUpdateSelectedHike(
    "reject because of not existing selected hike with attributeName = value",
    { ...testSelectedHike1, status: "updatedStatus" },
    "selectedHikeId",
    notExistingSelectedHike,
    404
  );
  Utils.testUpdateSelectedHike(
    "reject because of not existing hikeId foreign key",
    { ...testSelectedHike1, hikeId: notExistingHike },
    "selectedHikeId",
    testSelectedHike1.selectedHikeId,
    404
  );
  Utils.testUpdateSelectedHike(
    "reject because of not existing hikerId foreign key",
    { ...testSelectedHike1, hikerId: notExistingUser },
    "selectedHikeId",
    testSelectedHike1.selectedHikeId,
    404
  );
});

/*****************************************************************************************************
 *              existsSelectedHike()
 *****************************************************************************************************/
describe("Test existsSelectedHike", () => {
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
      PersistentManager.store(Point.tableName, testEndPoint3),
    ]);
    await Promise.all([
      PersistentManager.store(Hike.tableName, testHike1),
      PersistentManager.store(Hike.tableName, testHike2),
      PersistentManager.store(Hike.tableName, testHike3),
    ]);
    await Promise.all([
      PersistentManager.store(SelectedHike.tableName, testSelectedHike1),
      PersistentManager.store(SelectedHike.tableName, testSelectedHike2),
      PersistentManager.store(SelectedHike.tableName, testSelectedHike3),
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testExistsSelectedHike("return true", "selectedHikeId", testSelectedHike1.selectedHikeId, true);
  Utils.testExistsSelectedHike("return false", "selectedHikeId", notExistingSelectedHike, false);
});

/*****************************************************************************************************
 *              loadOneByAttributeSelectedHike()
 *****************************************************************************************************/
describe("Test loadOneByAttributeSelectedHike", () => {
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
      PersistentManager.store(Point.tableName, testEndPoint3),
    ]);
    await Promise.all([
      PersistentManager.store(Hike.tableName, testHike1),
      PersistentManager.store(Hike.tableName, testHike2),
      PersistentManager.store(Hike.tableName, testHike3),
    ]);
    await Promise.all([
      PersistentManager.store(SelectedHike.tableName, testSelectedHike1),
      PersistentManager.store(SelectedHike.tableName, testSelectedHike2),
      PersistentManager.store(SelectedHike.tableName, testSelectedHike3),
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testLoadOneByAttributeSelectedHike(
    "load a selected hike by attribute",
    "selectedHikeId",
    testSelectedHike1.selectedHikeId
  );
  Utils.testLoadOneByAttributeSelectedHike(
    "reject because of non existing selected hike",
    "selectedHikeId",
    notExistingSelectedHike,
    404
  );
});

/*****************************************************************************************************
 *              loadAllByAttributeSelectedHike()
 *****************************************************************************************************/
describe("Test loadAllByAttributeSelectedHike", () => {
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
      PersistentManager.store(Point.tableName, testEndPoint3),
    ]);
    await Promise.all([
      PersistentManager.store(Hike.tableName, testHike1),
      PersistentManager.store(Hike.tableName, testHike2),
      PersistentManager.store(Hike.tableName, testHike3),
    ]);
    await Promise.all([
      PersistentManager.store(SelectedHike.tableName, testSelectedHike1),
      PersistentManager.store(SelectedHike.tableName, testSelectedHike2),
      PersistentManager.store(SelectedHike.tableName, testSelectedHike3),
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testLoadAllByAttributeSelectedHike(
    "load all selected hikes by attribute",
    "hikerId",
    testUser.userId
  );
});

/*****************************************************************************************************
 *              terminateHike()
 *****************************************************************************************************/
describe("Test terminateHike", () => {
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
      PersistentManager.store(Point.tableName, testEndPoint3),
    ]);
    await Promise.all([
      PersistentManager.store(Hike.tableName, testHike1),
      PersistentManager.store(Hike.tableName, testHike2),
      PersistentManager.store(Hike.tableName, testHike3),
    ]);
    await Promise.all([
      PersistentManager.store(SelectedHike.tableName, testSelectedHike1),
      PersistentManager.store(SelectedHike.tableName, testSelectedHike2),
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testTerminateHike(
    "terminate the hike",
    testSelectedHike1.selectedHikeId,
    testSelectedHike3.endTime
  );
  Utils.testTerminateHike(
    "reject because of startTime after endTime",
    testSelectedHike1.selectedHikeId,
    dayjs(testSelectedHike1.startTime, "DD/MM/YYYY, HH:mm:ss").subtract(1, "hours").format('DD/MM/YYYY, HH:mm:ss').toString(),
    422
  );
});

