"use strict";

const Point = require("../dao/model/Point");
const PersistentManager = require("../dao/PersistentManager");

class PointManager {
  constructor() { }

  async getPointById(pointId) {
    let exists = await PersistentManager.exists(Point.tableName, "point_id", pointId);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available Point with point_id = ${pointId}`,
      });
    }
    let point = await PersistentManager.loadOneByAttribute(Point.tableName, "point_id", pointId);

    return Promise.resolve(new Point(
      point.point_id,
      point.type,
      point.parking_id,
      point.hut_id,
      point.name_of_location,
      point.latitude,
      point.longitude,
      point.altitude,
      point.city,
      point.province,
      point.address
    ));
  }
}

module.exports = new PointManager();