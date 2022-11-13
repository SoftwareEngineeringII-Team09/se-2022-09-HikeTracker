"use strict";

const ParkingLot = require("../dao/model/ParkingLot");
const PersistentManager = require("../dao/PersistentManager");

class ParkingLotManager {
  constructor() { }

  async getParkingLotByPointId(pointId) {
    let exists = await PersistentManager.exists(ParkingLot.tableName, "point_id", pointId);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available ParkingLot with point_id = ${pointId}`,
      });
    }
    let parking = await PersistentManager.loadOneByAttribute(ParkingLot.tableName, "point_id", pointId);

    return Promise.resolve(new ParkingLot(
      parking.parking_id,
      parking.parking_name,
      parking.writer_id,
      parking.point_id
    ));
  }
}

module.exports = new ParkingLotManager();
