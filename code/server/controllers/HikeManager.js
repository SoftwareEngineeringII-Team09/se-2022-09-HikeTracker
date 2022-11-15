"use strict";

const Hike = require("../dao/model/Hike");
const User = require("../dao/model/User");
const Hike_Ref = require("../dao/model/Hike_Ref");
const Point = require("../dao/model/Point");
const fs = require("fs");
const PersistentManager = require("../dao/PersistentManager");
const UserManager = require("../controllers/UserManager");
const PointManager = require("../controllers/PointManager");
const ParkingLotManager = require("../controllers/ParkingLotManager");
const HutManager = require("../controllers/HutManager");
const gpxParser = require("gpxparser");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

const gpx = new gpxParser();

class HikeManager {
  async defineHike(
    writer_id,
    province,
    city,
    title,
    difficulty,
    description,
    reference_point,
    fileName
  ) {
    const existwriter = await PersistentManager.exists(
      User.tableName,
      "user_id",
      writer_id
    );
    if (!existwriter) {
      return Promise.reject("404 no userId found");
    }

    //parser gpx
    let gpxString = fs.readFileSync(`gpx/${fileName}`).toString();
    gpx.parse(gpxString);
    let track = gpx.tracks[0];
    let track_path = "gpx/" + fileName;
    let ascent = track.elevation.max - track.elevation.min;
    let length = track.distance.total;
    let start_pointX = track.points[0]["lat"];
    let start_pointY = track.points[0]["lon"];
    let start_pointA = track.points[0]["ele"];
    let lastNum = track.points.length - 1;
    let end_pointX = track.points[lastNum]["lat"];
    let end_pointY = track.points[lastNum]["lon"];
    let end_pointA = track.points[lastNum]["ele"];
    let max_ele = track.elevation.max;
    let endTime = track.points[lastNum]["time"];
    let startTime = track.points[0]["time"];
    const StartDate = dayjs(startTime);
    const EndDate = dayjs(endTime);
    let expected_time = dayjs.duration(EndDate.diff(StartDate)).format("HH:MM");

    let Startpoint = new Point(
      null,
      "start point",
      0,
      0,
      `Start point of ${title}`,
      start_pointX,
      start_pointY,
      start_pointA,
      city,
      province,
      null
    );
    let SPId = await PersistentManager.store(Point.tableName, Startpoint);

    let Endpoint = new Point(
      null,
      "end point",
      0,
      0,
      `End point of ${title}`,
      end_pointX,
      end_pointY,
      end_pointA,
      city,
      province,
      null
    );
    let EPId = await PersistentManager.store(Point.tableName, Endpoint);

    let newHike = new Hike(
      null,
      writer_id,
      track_path,
      city,
      province,
      `Trail to ${title}`,
      length,
      expected_time,
      ascent,
      max_ele,
      difficulty,
      description,
      SPId,
      EPId
    );

    let newHId = await PersistentManager.store(Hike.tableName, newHike);
    for (let i = 0; i < reference_point.length; i++) {
      let p = reference_point[i];

      //add new tuple in point table get id
      let Refpoint = new Point(
        null,
        "reference point",
        0,
        0,
        p["name"],
        p["latitude"],
        p["longitude"],
        p["altitude"],
        p["city"],
        p["province"],
        null
      );
      let newRPId = await PersistentManager.store(Point.tableName, Refpoint);

      //add new tuple in hike_ref table

      let newHikeRef = new Hike_Ref(newHId, newRPId);
      await PersistentManager.store(Hike_Ref.tableName, newHikeRef);
    }
    let resIds = {
      StartPointId: SPId,
      EndPointId: EPId,
      newHikeid: newHId,
    };
    return resIds;
  }

  async loadAllHikes() {
    let hikes = await PersistentManager.loadAllRows(Hike.tableName);
    if (hikes.length === 0) {
      return Promise.reject({
        code: 404,
        result: "Hikes table is empty",
      });
    }

    hikes = await Promise.all(
      hikes.map(async (h) => {
        const writer = await UserManager.getUserById(h.writer_id);
        const startPoint = await PointManager.getPointById(h.start_point);
        const expectedTime = h.expected_time.split(":");
        const hours = expectedTime[0];
        const minutes = expectedTime[1];

        const hike = {
          id: h.hike_id,
          title: h.title,
          writer: `${writer.firstName} ${writer.lastName}`,
          maxElevation: h.max_elevation,
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
    let exists = await PersistentManager.exists(
      Hike.tableName,
      "hike_id",
      hikeId
    );
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available Hike with hike_id = ${hikeId}`,
      });
    }

    let hike = await PersistentManager.loadOneByAttribute(
      Hike.tableName,
      "hike_id",
      hikeId
    );
    const writer = await UserManager.getUserById(hike.writer_id);
    let startPoint = await PointManager.getPointById(hike.start_point);
    let endPoint = await PointManager.getPointById(hike.end_point);

    if (startPoint.hut) {
      const hutName = await HutManager.getHutByPointId(startPoint.pointId).then(
        (hut) => hut.hutName
      );
      startPoint.nameOfLocation = hutName;
    } else if (startPoint.parking) {
      const parkingName = await ParkingLotManager.getParkingByPointId(
        startPoint.pointId
      ).then((parking) => parking.parkingName);
      startPoint.nameOfLocation = parkingName;
    }

    if (endPoint.hutId) {
      const hutName = await HutManager.getHutById(endPoint.hutId).then(
        (hut) => hut.hutName
      );
      endPoint.nameOfLocation = hutName;
    } else if (endPoint.parkingId) {
      const parkingName = await ParkingLotManager.getParkingById(
        endPoint.parkingId
      ).then((parking) => parking.parkingName);
      endPoint.nameOfLocation = parkingName;
    }

    let referencePoints = await PersistentManager.loadAllByAttribute(
      "Hike_RefPoint",
      "hike_id",
      hike.hike_id
    );
    if (referencePoints.length !== 0) {
      referencePoints = await Promise.all(
        referencePoints.map(async (rf) => {
          const point = await PointManager.getPointById(rf.point_id).catch(
            (exception) => {
              if (exception.code !== 404) Promise.reject(exception);
            }
          );
          return {
            name: point.nameOfLocation,
            coords: [point.longitude, point.latitude],
          };
        })
      );
    }

    const expectedTime = hike.expected_time.split(":");
    const hours = expectedTime[0];
    const minutes = expectedTime[1];

    const gpx = new gpxParser();
    const gpxString = fs.readFileSync(hike.track_path).toString();
    gpx.parse(gpxString);
    const track = gpx.tracks[0].points.map((p) => [p.lat, p.lon]);

    hike = {
      id: hike.hike_id,
      title: hike.title,
      writer: `${writer.firstName} ${writer.lastName}`,
      maxElevation: hike.max_elevation,
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

  async getGpxTrackById(hikeId) {
    let exists = await PersistentManager.exists(
      Hike.tableName,
      "hike_id",
      hikeId
    );
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available Hike with hike_id = ${hikeId}`,
      });
    }
    let gpxFile = await PersistentManager.loadOneByAttribute(
      Hike.tableName,
      "hike_id",
      hikeId
    ).then((hike) => hike.track_path);

    return Promise.resolve(gpxFile);
  }
}

module.exports = new HikeManager();
