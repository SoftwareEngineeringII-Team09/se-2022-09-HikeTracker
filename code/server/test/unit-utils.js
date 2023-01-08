const PersistentManager = require("../dao/PersistentManager");
const Hike = require("../dao/model/Hike");
const Point = require("../dao/model/Point");
const Hut = require("../dao/model/Hut");
const ParkingLot = require("../dao/model/ParkingLot");
const HikeHut = require("../dao/model/HikeHut");
const HikeRefPoint = require("../dao/model/HikeRefPoint");
const HutDailySchedule = require("../dao/model/HutDailySchedule");
const User = require("../dao/model/User");
const HikeManager = require("../controllers/HikeManager");
const ParkingLotManager = require("../controllers/ParkingLotManager");
const PointManager = require("../controllers/PointManager");
const HikeRefPointManager = require("../controllers/HikeRefPointManager");
const HutManager = require("../controllers/HutManager");
const UserManager = require("../controllers/UserManager");
const HikeHutManager = require("../controllers/HikeHutManager");
const SelectedHike = require("../dao/model/SelectedHike");
const SelectedHikeManager = require("../controllers/SelectedHikeManager");


/* Reset DB content */
exports.clearAll = async function () {
  await PersistentManager.deleteAll(HikeHut.tableName);
  await PersistentManager.deleteAll(HikeRefPoint.tableName);
  await PersistentManager.deleteAll(HutDailySchedule.tableName);
  await PersistentManager.deleteAll(Hut.tableName);
  await PersistentManager.deleteAll(ParkingLot.tableName);
  await PersistentManager.deleteAll(SelectedHike.tableName);
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
  expectedRejectionCode = null
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
  expectedRejectionCode = null
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
  expectedRejectionCode = null
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
  expectedGetHikeByIdProperties
) {
  test(`Should ${itShould}`, async () => {
    const res = await HikeManager.getHikeById(hikeId);

    for (const p of expectedGetHikeByIdProperties) {
      expect(res).toHaveProperty(p);
    }
  });
};

