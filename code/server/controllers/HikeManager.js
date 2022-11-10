"use strict";

const Hike = require("../dao/model/Hike");
const PersistentManager = require("../dao/PersistentManager");

class HikeManager {
  constructor() { }

  async loadAllHikes() {
    let hikes = await PersistentManager.loadAllRows(Hike.tableName);
    if (hikes.length === 0) {
      return Promise.reject({
        code: 404,
        result: "Hikes table is empty",
      });
    }

    return Promise.resolve(hikes.map(hike => new Hike(
      hike.hike_id,
      hike.hut_id,
      hike.writer_id,
      hike.track_path,
      hike.region,
      hike.city,
      hike.title,
      hike.length,
      hike.expected_time,
      hike.ascent,
      hike.difficulty,
      hike.description,
      hike.start_point,
      hike.end_point,
      hike.reference_point
    )));
  }
}

module.exports = new HikeManager();
