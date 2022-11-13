"use strict";

const Hut = require("../dao/model/Hut");
const PersistentManager = require("../dao/PersistentManager");

class HutManager {
  constructor() { }

  async getHutById(hutId) {
    let exists = await PersistentManager.exists(Hut.tableName, "hut_id", hutId);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available Hut with hut_id = ${hutId}`,
      });
    }
    let hut = await PersistentManager.loadOneByAttribute(Hut.tableName, "hut_id", hutId);

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
