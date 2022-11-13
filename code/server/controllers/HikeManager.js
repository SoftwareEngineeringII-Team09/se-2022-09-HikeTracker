"use strict";

const Hike = require("../dao/model/Hike");
const PersistentManager = require("../dao/PersistentManager");
const UserManager = require("../controllers/UserManager");
const PointManager = require("../controllers/PointManager");
const ParkingLotManager = require("../controllers/ParkingLotManager");
const HutManager = require("../controllers/HutManager");
const fs = require("fs");
const gpxParser = require("gpxparser");

class HikeManager {
  constructor() { }

  async loadAllHikesForVisitor() {
    let hikes = await PersistentManager.loadAllRows(Hike.tableName);
    if (hikes.length === 0) {
      return Promise.reject({
        code: 404,
        result: "Hikes table is empty"
      });
    }

    hikes = await Promise.all(hikes.map(async (h) => {
      const writer = await UserManager.getUserById(h.writer_id);
      const startPoint = await PointManager.getPointById(h.start_point);
      const expectedTime = h.expected_time.split(":");
      const hours = parseInt(expectedTime[0]);
      const minutes = parseInt(expectedTime[1]);

      return {
        id: h.hike_id,
        title: h.title,
        writer: `${writer.firstName} ${writer.lastName}`,
        description: h.description,
        difficulty: h.difficulty,
        length: h.length,
        totalAscent: h.ascent,
        expectedTime: {
          hours: hours,
          minutes: minutes
        },
        province: h.province,
        city: h.city,
        startPoint: {
          coords: [startPoint.latitude, startPoint.longitude]
        }
      };
    }));

    return Promise.resolve(hikes);
  }

  async loadAllHikesForHiker() {
    let hikes = await PersistentManager.loadAllRows(Hike.tableName);
    if (hikes.length === 0) {
      return Promise.reject({
        code: 404,
        result: "Hikes table is empty"
      });
    }

    hikes = await Promise.all(hikes.map(async (h) => {
      const writer = await UserManager.getUserById(h.writer_id);
      let startPoint = await PointManager.getPointById(h.start_point);
      let endPoint = await PointManager.getPointById(h.end_point);

      if (startPoint.hutId) {
        const hutName = await HutManager.getHutById(startPoint.hutId).then(hut => hut.hutName);
        startPoint.nameOfLocation = hutName;
      } else if (startPoint.parkingId) {
        const parkingName = await ParkingLotManager.getParkingById(startPoint.parkingId).then(parking => parking.parkingName);
        startPoint.nameOfLocation = parkingName;
      }

      if (endPoint.hutId) {
        const hutName = await HutManager.getHutById(endPoint.hutId).then(hut => hut.hutName);
        endPoint.nameOfLocation = hutName;
      } else if (endPoint.parkingId) {
        const parkingName = await ParkingLotManager.getParkingById(endPoint.parkingId).then(parking => parking.parkingName);
        endPoint.nameOfLocation = parkingName;
      }

      let referencePoints = await PersistentManager.loadAllByAttribute("Hike_RefPoint", "hike_id", h.hike_id);
      if (referencePoints.length !== 0) {
        referencePoints = await Promise.all(referencePoints.map(async (rf) => {
          const pointName = await PointManager.getPointById(rf.point_id).catch((exception) => {
            if (exception.code !== 404)
              Promise.reject(exception);
          });
          return {
            name: pointName
          };
        }))
      }

      const expectedTime = h.expected_time.split(":");
      const hours = parseInt(expectedTime[0]);
      const minutes = parseInt(expectedTime[1]);

      const gpx = new gpxParser();
      const gpxString = fs.readFileSync(h.track_path).toString();
      gpx.parse(gpxString);
      const track = gpx.tracks[0].points.map(p => [p.lat, p.lon]);

      return {
        id: h.hike_id,
        title: h.title,
        writer: `${writer.firstName} ${writer.lastName}`,
        description: h.description,
        difficulty: h.difficulty,
        length: h.length,
        totalAscent: h.ascent,
        expectedTime: {
          hours: hours,
          minutes: minutes
        },
        province: h.province,
        city: h.city,
        startPoint: {
          name: startPoint.nameOfLocation
        },
        endPoint: {
          name: endPoint.nameOfLocation
        },
        referencePoints: referencePoints,
        track: track
      };
    }))

    return Promise.resolve(hikes);
  }
}

module.exports = new HikeManager();