exports.testGetGpxPath = function (
  itShould,
  hikeId,
  expectedGpxPath = null,
  expectedRejectionCode = null
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
  imageName,
  expectedRejectionCode = null
) {
  test(`Should ${itShould}`, async () => {
    const hikeData = { writerId: writerId, title: title, expectedTime: expectedTime, difficulty: difficulty, description: description, city: city, province: province, region: region, fileName: fileName, hikeImageName: imageName };
    if (!expectedRejectionCode) {
      await HikeManager.defineHike(
        hikeData
      );
      const definedHike = await PersistentManager.loadAll(Hike.tableName).then(
        (hikes) => hikes[0]
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
      expect(definedHike.hikeImage).toEqual(`hikeImage/${imageName}`);
    } else {
      await expect(
        HikeManager.defineHike(
          hikeData
        )
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testGetPotentialStartEndPoints = function (itShould, hikeId, expectedGetPotentialStartEndPointsProperties) {
  test(`Should ${itShould}`, async () => {
    const res = await HikeManager.getPotentialStartEndPoints(hikeId);

    for (const p of expectedGetPotentialStartEndPointsProperties) {
      expect(res).toHaveProperty(p);
    }
  });
}

exports.testGetPotentialHut = function (itShould, hikeId, expectNum) {
  test(`Should ${itShould}`, async () => {
    const res = await HikeManager.getPotentialHuts(hikeId);
    expect(res.potentialHuts).toHaveLength(expectNum);
  });
}

exports.testUpdateStartPoint = function (
  itShould,
  hikeId,
  newStartPoint
) {
  test(`Should ${itShould}`, async () => {
    await HikeManager.updateStartPoint(hikeId, newStartPoint);

    const hikeStartPoint = await PersistentManager.loadOneByAttribute(Hike.tableName, "hikeId", hikeId).then(
      (hike) => hike.startPoint
    );
    const startPoint = await PersistentManager.loadOneByAttribute(Point.tableName, "pointId", hikeStartPoint);

    if (newStartPoint.type === "hut") {
      const hut = await PersistentManager.loadOneByAttribute(Hut.tableName, "pointId", startPoint.pointId);
      expect(hut.hutId).toEqual(newStartPoint.id);
    } else {
      const parkingLot = await PersistentManager.loadOneByAttribute(ParkingLot.tableName, "pointId", startPoint.pointId);
      expect(parkingLot.parkingLotId).toEqual(newStartPoint.id);
    }
  });
};

exports.testUpdateEndPoint = function (
  itShould,
  hikeId,
  newEndPoint
) {
  test(`Should ${itShould}`, async () => {
    await HikeManager.updateEndPoint(hikeId, newEndPoint);

    const hikeEndPoint = await PersistentManager.loadOneByAttribute(Hike.tableName, "hikeId", hikeId).then(
      (hike) => hike.endPoint
    );
    const endPoint = await PersistentManager.loadOneByAttribute(Point.tableName, "pointId", hikeEndPoint);

    if (newEndPoint.type === "hut") {
      const hut = await PersistentManager.loadOneByAttribute(Hut.tableName, "pointId", endPoint.pointId);
      expect(hut.hutId).toEqual(newEndPoint.id);
    } else {
      const parkingLot = await PersistentManager.loadOneByAttribute(ParkingLot.tableName, "pointId", endPoint.pointId);
      expect(parkingLot.parkingLotId).toEqual(newEndPoint.id);
    }
  });
};

exports.testGetAllCompletedHikes = function (
  itShould,
  hikerId,
  expectedLength,
  expectedGetAllCompletedHikesProperties
) {
  test(`Should ${itShould}`, async () => {
    const res = await HikeManager.getAllCompletedHikes(hikerId);

    expect(res.length).toEqual(expectedLength);
    for (const r of res) {
      for (const p of expectedGetAllCompletedHikesProperties) {
        expect(r).toHaveProperty(p);
      }
    }
  });
};


/*****************************************************************************************************
 *              HikeHut
 *****************************************************************************************************/
exports.testStoreHikeHut = function (
  itShould,
  newHikeHut,
  expectedRejectionCode = null
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      await HikeHutManager.storeHikeHut(newHikeHut);
      const storedHikeHut = await PersistentManager.loadAll(HikeHut.tableName).then(
        (hikeHuts) => hikeHuts[0]
      );

      expect(storedHikeHut).toEqual(newHikeHut);
    } else {
      await expect(HikeHutManager.storeHikeHut(newHikeHut)).rejects.toHaveProperty(
        "code",
        expectedRejectionCode
      );
    }
  });
};

exports.testDeleteHikeHut = function (itShould, attributeName, value) {
  test(`Should ${itShould}`, async () => {
    await HikeHutManager.deleteHikeHut(attributeName, value);
    const numOfRemainingHikeHuts = await PersistentManager.loadAllByAttribute(
      HikeHut.tableName,
      attributeName,
      value
    ).then((hikeHuts) => hikeHuts.length);

    expect(numOfRemainingHikeHuts).toEqual(0);
  });
};

exports.testExistsHikeHut = function (
  itShould,
  attributeName,
  value,
  expectedResult
) {
  test(`Should ${itShould}`, async () => {
    const res = await HikeHutManager.existsHikeHut(attributeName, value);

    expect(res).toEqual(expectedResult);
  });
};

exports.testLoadAllByAttributeHikeHut = function (itShould, attributeName, value) {
  test(`Should ${itShould}`, async () => {
    const res = await HikeHutManager.loadAllByAttributeHikeHut(
      attributeName,
      value
    ).then((hikeHuts) => hikeHuts.length);

    for (const r in res) {
      expect(r[attributeName]).toEqual(value);
    }
  });
};

exports.testUpdateHutId = function (
  itShould,
  hikeId,
  newHutIdList,
  expectedRejectionCode = null
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await HikeHutManager.updatehutId(hikeId, newHutIdList);

      const storedHikeHut = await PersistentManager.loadAll(HikeHut.tableName).then(
        (hikeHut) => hikeHut[0]
      );

      expect(res).toEqual(hikeId);
      expect(storedHikeHut.hutId).toEqual(newHutIdList[0]);
    } else {
      await expect(HutManager.storeHut(newHut)).rejects.toHaveProperty(
        "code",
        expectedRejectionCode
      );
    }
  });
};

