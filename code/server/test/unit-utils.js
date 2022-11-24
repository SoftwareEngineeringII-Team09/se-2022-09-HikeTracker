const PersistentManager = require("../dao/PersistentManager");
const Hike = require("../dao/model/Hike");
const Point = require("../dao/model/Point");
const Hut = require("../dao/model/Hut");
const ParkingLot = require("../dao/model/ParkingLot");
const HikeHut = require("../dao/model/HikeHut");
const HikeParkingLot = require("../dao/model/HikeParkingLot");
const HikeRefPoint = require("../dao/model/HikeRefPoint");
const HutDailySchedule = require("../dao/model/HutDailySchedule");
const User = require("../dao/model/User");
const HikeManager = require("../controllers/HikeManager");
const ParkingLotManager = require("../controllers/ParkingLotManager");
const PointManager = require("../controllers/PointManager");
const HikeRefPointManager = require("../controllers/HikeRefPointManager");
const HutManager = require("../controllers/HutManager");

/* Reset DB content */
exports.clearAll = async function () {
  await PersistentManager.deleteAll(HikeHut.tableName);
  await PersistentManager.deleteAll(HikeParkingLot.tableName);
  await PersistentManager.deleteAll(HikeRefPoint.tableName);
  await PersistentManager.deleteAll(HutDailySchedule.tableName);
  await PersistentManager.deleteAll(Hut.tableName);
  await PersistentManager.deleteAll(ParkingLot.tableName);
  await PersistentManager.deleteAll(Hike.tableName);
  await PersistentManager.deleteAll(Point.tableName);
  await PersistentManager.deleteAll(User.tableName);

  return Promise.resolve();
};

/*****************************************************************************************************
 *              Hike
 *****************************************************************************************************/
exports.testStoreHike = function (
  itShould,
  newHike,
  expectedRejectionCode = undefined
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await HikeManager.storeHike(newHike);
      const storedHike = await PersistentManager.loadAll(Hike.tableName).then(
        (hikes) => hikes[0]
      );

      expect(res).toEqual(newHike.hikeId);
      expect(storedHike).toEqual(newHike);
    } else {
      await expect(HikeManager.storeHike(newHike)).rejects.toHaveProperty(
        "code",
        expectedRejectionCode
      );
    }
  });
};

