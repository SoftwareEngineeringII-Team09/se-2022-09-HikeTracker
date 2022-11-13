"user strict";

class ParkingLot {
  static tableName = "ParkingLot";

  constructor(parkingId, parkingName, writerId, pointId) {
    this.parking_id = parkingId;
    this.parking_name = parkingName;
    this.writer_id = writerId;
    this.point_id = pointId;
  }
}

module.exports = ParkingLot;
