
const PersistentManager = require("../../dao/PersistentManager");
const Point = require("../../dao/model/Point");
const Hike = require("../../dao/model/Hike");
const User = require("../../dao/model/User");
const Hut = require("../../dao/model/Hut");
const HikeHut = require("../../dao/model/HikeHut");
const Utils = require("../unit-utils");


const testUser = new User(1, "test@email.it", "testSalt", "testPassword", null, "testFirstname", "testLastname", "390123456789", "testRole", 1);
const testGpx = "test.gpx";
const testStartPoint1 = new Point(1, "start point", 0, 0, "Start point of testHike1", 10.000, 10.000);
const testEndPoint1 = new Point(2, "end point", 0, 0, "End point of testHike1", 10.010, 10.010);
const testHike1 = new Hike(1, "testTitle1", testUser.userId, `gpx/${testGpx}`, 1, 1, 1, 10.0, "01:01", 10.0, 10.0, "testDifficulty1", "testDescription1", testStartPoint1.pointId, testEndPoint1.pointId);
const testHutPoint1 = new Point(3, "hut", 0, 1, null, 10.0, 10.0);
const testHutPoint2 = new Point(4, "hut", 0, 1, null, 20.0, 20.0);
const testHutPoint3 = new Point(5, "hut", 0, 1, null, 30.0, 30.0);
const testHut1 = new Hut(1, "testHutName1", testHutPoint1.pointId, testUser.userId, 1, 1, 1, 10, 10.0, 1000.0, "391012345678", "testHutEmail1@email.com", "www.testHutWebSite1.com");
const testHut2 = new Hut(2, "testHutName2", testHutPoint2.pointId, testUser.userId, 2, 2, 2, 20, 20.0, 2000.0, "392012345678", "testHutEmail2@email.com", "www.testHutWebSite2.com");
const testHut3 = new Hut(3, "testHutName3", testHutPoint3.pointId, testUser.userId, 3, 3, 3, 30, 30.0, 3000.0, "393012345678", "testHutEmail3@email.com", "www.testHutWebSite3.com");
const testHikeHut1 = new HikeHut(testHike1.hikeId, testHut1.hutId);
const testHikeHut2 = new HikeHut(testHike1.hikeId, testHut2.hutId);
const testHikeHut3 = new HikeHut(testHike1.hikeId, testHut3.hutId);
const testHikeHuts = [testHikeHut1, testHikeHut2, testHikeHut3];
const newHutIdList = [1];
const notExistingHike = testHike1.hikeId + 1;
const notExistingHut = testHut1.hutId + testHut2.hutId + testHut3.hutId;


/*****************************************************************************************************
 *              storeHikeHut()
 *****************************************************************************************************/
describe("Test storeHikeHut", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
    await Promise.all([
      PersistentManager.store(Point.tableName, testStartPoint1),
      PersistentManager.store(Point.tableName, testEndPoint1),
      PersistentManager.store(Point.tableName, testHutPoint1)
    ]);
    await PersistentManager.store(Hike.tableName, testHike1);
    await PersistentManager.store(Hut.tableName, testHut1);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testStoreHikeHut("store the hike-hut successfully", testHikeHut1);
  Utils.testStoreHikeHut("reject because of not existing hikeId foreign key", { ...testHikeHut1, hikeId: notExistingHike }, 404);
  Utils.testStoreHikeHut("reject because of not existing hutId foreign key", { ...testHikeHut1, hutId: notExistingHut }, 404);
});


/*****************************************************************************************************
 *              deleteHikeHut()
 *****************************************************************************************************/
