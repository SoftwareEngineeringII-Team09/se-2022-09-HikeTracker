"user strict";

class ParkingLot {
  static tableName = "ParkingLot";
  
  constructor(parkingId, parkingName, pointId, writerId) {
    this.parkingId = parkingId;
    this.parkingName = parkingName;
    this.pointId = pointId;
    this.writerId = writerId;
  }
}

module.exports = ParkingLot;
