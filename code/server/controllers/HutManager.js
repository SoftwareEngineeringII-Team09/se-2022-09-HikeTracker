"use strict";

const Hut = require("../dao/model/Hut");

const User = require("../dao/model/User");
const Position = require("../dao/model/Position");
const PersistentManager = require("../dao/PersistentManager");

class HutManager {
  async defineHut(
    hut_name,
    writer_id,
    num_of_beds,
    cost,
    altitude,
    latitude,
    longitude,
    city,
    province,
    address
  ) {
    const existwriter = await PersistentManager.exists(
      User.tableName,
      "user_id",
      writer_id
    );
    if (!existwriter) {
      return Promise.reject("404 no writerId found");
    }

    let newPosition = new Position(
      null,
      altitude,
      latitude,
      longitude,
      city,
      province,
      address
    );
    let newPositionid = await PersistentManager.store(
      Position.tableName,
      newPosition
    );
    let newHut = new Hut(
      null,
      hut_name,
      writer_id,
      newPositionid,
      num_of_beds,
      cost
    );
    let newHutid = await PersistentManager.store(Hut.tableName, newHut);
    let res = {
      hut_id: newHutid,
      position_id: newPositionid,
    };

    return res;
  }
}

module.exports = new HutManager();