/*****************************************************************************************************
 *              Hut
 *****************************************************************************************************/
exports.testStoreHut = function (
  itShould,
  newHut,
  expectedRejectionCode = null
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

exports.testLoadOneByAttributeHut = function (
  itShould,
  attributeName,
  value,
  expectedRejectionCode = null
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await HutManager.loadOneByAttributeHut(
        attributeName,
        value
      );

      expect(res[attributeName]).toEqual(value);
    } else {
      await expect(
        HutManager.loadOneByAttributeHut(attributeName, value)
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
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
  phone,
  email,
  website,
  expectedRejectionCode = null
) {
  test(`Should ${itShould}`, async () => {
    const hutData = { hutName: hutName, writerId: writerId, city: city, province: province, region: region, numOfBeds: numOfBeds, cost: cost, latitude: latitude, longitude: longitude, altitude: altitude, phone: phone, email: email, website: website };
    if (!expectedRejectionCode) {
      await HutManager.defineHut(hutData);
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
      expect(definedHut.altitude).toEqual(altitude);
      expect(definedHut.phone).toEqual(phone);
      expect(definedHut.email).toEqual(email);
      expect(definedHut.website).toEqual(website);
      expect(definedHutPoint.latitude).toEqual(latitude);
      expect(definedHutPoint.longitude).toEqual(longitude);
    } else {
      await expect(HutManager.defineHut(hutData)).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testGetHutById = function (
  itShould,
  hutId
) {
  test(`Should ${itShould}`, async () => {
    const res = await HutManager.getHutById(
      hutId
    );

    expect(res.hutId).toEqual(hutId);
  });
};

exports.testGetHutByPointId = function (
  itShould,
  pointId
) {
  test(`Should ${itShould}`, async () => {
    const res = await HutManager.getHutByPointId(
      pointId
    );

    expect(res.pointId).toEqual(pointId);
  });
};


/*****************************************************************************************************
 *              ParkingLot
 *****************************************************************************************************/
exports.testStoreParkingLot = function (
  itShould,
  newParkingLot,
  expectedRejectionCode = null
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
  expectedRejectionCode = null
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
  capacity,
  expectedRejectionCode = null
) {
  test(`Should ${itShould}`, async () => {
    const parkingLotData = { writerId: writerId, parkingLotName: parkingLotName, latitude: latitude, longitude: longitude, altitude: altitude, capacity: capacity };
    if (!expectedRejectionCode) {
      await ParkingLotManager.defineParkingLot(parkingLotData);
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
      expect(definedParkingLot.altitude).toEqual(altitude);
      expect(definedParkingLot.capacity).toEqual(capacity);
    } else {
      await expect(ParkingLotManager.defineParkingLot(parkingLotData)).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

/*****************************************************************************************************
 *              Point
 *****************************************************************************************************/
exports.testStorePoint = function (
  itShould,
  newPoint,
  expectedRejectionCode = null
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

exports.testUpdatePoint = function (
  itShould,
  newPoint,
  attributeName,
  value,
  expectedRejectionCode = null
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      let attributesName = [];
      for (const attribute in newPoint) {
        if (Object.prototype.hasOwnProperty.call(newPoint, attribute)) {
          attributesName.push(attribute);
        }
      }
      await PointManager.updatePoint(newPoint, attributeName, value);
      let updatedPoints = await PersistentManager.loadAllByAttribute(
        Point.tableName,
        attributeName,
        value
      );

      for (const updatedPoint of updatedPoints) {
        for (const attribute in attributesName) {
          expect(updatedPoint[attribute]).toEqual(newPoint[attribute]);
        }
      }
    } else {
      await expect(
        PointManager.updatePoint(newPoint, attributeName, value)
      ).rejects.toHaveProperty("code", expectedRejectionCode);
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
  expectedRejectionCode = null
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
  expectedRejectionCode = null
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

exports.testUpdateHikeRefPoint = function (
  itShould,
  newHikeRefPoint,
  attributeName,
  value,
  expectedRejectionCode = null
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      let attributesName = [];
      for (const attribute in newHikeRefPoint) {
        if (Object.prototype.hasOwnProperty.call(newHikeRefPoint, attribute)) {
          attributesName.push(attribute);
        }
      }
      await HikeRefPointManager.updateHikeRefPoint(newHikeRefPoint, attributeName, value);
      let updatedHikeRefPoints = await PersistentManager.loadAllByAttribute(
        HikeRefPoint.tableName,
        attributeName,
        value
      );

      for (const updatedHikeRefPoint of updatedHikeRefPoints) {
        for (const attribute in attributesName) {
          expect(updatedHikeRefPoint[attribute]).toEqual(newHikeRefPoint[attribute]);
        }
      }
    } else {
      await expect(
        HikeRefPointManager.updateHikeRefPoint(newHikeRefPoint, attributeName, value)
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testDeleteHikeRefPoint = function (itShould, attributeName, value) {
  test(`Should ${itShould}`, async () => {
    await HikeRefPointManager.deleteHikeRefPoint(attributeName, value);
    const numOfRemainingHikeRefPoints = await PersistentManager.loadAllByAttribute(
      HikeRefPoint.tableName,
      attributeName,
      value
    ).then((hikeRefPoints) => hikeRefPoints.length);

    expect(numOfRemainingHikeRefPoints).toEqual(0);
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

exports.testUpdateRefPoint = function (
  itShould,
  hikeId,
  newRefPoints
) {
  test(`Should ${itShould}`, async () => {
    await HikeRefPointManager.updateRefPoint(hikeId, newRefPoints);
    const hikeRefPoints = await PersistentManager.loadAllByAttribute(HikeRefPoint.tableName, "hikeId", hikeId);
    const refPoints = await Promise.all(hikeRefPoints.map(async (hrp) => {
      const refPoint = await PersistentManager.loadOneByAttribute(Point.tableName, "pointId", hrp.pointId);
      return {
        name: refPoint.nameOfLocation,
        coords: [refPoint.latitude, refPoint.longitude]
      };
    }));

    for (const nrp of newRefPoints) {
      expect(refPoints.some(rp => rp.name === nrp.name)).toEqual(true);
      expect(refPoints.some(rp => rp.coords[0] === nrp.coords[0])).toEqual(true);
      expect(refPoints.some(rp => rp.coords[1] === nrp.coords[1])).toEqual(true);
    }
  });
};


/*****************************************************************************************************
 *              User
 *****************************************************************************************************/
exports.testStoreUser = function (itShould, newUser, expectedRejectionCode = null) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await UserManager.storeUser(newUser);
      const storedUser = await PersistentManager.loadOneByAttribute(User.tableName, "userId", res);

      expect(res).toEqual(newUser.userId);
      expect(storedUser).toEqual(newUser);
    } else {
      await expect(UserManager.storeUser(newUser)).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testUpdateUser = function (itShould, newUser, attributeName, value, expectedRejectionCode = null) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      let attributesName = [];
      for (const attribute in newUser) {
        if (Object.prototype.hasOwnProperty.call(newUser, attribute)) {
          attributesName.push(attribute);
        }
      }
      await UserManager.updateUser(newUser, attributeName, value);
      let updatedUsers = await PersistentManager.loadAllByAttribute(
        User.tableName,
        attributeName,
        value
      );

      for (const updatedUser of updatedUsers) {
        for (const attribute in attributesName) {
          expect(updatedUser[attribute]).toEqual(newUser[attribute]);
        }
      }
    } else {
      await expect(UserManager.updateUser(newUser, attributeName, value)).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testLoadAllUser = function (itShould, expectedLength) {
  test(`Should ${itShould}`, async () => {
    const actualLength = await UserManager.loadAllUser().then(
      (users) => users.length
    );

    expect(actualLength).toEqual(expectedLength);
  });
};

exports.testExistsUser = function (itShould, attributeName, value, expectedResult) {
  test(`Should ${itShould}`, async () => {
    const res = await UserManager.existsUser(attributeName, value);

    expect(res).toEqual(expectedResult);
  });
};

exports.testLoadOneByAttributeUser = function (itShould, attributeName, value, expectedRejectionCode = null) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await UserManager.loadOneByAttributeUser(attributeName, value);

      expect(res[attributeName]).toEqual(value);
    } else {
      await expect(UserManager.loadOneByAttributeUser(attributeName, value)).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testDefineUser = function (itShould, role, firstname, lastname, mobile, email, password, verificationCode) {
  test(`Should ${itShould}`, async () => {
    const userData = { role: role, firstname: firstname, lastname: lastname, mobile: mobile, email: email, password: password, verificationCode: verificationCode }
    await UserManager.defineUser(userData);
    const definedUser = await PersistentManager.loadAll(User.tableName).then((users) => users[0]);

    expect(definedUser.role).toEqual(role);
    expect(definedUser.firstname).toEqual(firstname);
    expect(definedUser.lastname).toEqual(lastname);
    expect(definedUser.mobile).toEqual(mobile);
    expect(definedUser.email).toEqual(email);
    expect(definedUser.verificationCode).toEqual(verificationCode);
  });
}

exports.testUpdateVerificationCode = function (itShould, userId, verificationCode) {
  test(`Should ${itShould}`, async () => {
    await UserManager.updateVerificationCode(userId, verificationCode);
    let updatedUser = await PersistentManager.loadOneByAttribute(User.tableName, "userId", userId);

    expect(updatedUser.verificationCode).toEqual(verificationCode);
  });
}

exports.testVerifyEmail = function (itShould, userId, verificationCode, expectedRejectionCode = null) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      await UserManager.verifyEmail(userId, verificationCode);
      const verifiedUser = await UserManager.loadOneByAttributeUser("userId", userId);

      expect(verifiedUser.active).toEqual(1);
      expect(verifiedUser.verificationCode).toEqual(null);
    } else {
      await expect(UserManager.verifyEmail(userId, verificationCode)).rejects.toHaveProperty("code", expectedRejectionCode);

      const notVerifiedUser = await UserManager.loadOneByAttributeUser("userId", userId);
      expect(notVerifiedUser.active).toEqual(0);
    }
  });
};


/*****************************************************************************************************
 *              SelectedHike
 *****************************************************************************************************/
exports.testStoreSelectedHike = function (
  itShould,
  newSelectedHike,
  expectedRejectionCode = null
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await SelectedHikeManager.storeSelectedHike(newSelectedHike);
      const storedSelectedHike = await PersistentManager.loadAll(SelectedHike.tableName).then(
        (selectedHikes) => selectedHikes[0]
      );

      expect(res).toEqual(newSelectedHike.selectedHikeId);
      expect(storedSelectedHike).toEqual(newSelectedHike);
    } else {
      await expect(SelectedHikeManager.storeSelectedHike(newSelectedHike)).rejects.toHaveProperty(
        "code",
        expectedRejectionCode
      );
    }
  });
};

exports.testUpdateSelectedHike = function (
  itShould,
  newSelectedHike,
  attributeName,
  value,
  expectedRejectionCode = null
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      let attributesName = [];
      for (const attribute in newSelectedHike) {
        if (Object.prototype.hasOwnProperty.call(newSelectedHike, attribute)) {
          attributesName.push(attribute);
        }
      }
      await SelectedHikeManager.updateSelectedHike(newSelectedHike, attributeName, value);
      let updatedSelectedHikes = await PersistentManager.loadAllByAttribute(
        SelectedHike.tableName,
        attributeName,
        value
      );

      for (const updatedSelectedHike of updatedSelectedHikes) {
        for (const attribute in attributesName) {
          expect(updatedSelectedHike[attribute]).toEqual(newSelectedHike[attribute]);
        }
      }
    } else {
      await expect(
        SelectedHikeManager.updateSelectedHike(newSelectedHike, attributeName, value)
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testExistsSelectedHike = function (
  itShould,
  attributeName,
  value,
  expectedResult
) {
  test(`Should ${itShould}`, async () => {
    const res = await SelectedHikeManager.existsSelectedHike(attributeName, value);

    expect(res).toEqual(expectedResult);
  });
};

exports.testLoadOneByAttributeSelectedHike = function (
  itShould,
  attributeName,
  value,
  expectedRejectionCode = null
) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await SelectedHikeManager.loadOneByAttributeSelectedHike(
        attributeName,
        value
      );

      expect(res[attributeName]).toEqual(value);
    } else {
      await expect(
        SelectedHikeManager.loadOneByAttributeSelectedHike(attributeName, value)
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testLoadAllByAttributeSelectedHike = function (itShould, attributeName, value) {
  test(`Should ${itShould}`, async () => {
    const res = await SelectedHikeManager.loadAllByAttributeSelectedHike(
      attributeName,
      value
    ).then((selectedHikes) => selectedHikes.length);

    for (const r in res) {
      expect(r[attributeName]).toEqual(value);
    }
  });
};

exports.testTerminateHike = function (itShould, selectedHikeId, endTime, expectedRejectionCode = null) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await SelectedHikeManager.terminateHike(
        selectedHikeId,
        endTime
      );

      const updatedSelectedHike = await PersistentManager.loadOneByAttribute(SelectedHike.tableName, "selectedHikeId", selectedHikeId);
      expect(updatedSelectedHike.status).toEqual("finished");
      expect(updatedSelectedHike.endTime).toEqual(endTime);
    } else {
      await expect(
        SelectedHikeManager.terminateHike(selectedHikeId, endTime)
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testStartHike = function (itShould, hikeId, startTime, hikerId, expectedRejectionCode = null) {
  test(`Should ${itShould}`, async () => {
    if (!expectedRejectionCode) {
      const res = await SelectedHikeManager.startHike(
        hikeId,
        startTime,
        hikerId
      );

      const storedSelectedHike = await PersistentManager.loadOneByAttribute(SelectedHike.tableName, "selectedHikeId", res);
      expect(storedSelectedHike.status).toEqual("ongoing");
      expect(storedSelectedHike.startTime).toEqual(startTime);
      expect(storedSelectedHike.endTime).toEqual(null);
    } else {
      await expect(
        SelectedHikeManager.startHike(hikeId,
          startTime,
          hikerId)
      ).rejects.toHaveProperty("code", expectedRejectionCode);
    }
  });
};

exports.testLoadStartedHike = function (
  itShould,
  hikerId,
  expectedLoadStarteHikeProperties
) {
  test(`Should ${itShould}`, async () => {
    const res = await SelectedHikeManager.loadStartedHike(hikerId);

    for (const p of expectedLoadStarteHikeProperties) {
      expect(res).toHaveProperty(p);
    }
  });
};


/*****************************************************************************************************
 *              Others
 *****************************************************************************************************/
