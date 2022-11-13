"user strict";

class ParkingLot {
  static tableName = "ParkingLot";

  constructor(parkingId, parkingName, writerId, pointId) {
    this.parkingId = parkingId;
    this.parkingName = parkingName;
    this.writerId = writerId;
    this.pointId = pointId;
  }
}

module.exports = ParkingLot;