describe("Test deleteHikeHut", () => {
  /* Test Setup */
  beforeEach(async () => {
    await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
    await Promise.all([
      PersistentManager.store(Point.tableName, testStartPoint1),
      PersistentManager.store(Point.tableName, testEndPoint1),
      PersistentManager.store(Point.tableName, testHutPoint1),
      PersistentManager.store(Point.tableName, testHutPoint2),
      PersistentManager.store(Point.tableName, testHutPoint3)
    ]);
    await PersistentManager.store(Hike.tableName, testHike1);
    await Promise.all([
      PersistentManager.store(Hut.tableName, testHut1),
      PersistentManager.store(Hut.tableName, testHut2),
      PersistentManager.store(Hut.tableName, testHut3),
    ]);
    await Promise.all([
      PersistentManager.store(HikeHut.tableName, testHikeHut1),
      PersistentManager.store(HikeHut.tableName, testHikeHut2),
      PersistentManager.store(HikeHut.tableName, testHikeHut3),
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testDeleteHikeHut(
    "delete the hike-huts with attributeName = value",
    "hikeId",
    testHike1.hikeId
  );
  Utils.testDeleteHikeHut(
    "delete the hike-huts with attributeName = value",
    "hutId",
    testHut1.hutId
  );
});


/*****************************************************************************************************
 *              existsHikeHut()
 *****************************************************************************************************/
describe("Test existsHikeHut", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
    await Promise.all([
      PersistentManager.store(Point.tableName, testStartPoint1),
      PersistentManager.store(Point.tableName, testEndPoint1),
      PersistentManager.store(Point.tableName, testHutPoint1),
      PersistentManager.store(Point.tableName, testHutPoint2),
      PersistentManager.store(Point.tableName, testHutPoint3)
    ]);
    await PersistentManager.store(Hike.tableName, testHike1);
    await Promise.all([
      PersistentManager.store(Hut.tableName, testHut1),
      PersistentManager.store(Hut.tableName, testHut2),
      PersistentManager.store(Hut.tableName, testHut3),
    ]);
    await Promise.all([
      PersistentManager.store(HikeHut.tableName, testHikeHut1),
      PersistentManager.store(HikeHut.tableName, testHikeHut2),
      PersistentManager.store(HikeHut.tableName, testHikeHut3),
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testExistsHikeHut("return true", "hikeId", testHike1.hikeId, true);
  Utils.testExistsHikeHut("return true", "hutId", testHut1.hutId, true);
  Utils.testExistsHikeHut("return false", "hikeId", notExistingHike, false);
  Utils.testExistsHikeHut("return false", "hutId", notExistingHut, false);
});


/*****************************************************************************************************
 *              loadAllByAttributeHikeHut()
 *****************************************************************************************************/
describe("Test loadAllByAttributeHikeHut", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
    await Promise.all([
      PersistentManager.store(Point.tableName, testStartPoint1),
      PersistentManager.store(Point.tableName, testEndPoint1),
      PersistentManager.store(Point.tableName, testHutPoint1),
      PersistentManager.store(Point.tableName, testHutPoint2),
      PersistentManager.store(Point.tableName, testHutPoint3)
    ]);
    await PersistentManager.store(Hike.tableName, testHike1);
    await Promise.all([
      PersistentManager.store(Hut.tableName, testHut1),
      PersistentManager.store(Hut.tableName, testHut2),
      PersistentManager.store(Hut.tableName, testHut3),
    ]);
    await Promise.all([
      PersistentManager.store(HikeHut.tableName, testHikeHut1),
      PersistentManager.store(HikeHut.tableName, testHikeHut2),
      PersistentManager.store(HikeHut.tableName, testHikeHut3),
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testLoadAllByAttributeHikeHut(
    "load all hike-huts by attribute",
    "hikeID",
    testHike1.hikeId
  );
  Utils.testLoadAllByAttributeHikeHut(
    "load all hike-huts by attribute",
    "hutId",
    testHut1.hutId
  );
});


/*****************************************************************************************************
 *             updatehutId()
 *****************************************************************************************************/
 describe("Test put hutId", () => {
    /* Test Setup */
    beforeAll(async () => {
      await Utils.clearAll();
      await PersistentManager.store(User.tableName, testUser);
      await Promise.all([
        PersistentManager.store(Point.tableName, testStartPoint1),
        PersistentManager.store(Point.tableName, testEndPoint1),
        PersistentManager.store(Point.tableName, testHutPoint1),
      ]);
      await Promise.all([
        PersistentManager.store(Hike.tableName, testHike1),
        PersistentManager.store(Hut.tableName, testHut1),
       
      ]);
    });
  
    /* Test Teardown */
    afterAll(async () => {
      await Utils.clearAll();
    });
  
    Utils.testUpdateHutId("update the hutId successfully", testHike1.hikeId, newHutIdList);
    
  });
  