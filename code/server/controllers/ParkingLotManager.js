"use strict";

const ParkingLot = require("../dao/model/ParkingLot");
const PersistentManager = require("../dao/PersistentManager");

class ParkingLotManager {
  constructor() { }

  async getParkingLotById(parkingId) {
    let exists = await PersistentManager.exists(ParkingLot.tableName, "parking_id", parkingId);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available ParkingLot with parking_id = ${parkingId}`,
      });
    }
    let parking = await PersistentManager.loadOneByAttribute(ParkingLot.tableName, "parking_id", parkingId);

    return Promise.resolve(new ParkingLot(
      parking.parking_id,
      parking.parking_name,
      parking.writer_id,
      parking.point_id
    ));
  }
}

module.exports = new ParkingLotManager();