exports.testUpdateHike = function (
  itShould,
  newHike,
  attributeName,
  value,
  expectedRejectionCode = undefined
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      let attributesName = [];
      for (const attribute in newHike) {
        if (Object.prototype.hasOwnProperty.call(newHike, attribute)) {
          attributesName.push(attribute);
        }
      }
      await HikeManager.updateHike(newHike, attributeName, value);
      let updatedHikes = await PersistentManager.loadAllByAttribute(
        Hike.tableName,
        attributeName,
        value
      );

      for (const updatedHike of updatedHikes) {
        for (const attribute in attributesName) {
          expect(updatedHike[attribute]).toEqual(newHike[attribute]);
        }
      }
    } else {
      await expect(
        HikeManager.updateHike(newHike, attributeName, value)
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testDeleteHike = function (itShould, attributeName, value) {
  test(`Should ${itShould}`, async () => {
    await HikeManager.deleteHike(attributeName, value);
    const numOfRemainingHikes = await PersistentManager.loadAllByAttribute(
      Hike.tableName,
      attributeName,
      value
    ).then((hikes) => hikes.length);

    expect(numOfRemainingHikes).toEqual(0);
  });
};

exports.testDeleteAllHike = function (itShould) {
  test(`Should ${itShould}`, async () => {
    await HikeManager.deleteAllHike();
    const numOfRemainingHikes = await PersistentManager.loadAll(
      Hike.tableName
    ).then((hikes) => hikes.length);

    expect(numOfRemainingHikes).toEqual(0);
  });
};

exports.testLoadAllHike = function (itShould, expectedLength) {
  test(`Should ${itShould}`, async () => {
    const actualLength = await HikeManager.loadAllHike().then(
      (hikes) => hikes.length
    );

    expect(actualLength).toEqual(expectedLength);
  });
};

exports.testExistsHike = function (
  itShould,
  attributeName,
  value,
  expectedResult
) {
  test(`Should ${itShould}`, async () => {
    const res = await HikeManager.existsHike(attributeName, value);

    expect(res).toEqual(expectedResult);
  });
};

exports.testLoadOneByAttributeHike = function (
  itShould,
  attributeName,
  value,
  expectedRejectionCode = undefined
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await HikeManager.loadOneByAttributeHike(
        attributeName,
        value
      );

      expect(res[attributeName]).toEqual(value);
    } else {
      await expect(
        HikeManager.loadOneByAttributeHike(attributeName, value)
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testLoadAllByAttributeHike = function (itShould, attributeName, value) {
  test(`Should ${itShould}`, async () => {
    const res = await HikeManager.loadAllByAttributeHike(
      attributeName,
      value
    ).then((hikes) => hikes.length);

    for (const r in res) {
      expect(r[attributeName]).toEqual(value);
    }
  });
};

exports.testGetAllHikes = function (
  itShould,
  expectedLength,
  expectedGetAllHikesProperties
) {
  test(`Should ${itShould}`, async () => {
    const res = await HikeManager.getAllHikes();

    expect(res.length).toEqual(expectedLength);
    for (const r of res) {
      for (const p of expectedGetAllHikesProperties) {
        expect(r).toHaveProperty(p);
      }
    }
  });
};

exports.testGetHikeByHikeId = function (
  itShould,
  hikeId,
  expectedGetHikeByIdProperties = undefined,
  expectedRejectionCode = undefined
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await HikeManager.getHikeById(hikeId);

      for (const p of expectedGetHikeByIdProperties) {
        expect(res).toHaveProperty(p);
      }
    } else {
      await expect(HikeManager.getHikeById(hikeId)).rejects.toHaveProperty(
        "code",
        expectedRejectionCode
      );
    }
  });
};

exports.testGetGpxPath = function (
  itShould,
  hikeId,
  expectedGpxPath = undefined,
  expectedRejectionCode = undefined
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await HikeManager.getGpxPath(hikeId);

      expect(res).toEqual(expectedGpxPath);
    } else {
      await expect(HikeManager.getGpxPath(hikeId)).rejects.toHaveProperty(
        "code",
        expectedRejectionCode
      );
    }
  });
};

exports.testDefineHike = function (
  itShould,
  writerId,
  title,
  expectedTime,
  difficulty,
  description,
  city,
  province,
  region,
  fileName,
  expectedRejectionCode = undefined
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      await HikeManager.defineHike(
        writerId,
        title,
        expectedTime,
        difficulty,
        description,
        city,
        province,
        region,
        fileName
      );
      const definedHike = await PersistentManager.loadAll(Hike.tableName).then(
        (Hikes) => Hikes[0]
      );
      const definedHikePoint = await PersistentManager.loadAll(
        Point.tableName
      ).then((points) => points[0]);

      expect(definedHike.title).toEqual(title);
      expect(definedHike.writerId).toEqual(writerId);
      expect(definedHike.expectedTime).toEqual(expectedTime);
      expect(definedHike.difficulty).toEqual(difficulty);
      expect(definedHike.description).toEqual(description);
      expect(definedHike.city).toEqual(city);
      expect(definedHike.province).toEqual(province);
      expect(definedHike.region).toEqual(region);
      expect(definedHike.trackPath).toEqual(`gpx/${fileName}`);
    } else {
      await expect(
        HikeManager.defineHike(
          writerId,
          title,
          expectedTime,
          difficulty,
          description,
          city,
          province,
          region,
          fileName
        )
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

/*****************************************************************************************************
 *              Hut
 *****************************************************************************************************/
exports.testStoreHut = function (
  itShould,
  newHut,
  expectedRejectionCode = undefined
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await HutManager.storeHut(newHut);
      const storedHut = await PersistentManager.loadAll(Hut.tableName).then(
        (huts) => huts[0]
      );

      expect(res).toEqual(newHut.hutId);
      expect(storedHut).toEqual(newHut);
    } else {
      await expect(HutManager.storeHut(newHut)).rejects.toHaveProperty(
        "code",
        expectedRejectionCode
      );
    }
  });
};

