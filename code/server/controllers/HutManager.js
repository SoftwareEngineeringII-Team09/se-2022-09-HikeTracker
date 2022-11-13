"use strict";

const Hut = require("../dao/model/Hut");
const Point = require("../dao/model/Point");
const User = require("../dao/model/User");

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

    let newPoint = new Point(
      null,
      null,
      "0",
      "1",
      null,
      latitude,
      longitude,
      altitude,
      city,
      province,
      address
    );

    let newPointid = await PersistentManager.store(Point.tableName, newPoint);

    let newHut = new Hut(
      null,
      hut_name,
      writer_id,
      newPointid,
      num_of_beds,
      cost
    );
    let newHutid = await PersistentManager.store(Hut.tableName, newHut);
    let res = {
      hut_id: newHutid,
      point_id: newPointid,
    };

    return res;
  }
}

module.exports = new HutManager();
