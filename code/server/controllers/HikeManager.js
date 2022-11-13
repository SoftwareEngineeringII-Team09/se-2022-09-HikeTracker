"use strict";

const Hike = require("../dao/model/Hike");
const User = require("../dao/model/User");
const Hike_Ref = require("../dao/model/Hike_Ref");
const Point = require("../dao/model/Point");
const PersistentManager = require("../dao/PersistentManager");

class HikeManager {
  async defineHike(
    writer_id,
    track_path,
    province,
    city,
    title,
    length,
    expected_time,
    ascent,
    difficulty,
    description,
    start_pointX,
    start_pointY,
    start_pointA,
    end_pointX,
    end_pointY,
    end_pointA,
    reference_point
  ) {
    const existwriter = await PersistentManager.exists(
      User.tableName,
      "user_id",
      writer_id
    );
    if (!existwriter) {
      return Promise.reject("404 no userId found");
    }

    let Startpoint = new Point(
      null,
      "start point",
      null,
      null,
      null,
      start_pointX,
      start_pointY,
      start_pointA,
      city,
      province,
      null
    );
    let StartPointId = await PersistentManager.store(
      Point.tableName,
      Startpoint
    );

    let Endpoint = new Point(
      null,
      "end point",
      null,
      null,
      null,
      end_pointX,
      end_pointY,
      end_pointA,
      city,
      province,
      null
    );
    let EndPointId = await PersistentManager.store(Point.tableName, Endpoint);

    let newHike = new Hike(
      null,
      writer_id,
      track_path,
      city,
      title,
      province,
      length,
      expected_time,
      ascent,
      difficulty,
      description,
      StartPointId,
      EndPointId
    );

    let newHikeid = await PersistentManager.store(Hike.tableName, newHike);

    for (let i = 0; i < reference_point.length; i++) {
      let p = reference_point[i];

      //add new tuple in point table get id
      let Refpoint = new Point(
        null,
        "reference point",
        null,
        null,
        p["name"],
        p["latitude"],
        p["longitude"],
        p["altitude"],
        p["city"],
        p["province"],
        null
      );
      let newRefPointId = await PersistentManager.store(
        Point.tableName,
        Refpoint
      );

      //add new tuple in hike_ref table

      let newHikeRef = new Hike_Ref(newHikeid, newRefPointId);
      await PersistentManager.store(Hike_Ref.tableName, newHikeRef);
    }

    return newHikeid;
  }
}

module.exports = new HikeManager();
