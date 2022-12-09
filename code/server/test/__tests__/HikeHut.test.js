
const PersistentManager = require("../../dao/PersistentManager");
const HikeManager = require("../../controllers/HikeManager");
const Point = require("../../dao/model/Point");
const Hike = require("../../dao/model/Hike");
const User = require("../../dao/model/User");
const Hut = require("../../dao/model/Hut");
const ParkingLot = require("../../dao/model/ParkingLot");
const HikeHut = require("../../dao/model/HikeHut");
const HikeParkingLot = require("../../dao/model/HikeParkingLot");
const Utils = require("../unit-utils");
const testUser = new User(1, "test@email.it", "testSalt", "testPassword", null, "testFirstname", "testLastname", "390123456789", "testRole", 1);
const testGpx = "rocciamelone.gpx";
const testStartPoint1 = new Point(1, "start point", 0, 0, "Start point of testHike1", 10.000, 10.000);
const testEndPoint1 = new Point( 2,"end point",0,0,"End point of testHike1", 10.010, 10.010);
const testHike1 = new Hike(1, "testTitle1", testUser.userId, `gpx/${testGpx}`, 1, 1, 1, 10.0, "01:01", 10.0, 10.0, "testDifficulty1", "testDescription1", testStartPoint1.pointId, testEndPoint1.pointId);

const testHutPoint1 = new Point(7, "hut", 0, 1, null, 10.001, 10.001);
const testHut1 = new Hut(1, "testHutName1", testHutPoint1.pointId, testUser.userId, 1, 1, 1, 10, 10.0, 1000.0, "391012345678", "testHutEmail1@email.com", "www.testHutWebSite1.com");
const newHutIdList = [1];


/*****************************************************************************************************
 *             UpdateLinkedHutId()
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
  