exports.testExistsHut = function (
  itShould,
  attributeName,
  value,
  expectedResult
) {
  test(`Should ${itShould}`, async () => {
    const res = await HutManager.existsHut(attributeName, value);

    expect(res).toEqual(expectedResult);
  });
};

exports.testGetAllHuts = function (
  itShould,
  expectedLength,
  expectedGetAllHikesProperties
) {
  test(`Should ${itShould}`, async () => {
    const res = await HutManager.getAllHuts();

    expect(res.length).toEqual(expectedLength);
    for (const r of res) {
      for (const p of expectedGetAllHikesProperties) {
        expect(r).toHaveProperty(p);
      }
    }
  });
};

exports.testDefineHut = function (
  itShould,
  hutName,
  writerId,
  city,
  province,
  region,
  numOfBeds,
  cost,
  latitude,
  longitude,
  altitude,
  expectedRejectionCode = undefined
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      await HutManager.defineHut(
        hutName,
        writerId,
        city,
        province,
        region,
        numOfBeds,
        cost,
        latitude,
        longitude,
        altitude
      );
      const definedHut = await PersistentManager.loadAll(Hut.tableName).then(
        (Huts) => Huts[0]
      );
      const definedHutPoint = await PersistentManager.loadAll(
        Point.tableName
      ).then((points) => points[0]);

      expect(definedHut.hutName).toEqual(hutName);
      expect(definedHut.writerId).toEqual(writerId);
      expect(definedHut.city).toEqual(city);
      expect(definedHut.province).toEqual(province);
      expect(definedHut.region).toEqual(region);
      expect(definedHut.numOfBeds).toEqual(numOfBeds);
      expect(definedHut.cost).toEqual(cost);
      expect(definedHutPoint.latitude).toEqual(latitude);
      expect(definedHutPoint.longitude).toEqual(longitude);
      expect(definedHutPoint.altitude).toEqual(altitude);
    } else {
      await expect(
        HutManager.defineHut(
          hutName,
          writerId,
          city,
          province,
          region,
          numOfBeds,
          cost,
          latitude,
          longitude,
          altitude
        )
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

/*****************************************************************************************************
 *              ParkingLot
 *****************************************************************************************************/
exports.testStoreParkingLot = function (
  itShould,
  newParkingLot,
  expectedRejectionCode = undefined
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await ParkingLotManager.storeParkingLot(newParkingLot);
      const storedParkingLot = await PersistentManager.loadAll(
        ParkingLot.tableName
      ).then((parkingLots) => parkingLots[0]);

      expect(res).toEqual(newParkingLot.parkingLotId);
      expect(storedParkingLot).toEqual(newParkingLot);
    } else {
      await expect(
        ParkingLotManager.storeParkingLot(newParkingLot)
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testExistsParkingLot = function (
  itShould,
  attributeName,
  value,
  expectedResult
) {
  test(`Should ${itShould}`, async () => {
    const res = await ParkingLotManager.existsParkingLot(attributeName, value);

    expect(res).toEqual(expectedResult);
  });
};

exports.testLoadOneByAttributeParkingLot = function (
  itShould,
  attributeName,
  value,
  expectedRejectionCode = undefined
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await ParkingLotManager.loadOneByAttributeParkingLot(
        attributeName,
        value
      );

      expect(res[attributeName]).toEqual(value);
    } else {
      await expect(
        ParkingLotManager.loadOneByAttributeParkingLot(attributeName, value)
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testDefineParkingLot = function (
  itShould,
  writerId,
  parkingLotName,
  latitude,
  longitude,
  altitude,
  expectedRejectionCode = undefined
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      await ParkingLotManager.defineParkingLot(
        writerId,
        parkingLotName,
        latitude,
        longitude,
        altitude
      );
      const definedParkingLot = await PersistentManager.loadAll(
        ParkingLot.tableName
      ).then((parkingLots) => parkingLots[0]);
      const definedParkingLotPoint = await PersistentManager.loadAll(
        Point.tableName
      ).then((points) => points[0]);

      expect(definedParkingLot.writerId).toEqual(writerId);
      expect(definedParkingLot.parkingLotName).toEqual(parkingLotName);
      expect(definedParkingLotPoint.latitude).toEqual(latitude);
      expect(definedParkingLotPoint.longitude).toEqual(longitude);
      expect(definedParkingLotPoint.altitude).toEqual(altitude);
    } else {
      await expect(
        ParkingLotManager.defineParkingLot(
          writerId,
          parkingLotName,
          latitude,
          longitude,
          altitude
        )
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

/*****************************************************************************************************
 *              Point
 *****************************************************************************************************/
exports.testStorePoint = function (
  itShould,
  newPoint,
  expectedRejectionCode = undefined
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await PointManager.storePoint(newPoint);
      const storedPoint = await PersistentManager.loadAll(Point.tableName).then(
        (points) => points[0]
      );

      expect(res).toEqual(newPoint.pointId);
      expect(storedPoint).toEqual(newPoint);
    } else {
      await expect(PointManager.storePoint(newPoint)).rejects.toHaveProperty(
        "code",
        expectedRejectionCode
      );
    }
  });
};

exports.testExistsPoint = function (
  itShould,
  attributeName,
  value,
  expectedResult
) {
  test(`Should ${itShould}`, async () => {
    const res = await PointManager.existsPoint(attributeName, value);

    expect(res).toEqual(expectedResult);
  });
};

exports.testLoadOneByAttributePoint = function (
  itShould,
  attributeName,
  value,
  expectedRejectionCode = undefined
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await PointManager.loadOneByAttributePoint(
        attributeName,
        value
      );

      expect(res[attributeName]).toEqual(value);
    } else {
      await expect(
        PointManager.loadOneByAttributePoint(attributeName, value)
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

/*****************************************************************************************************
 *              HikeRefPoint
 *****************************************************************************************************/
exports.testStoreHikeRefPoint = function (
  itShould,
  newHikeRefPoint,
  expectedRejectionCode = undefined
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      await HikeRefPointManager.storeHikeRefPoint(newHikeRefPoint);
      const storedHikeRefPoint = await PersistentManager.loadAll(
        HikeRefPoint.tableName
      ).then((hikeRefPoints) => hikeRefPoints[0]);

      expect(storedHikeRefPoint).toEqual(newHikeRefPoint);
    } else {
      await expect(
        HikeRefPointManager.storeHikeRefPoint(newHikeRefPoint)
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testExistsHikeRefPoint = function (
  itShould,
  attributeName,
  value,
  expectedResult
) {
  test(`Should ${itShould}`, async () => {
    const res = await HikeRefPointManager.existsHikeRefPoint(
      attributeName,
      value
    );

    expect(res).toEqual(expectedResult);
  });
};

exports.testLoadAllByAttributeHikeRefPoint = function (
  itShould,
  attributeName,
  value
) {
  test(`Should ${itShould}`, async () => {
    const res = await HikeRefPointManager.loadAllByAttributeHikeRefPoint(
      attributeName,
      value
    ).then((hikeRefPoints) => hikeRefPoints.length);

    for (const r in res) {
      expect(r[attributeName]).toEqual(value);
    }
  });
};

/*****************************************************************************************************
 *              Others
 *****************************************************************************************************/