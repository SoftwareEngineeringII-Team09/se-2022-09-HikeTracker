"use strict";

const fs = require("fs");
const gpxParser = require("gpxparser");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const Hike = require("../dao/model/Hike");
const Point = require("../dao/model/Point");
const PersistentManager = require("../dao/PersistentManager");
const UserManager = require("./UserManager");
const PointManager = require("./PointManager");
const ParkingLotManager = require("./ParkingLotManager");
const HutManager = require("./HutManager");
const HikeRefPointManager = require("./HikeRefPointManager");

dayjs.extend(duration);
const gpx = new gpxParser();

class HikeManager {
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new hike
   * @param {Hike} newHike 
   * @returns a Promise with the hikeId value of the stored hike 
   */
  async storeHike(newHike) {
    // Check that foreign key writerId exists
    const writerExists = await UserManager.existsUser("userId", newHike.writerId);
    if (!writerExists) {
      return Promise.reject({
        code: 404,
        result: `No available writer with userId = ${newHike.writerId}`
      });
    }
    // Check that foreign key startPoint exists
    const startPointExists = await PointManager.existsPoint("pointId", newHike.startPoint);
    if (!startPointExists) {
      return Promise.reject({
        code: 404,
        result: `No available startPoint with pointId = ${newHike.startPoint}`
      });
    }
    // Check that foreign key endPoint exists
    const endPointExists = await PointManager.existsPoint("pointId", newHike.endPoint);
    if (!endPointExists) {
      return Promise.reject({
        code: 404,
        result: `No available endPoint with pointId = ${newHike.startPoint}`
      });
    }

    return PersistentManager.store(Hike.tableName, newHike);
  }

  /**
   * Update a hike
   * @param {Hike} newHike 
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value if the hike exists, a rejected Promise with an object containing code and result otherwise
   */
  /* async updateHike(newHike, attributeName, value) {
    const exists = await this.existsHike(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with ${attributeName} = ${value}`
      });
    }
    // Check that foreign key writerId exists
    const writerExists = await UserManager.existsUser("userId", newHike.writerId);
    if (!writerExists) {
      return Promise.reject({
        code: 404,
        result: `No available writer with userId = ${newHike.writerId}`
      });
    }
    // Check that foreign key startPoint exists
    const startPointExists = await PointManager.existsPoint("pointId", newHike.startPoint);
    if (!startPointExists) {
      return Promise.reject({
        code: 404,
        result: `No available startPoint with pointId = ${newHike.startPoint}`
      });
    }
    // Check that foreign key endPoint exists
    const endPointExists = await PointManager.existsPoint("pointId", newHike.endPoint);
    if (!endPointExists) {
      return Promise.reject({
        code: 404,
        result: `No available endPoint with pointId = ${newHike.startPoint}`
      });
    }

    return PersistentManager.update(Hike.tableName, newHike, attributeName, value);
  } */

  /**
   * Delete a hike
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value
   */
  /* async deleteHike(attributeName, value) {
    return PersistentManager.delete(Hike.tableName, attributeName, value);
  } */

  /**
   * Delete all hikes
   * @returns a Promise without any value
   */
  /* async deleteAllHike() {
    return PersistentManager.deleteAll(Hike.tableName);
  } */

  /**
   * Load all hikes 
   * @returns a resolved Promise with the list of hikes in case Hike table is not empty, a rejected Promise with an object containing code and result otherwise
   */
  async loadAllRowsHike() {
    const hikes = await PersistentManager.loadAllRows(Hike.tableName);
    if (hikes.length === 0) {
      return Promise.reject({
        code: 404,
        result: "Hike table is empty"
      });
    }

    return Promise.resolve(hikes);
  }

  /**
   * Check if the hike exists
   * @param {String} attributeName
   * @param {any} value  
   * @returns a resolved Promise with true value in case the hike exists, a resolved Promise with false value otherwise   
   */
  async existsHike(attributeName, value) {
    return PersistentManager.exists(Hike.tableName, attributeName, value);
  }

