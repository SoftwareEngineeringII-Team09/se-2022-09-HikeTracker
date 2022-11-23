"user strict";

class ParkingLot {
  static tableName = "ParkingLot";
  
  constructor(parkingLotId, parkingLotName, pointId, writerId) {
    this.parkingLotId = parkingLotId;
    this.parkingLotName = parkingLotName;
    this.pointId = pointId;
    this.writerId = writerId;
  }
}

module.exports = ParkingLot;
