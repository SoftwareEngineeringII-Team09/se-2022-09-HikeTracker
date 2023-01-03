const PersistentManager = require("../../dao/PersistentManager");
const Point = require("../../dao/model/Point");
const Hike = require("../../dao/model/Hike");
const User = require("../../dao/model/User");
const Hut = require("../../dao/model/Hut");
const ParkingLot = require("../../dao/model/ParkingLot");
const HikeHut = require("../../dao/model/HikeHut");
const HikeRefPoint = require("../../dao/model/HikeRefPoint");
const Utils = require("../unit-utils");

/* Some useful data to use for tests */
const testGpx = "test.gpx";
const testEditableGpx = "test_editable.gpx";
const testHikeImage = "hike1.jpg";
const testHutImage = "hut1.jpg";
const testUser = new User(1, "test@email.it", "testSalt", "testPassword", null, "testFirstname", "testLastname", "390123456789", "testRole", 1);
const testStartPoint1 = new Point(1, "start point", 0, 0, "Start point of testHike1", 10.000, 10.000);
const testEndPoint1 = new Point( 2,"end point",0,0,"End point of testHike1", 10.010, 10.010);
const testStartPoint2 = new Point(3, "start point", 0, 0, "Start point of testHike2", 30.0, 30.0);
const testEndPoint2 = new Point(4, "end point", 0, 0, "End point of testHike2", 40.0, 40.0);
const testStartPoint3 = new Point(5, "start point", 0, 0, "Start point of testHike3", 50.0, 50.0);
const testEndPoint3 = new Point(6, "end point", 0, 0, "End point of testHike3", 60.0, 60.0);
const testHike1 = new Hike(1, "testTitle1", testUser.userId, `gpx/${testGpx}`, 1, 1, 1, 10.0, "01:01", 10.0, 10.0, "testDifficulty1", "testDescription1", testStartPoint1.pointId, testEndPoint1.pointId,`hikeImage/${testHikeImage}`);
const testHike2 = new Hike(2, "testTitle2", testUser.userId, `gpx/${testGpx}`, 2, 2, 2, 20.0, "02:02", 20.0, 20.0, "testDifficulty2", "testDescription2", testStartPoint2.pointId, testEndPoint2.pointId,`hikeImage/${testHikeImage}`);
const testHike3 = new Hike(3, "testTitle3", testUser.userId, `gpx/${testGpx}`, 3, 3, 3, 30.0, "03:03", 30.0, 30.0, "testDifficulty3", "testDescription3", testStartPoint3.pointId, testEndPoint3.pointId,`hikeImage/${testHikeImage}`);
const testHikes = [testHike1, testHike2, testHike3];
const notExistingHike = testHike1.hikeId + testHike2.hikeId + testHike3.hikeId;
const notExistingPoint = testStartPoint1.pointId + testStartPoint2.pointId + testStartPoint3.pointId + testEndPoint1.pointId + testEndPoint2.pointId + testEndPoint3.pointId;
const notExistingUser = testUser.userId + 1;
const expectedGetAllHikesProperties = [ "hikeId", "title", "writer", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint"];
const expectedGetHikeByIdProperties = [ "hikeId", "title", "writer", "city", "province", "region", "length", "expectedTime", "ascent", "maxElevation", "difficulty", "description", "startPoint", "endPoint", "huts", "referencePoints", "track"];
const testHutPoint1 = new Point(7, "hut", 0, 1, null, 10.001, 10.001);
const testHutPoint2 = new Point(8, "hut", 0, 1, null, 10.005, 10.005);
const testHutPoint3 = new Point(9, "hut", 0, 1, null, 10.006, 10.006);
const testHutPoint4 = new Point(10, "hut", 0, 1, null, 10.009, 10.009);
const testParkingLotPoint1 = new Point(11, "parking lot", 1, 0, null, 10.001, 10.001);
const testParkingLotPoint2 = new Point(12, "parking lot", 1, 0, null, 10.005, 10.005);
const testParkingLotPoint3 = new Point(13, "parking lot", 1, 0, null, 10.006, 10.006);
const testParkingLotPoint4 = new Point(14, "parking lot", 1, 0, null, 10.009, 10.009);
const testHut1 = new Hut(1, "testHutName1", testHutPoint1.pointId, testUser.userId, 1, 1, 1, 10, 10.0, 1000.0, "391012345678", "testHutEmail1@email.com", "www.testHutWebSite1.com",`hutImage/${testHutImage}`);
const testHut2 = new Hut(2, "testHutName2", testHutPoint2.pointId, testUser.userId, 2, 2, 2, 20, 20.0, 2000.0, "392012345678", "testHutEmail2@email.com", "www.testHutWebSite2.com",`hutImage/${testHutImage}`);
const testHut3 = new Hut(3, "testHutName3", testHutPoint3.pointId, testUser.userId, 3, 3, 3, 30, 30.0, 3000.0, "393012345678", "testHutEmail3@email.com", "www.testHutWebSite3.com",`hutImage/${testHutImage}`);
const testHut4 = new Hut(4, "testHutName4", testHutPoint4.pointId, testUser.userId, 4, 4, 4, 40, 40.0, 4000.0, "394012345678", "testHutEmail4@email.com", "www.testHutWebSite4.com",`hutImage/${testHutImage}`);
const testPotHutPoint1 = new Point(15, "hut", 0, 1, null, 45.178591, 7.08);
const testPotHut1 = new Hut(5, "testHutName5", testPotHutPoint1.pointId, testUser.userId, 4, 4, 4, 40, 40.0, 4000.0, "394012345678", "testHutEmail5@email.com", "www.testHutWebSite5.com");
const testParkingLot1 = new ParkingLot(1, "testParkingLotName1", testParkingLotPoint1.pointId, testUser.userId, 1000.0, 100);
const testParkingLot2 = new ParkingLot(2, "testParkingLotName2", testParkingLotPoint2.pointId, testUser.userId, 2000.0, 200);
const testParkingLot3 = new ParkingLot(3, "testParkingLotName3", testParkingLotPoint3.pointId, testUser.userId, 3000.0, 300);
const testParkingLot4 = new ParkingLot(4, "testParkingLotName4", testParkingLotPoint4.pointId, testUser.userId, 4000.0, 400);
const testRefPoint = new Point(16, "reference point", 0, 0, "testRefPointName", 10.0, 10.0);
const testHikeRefPoint = new HikeRefPoint(testHike1.hikeId, testRefPoint.pointId);
const testHikeHut = new HikeHut(testHike1.hikeId, testHut1.hutId);
const testNewStartEndPointHut = { type: "hut", id: testHut1.hutId };
const testNewStartEndPointParkingLot = { type: "parking lot", id: testParkingLot1.parkingLotId };
const expectedGetPotentialStartEndPointsProperties = ["potentialStartPoints", "potentialEndPoints"];
const expectedGetPotentialHutProperties = ["potentialHuts"];

/*****************************************************************************************************
 *              storeHike()
 *****************************************************************************************************/
describe("Test storeHike", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
    await Promise.all([
      PersistentManager.store(Point.tableName, testStartPoint1),
      PersistentManager.store(Point.tableName, testEndPoint1),
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testStoreHike("store the hike successfully", testHike1);
  Utils.testStoreHike(
    "reject because of not existing startPoint foreign key",
    { ...testHike1, startPoint: notExistingPoint },
    404
  );
  Utils.testStoreHike(
    "reject because of not existing endPoint foreign key",
    { ...testHike1, endPoint: notExistingPoint },
    404
  );
  Utils.testStoreHike(
    "reject because of not existing writerId foreign key",
    { ...testHike1, writerId: notExistingUser },
    404
  );
});

/*****************************************************************************************************
 *              updateHike()
 *****************************************************************************************************/
describe("Test updateHike", () => {
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
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testUpdateHike(
    "update the hike",
    { ...testHike1, title: "updatedTitle" },
    "hikeId",
    testHike1.hikeId
  );
  Utils.testUpdateHike(
    "reject because of not existing hike with attributeName = value",
    { ...testHike1, title: "updatedTitle" },
    "hikeId",
    notExistingHike,
    404
  );
  Utils.testUpdateHike(
    "reject because of not existing writerId foreign key",
    { ...testHike1, writerId: notExistingUser },
    "hikeId",
    testHike1.hikeId,
    404
  );
  Utils.testUpdateHike(
    "reject because of not existing startPoint foreign key",
    { ...testHike1, startPoint: notExistingPoint },
    "hikeId",
    testHike1.hikeId,
    404
  );
  Utils.testUpdateHike(
    "reject because of not existing endPoint foreign key",
    { ...testHike1, endPoint: notExistingPoint },
    "hikeId",
    testHike1.hikeId,
    404
  );
});

/*****************************************************************************************************
 *              deleteHike()
 *****************************************************************************************************/
describe("Test deleteHike", () => {
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
      PersistentManager.store(Point.tableName, testEndPoint3)
    ]);
    await Promise.all([
      PersistentManager.store(Hike.tableName, testHike1),
      PersistentManager.store(Hike.tableName, testHike2),
      PersistentManager.store(Hike.tableName, testHike3)
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testDeleteHike(
    "delete the hikes with attributeName = value",
    "hikeId",
    testHike1.hikeId
  );
});

/*****************************************************************************************************
 *              deleteAllHike()
 *****************************************************************************************************/
describe("Test deleteAllHike", () => {
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
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testDeleteAllHike("delete all hikes");
});

/*****************************************************************************************************
 *              loadAllHike()
 *****************************************************************************************************/
describe("Test loadAllHike", () => {
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
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testLoadAllHike("load all hikes", testHikes.length);
});

/*****************************************************************************************************
 *              existsHike()
 *****************************************************************************************************/
describe("Test existsHike", () => {
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
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testExistsHike("return true", "hikeId", testHike1.hikeId, true);
  Utils.testExistsHike("return false", "hikeId", notExistingHike, false);
});

/*****************************************************************************************************
 *              loadOneByAttributeHike()
 *****************************************************************************************************/
describe("Test loadOneByAttributeHike", () => {
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
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testLoadOneByAttributeHike(
    "load a hike by attribute",
    "hikeId",
    testHike1.hikeId
  );
  Utils.testLoadOneByAttributeHike(
    "reject because of non existing hike",
    "hikeId",
    notExistingHike,
    404
  );
});

/*****************************************************************************************************
 *              loadAllByAttributeHike()
 *****************************************************************************************************/
describe("Test loadAllByAttributeHike", () => {
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
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testLoadAllByAttributeHike(
    "load all hikes by attribute",
    "writerId",
    testUser.userId
  );
});

/*****************************************************************************************************
 *              defineHike()
 *****************************************************************************************************/
describe("Test defineHike", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();

    await Promise.all([
      PersistentManager.store(User.tableName, testUser),
      PersistentManager.store(Point.tableName, testStartPoint1),
      PersistentManager.store(Point.tableName, testEndPoint1),
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testDefineHike(
    "define hike",
    testHike1.writerId,
    testHike1.title,
    testHike1.expectedTime,
    testHike1.difficulty,
    testHike1.description,
    testHike1.city,
    testHike1.province,
    testHike1.region,
    testGpx,
    testHikeImage,
  );

  Utils.testDefineHike(
    "reject because of not existing writerId foreign key",
    notExistingUser,
    testHike1.title,
    testHike1.expectedTime,
    testHike1.difficulty,
    testHike1.description,
    testHike1.city,
    testHike1.province,
    testHike1.region,
    testGpx,
    testHikeImage,
    404
  );
});

/*****************************************************************************************************
 *              getAllHikes()
 *****************************************************************************************************/
describe("Test getAllHikes", () => {
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
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testGetAllHikes(
    "get all hikes",
    testHikes.length,
    expectedGetAllHikesProperties
  );
});

/*****************************************************************************************************
 *              getHikeById()
 *****************************************************************************************************/
describe("Test getHikeById", () => {
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
      PersistentManager.store(Point.tableName, testHutPoint1),
      PersistentManager.store(Point.tableName, testParkingLotPoint1),
      PersistentManager.store(Point.tableName, testHutPoint2),
      PersistentManager.store(Point.tableName, testParkingLotPoint2),
      PersistentManager.store(Point.tableName, testRefPoint)
    ]);
    await Promise.all([
      PersistentManager.store(Hike.tableName, testHike1),
      PersistentManager.store(Hike.tableName, { ...testHike2, startPoint: testHutPoint1.pointId, endPoint: testHutPoint2.pointId }),
      PersistentManager.store(Hike.tableName, { ...testHike3, startPoint: testParkingLotPoint1.pointId, endPoint: testParkingLotPoint2.pointId }),
    ]);
    await Promise.all([
      PersistentManager.store(Hut.tableName, testHut1),
      PersistentManager.store(Hut.tableName, testHut2),
      PersistentManager.store(ParkingLot.tableName, testParkingLot1),
      PersistentManager.store(ParkingLot.tableName, testParkingLot2)
    ]);
    await PersistentManager.store(HikeHut.tableName, testHikeHut);
    await PersistentManager.store(HikeRefPoint.tableName, testHikeRefPoint);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testGetHikeByHikeId(
    "get a hike by hikeId",
    testHike1.hikeId,
    expectedGetHikeByIdProperties
  );
  Utils.testGetHikeByHikeId(
    "get a hike by hikeId with huts as start and end points",
    testHike2.hikeId,
    expectedGetHikeByIdProperties
  );
  Utils.testGetHikeByHikeId(
    "get a hike by hikeId with a parking lot as start and end points",
    testHike3.hikeId,
    expectedGetHikeByIdProperties
  );
});

/*****************************************************************************************************
 *              getGpxPath()
 *****************************************************************************************************/
describe("Test getGpxPath", () => {
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
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testGetGpxPath(
    "get a gpx path by hikeId",
    testHike1.hikeId,
    testHike1.trackPath,
    null
  );
  Utils.testGetGpxPath(
    "reject because of not existing hike with hikeId = hikeId",
    notExistingHike,
    null,
    404
  );
});


/*****************************************************************************************************
 *              getPotentialStartEndPoints()
 *****************************************************************************************************/
describe("Test getPotentialStartEndPoints", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
    await Promise.all([
      PersistentManager.store(Point.tableName, testStartPoint1),
      PersistentManager.store(Point.tableName, testEndPoint1),
      PersistentManager.store(Point.tableName, testHutPoint1),
      PersistentManager.store(Point.tableName, testHutPoint2),
      PersistentManager.store(Point.tableName, testHutPoint3),
      PersistentManager.store(Point.tableName, testHutPoint4),
      PersistentManager.store(Point.tableName, testParkingLotPoint1),
      PersistentManager.store(Point.tableName, testParkingLotPoint2),
      PersistentManager.store(Point.tableName, testParkingLotPoint3),
      PersistentManager.store(Point.tableName, testParkingLotPoint4)
    ]);
    await Promise.all([
      PersistentManager.store(Hike.tableName, testHike1),
    ]);
    await Promise.all([
      PersistentManager.store(Hut.tableName, testHut1),
      PersistentManager.store(Hut.tableName, testHut2),
      PersistentManager.store(Hut.tableName, testHut3),
      PersistentManager.store(Hut.tableName, testHut4),
      PersistentManager.store(ParkingLot.tableName, testParkingLot1),
      PersistentManager.store(ParkingLot.tableName, testParkingLot2),
      PersistentManager.store(ParkingLot.tableName, testParkingLot3),
      PersistentManager.store(ParkingLot.tableName, testParkingLot4)
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testGetPotentialStartEndPoints("get all potential start/end points", testHike1.hikeId, expectedGetPotentialStartEndPointsProperties);
});

/*****************************************************************************************************
 *             getPotentialHutsInfo()
 *****************************************************************************************************/
 describe("Test get potentials hut info", () => {
  /* Test Setup */
  beforeAll(async () => {
    await Utils.clearAll();
    await PersistentManager.store(User.tableName, testUser);
    await Promise.all([
      PersistentManager.store(Point.tableName, testStartPoint1),
      PersistentManager.store(Point.tableName, testEndPoint1),
      PersistentManager.store(Point.tableName, testHutPoint1),
      PersistentManager.store(Point.tableName, testHutPoint2),
      PersistentManager.store(Point.tableName, testPotHutPoint1)
    ]);
    await Promise.all([
      PersistentManager.store(Hike.tableName, testHike1),
    ]);
    await Promise.all([
      PersistentManager.store(Hut.tableName, testHut1),
      PersistentManager.store(Hut.tableName, testHut2),
      PersistentManager.store(Hut.tableName, testPotHut1)
    ]);
   
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testGetPotentialHut("get potential huts", testHike1.hikeId, 1);
});


/*****************************************************************************************************
 *              updateStartPoint()
 *****************************************************************************************************/
describe("Test updateStartPoint", () => {
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
      PersistentManager.store(Point.tableName, testHutPoint1),
      PersistentManager.store(Point.tableName, testParkingLotPoint1),
      PersistentManager.store(Point.tableName, testHutPoint2),
      PersistentManager.store(Point.tableName, testParkingLotPoint2)
    ]);
    await Promise.all([
      PersistentManager.store(Hike.tableName, { ...testHike1, trackPath: `gpx/${testEditableGpx}` }),
      PersistentManager.store(Hike.tableName, { ...testHike2, trackPath: `gpx/${testEditableGpx}`, startPoint: testHutPoint2.pointId }),
      PersistentManager.store(Hike.tableName, { ...testHike3, trackPath: `gpx/${testEditableGpx}`, startPoint: testParkingLotPoint2.pointId }),
    ]);
    await Promise.all([
      PersistentManager.store(Hut.tableName, testHut1),
      PersistentManager.store(Hut.tableName, testHut2),
      PersistentManager.store(ParkingLot.tableName, testParkingLot1),
      PersistentManager.store(ParkingLot.tableName, testParkingLot2)
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testUpdateStartPoint("set the hut as start point", testHike1.hikeId, testNewStartEndPointHut);
  Utils.testUpdateStartPoint("set the parking lot as start point", testHike1.hikeId, testNewStartEndPointParkingLot);
  Utils.testUpdateStartPoint("set start point and update old hut start point", testHike2.hikeId, testNewStartEndPointHut);
  Utils.testUpdateStartPoint("set start point and update old parking lot start point", testHike3.hikeId, testNewStartEndPointHut);
});


/*****************************************************************************************************
 *              updateEndPoint()
 *****************************************************************************************************/
describe("Test updateEndPoint", () => {
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
      PersistentManager.store(Point.tableName, testHutPoint1),
      PersistentManager.store(Point.tableName, testParkingLotPoint1),
      PersistentManager.store(Point.tableName, testHutPoint2),
      PersistentManager.store(Point.tableName, testParkingLotPoint2)
    ]);
    await Promise.all([
      PersistentManager.store(Hike.tableName, { ...testHike1, trackPath: `gpx/${testEditableGpx}` }),
      PersistentManager.store(Hike.tableName, { ...testHike2, trackPath: `gpx/${testEditableGpx}`, endPoint: testHutPoint2.pointId }),
      PersistentManager.store(Hike.tableName, { ...testHike3, trackPath: `gpx/${testEditableGpx}`, endPoint: testParkingLotPoint2.pointId }),
    ]);
    await Promise.all([
      PersistentManager.store(Hut.tableName, testHut1),
      PersistentManager.store(Hut.tableName, testHut2),
      PersistentManager.store(ParkingLot.tableName, testParkingLot1),
      PersistentManager.store(ParkingLot.tableName, testParkingLot2)
    ]);
  });

  /* Test Teardown */
  afterAll(async () => {
    await Utils.clearAll();
  });

  Utils.testUpdateEndPoint("set the hut as end point", testHike1.hikeId, testNewStartEndPointHut);
  Utils.testUpdateEndPoint("set the parking lot as end point", testHike1.hikeId, testNewStartEndPointParkingLot);
  Utils.testUpdateEndPoint("set end point and update old hut end point", testHike2.hikeId, testNewStartEndPointHut);
  Utils.testUpdateEndPoint("set end point and update old parking lot end point", testHike3.hikeId, testNewStartEndPointHut);
});