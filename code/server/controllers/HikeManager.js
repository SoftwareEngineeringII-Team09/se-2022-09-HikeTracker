"use strict";

const Hike = require("../dao/model/Hike");
const User = require("../dao/model/User");
const Hut = require("../dao/model/Hut");
const Point = require("../dao/model/Point");

const PersistentManager = require("../dao/PersistentManager");

class HikeManager {
  async defineHike(
    hut_id,
    writer_id,
    track_path,
    region,
    city,
    title,
    length,
    expected_time,
    ascent,
    difficulty,
    description,
    start_point,
    end_point,
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

    const existstartPoint = await PersistentManager.exists(
      Point.tableName,
      "point_id",
      start_point
    );
    if (!existstartPoint) {
      return Promise.reject("404 no start point found");
    }

    const existendPoint = await PersistentManager.exists(
      Point.tableName,
      "point_id",
      end_point
    );
    if (!existendPoint) {
      return Promise.reject("404 no end point found");
    }

    const existReferencePoint = await PersistentManager.exists(
      Point.tableName,
      "point_id",
      reference_point
    );
    if (!existReferencePoint) {
      return Promise.reject("404 no reference point found");
    }

    const existhut = await PersistentManager.exists(
      Hut.tableName,
      "hut_id",
      hut_id
    );
    if (!existhut) {
      return Promise.reject("404 no hut found");
    }

    let newHike = new Hike(
      null,
      hut_id,
      writer_id,
      track_path,
      region,
      city,
      title,
      length,
      expected_time,
      ascent,
      difficulty,
      description,
      start_point,
      end_point,
      reference_point
    );
    let newHikeid = await PersistentManager.store(Hike.tableName, newHike);

    return newHikeid;
  }
}

module.exports = new HikeManager();