  /**
   * Load one hike by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the hike in case there is one, a rejected Promise with an object containing code and result otherwise  
   */
  async loadOneByAttributeHike(attributeName, value) {
    const exists = await this.existsHike(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with ${attributeName} = ${value}`
      });
    }

    return PersistentManager.loadOneByAttribute(Hike.tableName, attributeName, value);
  }

  /**
   * Load all hikes by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the list of hikes in case there is at least one, a rejected Promise with an object containing code and result otherwise  
   */
  /* async loadAllByAttributeHike(attributeName, value) {
    const hikes = await PersistentManager.loadAllByAttribute(Hike.tableName, attributeName, value);
    if (hikes.length === 0) {
      return Promise.reject({
        code: 404,
        result: `No available hikes with ${attributeName} = ${value}`
      });
    }

    return Promise.resolve(hikes);
  } */
  /* ------------------------------------------------------------------------------------------------------------------- */


  /* --------------------------------------------- Other functions ----------------------------------------------------- */
  // Define a new hike
  async defineHike(
    writerId,
    title,
    expectedTime,
    difficulty,
    description,
    city,
    province,
    region,
    fileName
  ) {
    // Parse the gpx to extract: length, ascent, maxElevation, startPoint, endPoint 
    let gpxString = fs.readFileSync(`gpx/${fileName}`).toString();
    gpx.parse(gpxString);
    const track = gpx.tracks[0];
    const ascent = track.elevation.max - track.elevation.min;
    const length = track.distance.total / 1000;
    const startPoint = track.points[0];
    const endPoint = track.points[track.points.length - 1];
    const maxElevation = track.elevation.max;
    const trackPath = `gpx/${fileName}`;

    // Store the startPoint and retrieve the startPointId
    const startPointId = await PointManager.storePoint(new Point(
      null,
      "start point",
      0,
      0,
      `Start point of ${title}`,
      startPoint.lat,
      startPoint.lon,
      startPoint.ele
    ));

    // Store the endPoint and retrieve the startPointId
    const endPointId = await PointManager.storePoint(new Point(
      null,
      "end point",
      0,
      0,
      `End point of ${title}`,
      endPoint.lat,
      endPoint.lon,
      endPoint.ele
    ));

    return this.storeHike(new Hike(
      null,
      title,
      writerId,
      trackPath,
      city,
      province,
      region,
      length,
      expectedTime,
      ascent,
      maxElevation,
      difficulty,
      description,
      startPointId,
      endPointId
    ));
  }

  // Return the list of all the hikes 
  async loadAllHikes() {
    let hikes = await this.loadAllRowsHike();

    hikes = await Promise.all(
      hikes.map(async (h) => {
        const writer = await UserManager.loadOneByAttributeUser("userId", h.writerId);
        const startPoint = await PointManager.loadOneByAttributePoint("pointId", h.startPoint);
        const expectedTime = h.expectedTime.split(":");
        const hours = expectedTime[0];
        const minutes = expectedTime[1];

        const hike = {
          id: h.hikeId,
          title: h.title,
          writer: `${writer.firstName} ${writer.lastName}`,
          maxElevation: h.maxElevation,
          description: h.description,
          difficulty: h.difficulty,
          length: h.length,
          totalAscent: h.ascent,
          expectedTime: {
            hours: hours,
            minutes: minutes,
          },
          province: h.province,
          city: h.city,
          startPoint: {
            coords: [startPoint.latitude, startPoint.longitude],
          },
        };

        return hike;
      })
    );

    return Promise.resolve(hikes);
  }

  async loadHikeById(hikeId) {
    let hike = await this.loadOneByAttributeHike("hikeId", hikeId);
    const writer = await UserManager.loadOneByAttributeUser("userId", hike.writerId);
    let startPoint = await PointManager.loadOneByAttributePoint("pointId", hike.startPoint);
    let endPoint = await PointManager.loadOneByAttributePoint("pointId", hike.endPoint);

    if (startPoint.hut) {
      const hutName = await HutManager.loadOneByAttributeHut("pointId", startPoint.pointId)
        .then((hut) => hut.hutName);
      startPoint.nameOfLocation = hutName;
    } else if (startPoint.parking) {
      const parkingName = await ParkingLotManager.loadOneByAttributeParkingLot("pointId", startPoint.pointId)
        .then((parking) => parking.parkingName);
      startPoint.nameOfLocation = parkingName;
    }

    if (endPoint.hutId) {
      const hutName = await HutManager.loadOneByAttributeHut("pointId", endPoint.pointId)
        .then((hut) => hut.hutName);
      endPoint.nameOfLocation = hutName;
    } else if (endPoint.parkingId) {
      const parkingName = await ParkingLotManager.loadOneByAttributeParkingLot("pointId", endPoint.pointId)
        .then((parking) => parking.parkingName);
      endPoint.nameOfLocation = parkingName;
    }

    // Retrieving reference points 
    let referencePoints = await HikeRefPointManager.loadAllByAttributeHikeRefPoint("hikeId", hike.hikeId);
    referencePoints = await Promise.all(
      referencePoints.map(async (rf) => {
        const point = await PointManager.loadOneByAttributePoint("pointId", rf.pointId);
        return {
          name: point.nameOfLocation,
          coords: [point.longitude, point.latitude],
        };
      })
    );

    // Retrieving expected time  
    const expectedTime = hike.expectedTime.split(":");
    const hours = expectedTime[0];
    const minutes = expectedTime[1];

    // Retrieving track points
    const gpx = new gpxParser();
    const gpxString = fs.readFileSync(hike.trackPath).toString();
    gpx.parse(gpxString);
    const track = gpx.tracks[0].points.map((p) => [p.lat, p.lon]);

    hike = {
      id: hike.hikeId,
      title: hike.title,
      writer: `${writer.firstName} ${writer.lastName}`,
      maxElevation: hike.maxElevation,
      description: hike.description,
      difficulty: hike.difficulty,
      length: hike.length,
      totalAscent: hike.ascent,
      expectedTime: {
        hours: hours,
        minutes: minutes,
      },
      province: hike.province,
      city: hike.city,
      startPoint: {
        name: startPoint.nameOfLocation,
        coords: [startPoint.latitude, startPoint.longitude],
      },
      endPoint: {
        name: endPoint.nameOfLocation,
        coords: [endPoint.latitude, endPoint.longitude],
      },
      referencePoints: referencePoints,
      track: track,
    };

    return Promise.resolve(hike);
  }

  async getGpxPath(hikeId) {
    const gpxPath = await this.loadOneByAttributeHike("hikeId", hikeId).then(hike => hike.trackPath);

    return Promise.resolve(gpxPath);
  }
}

module.exports = new HikeManager();
