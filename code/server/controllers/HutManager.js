"use strict";

const Hut = require("../dao/model/Hut");
const PersistentManager = require("../dao/PersistentManager");

class HutManager {
  constructor() { }

  async getHutByPointId(pointId) {
    let exists = await PersistentManager.exists(Hut.tableName, "point_id", pointId);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available Hut with point_id = ${pointId}`,
      });
    }
    let hut = await PersistentManager.loadOneByAttribute(Hut.tableName, "point_id", pointId);

    return Promise.resolve(new Hut(
      hut.hut_id,
      hut.hut_name,
      hut.writer_id,
      hut.point_id,
      hut.num_of_beds,
      hut.cost
    ));
  }
}

module.exports = new HutManager();
