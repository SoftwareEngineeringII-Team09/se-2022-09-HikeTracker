"user strict";

class ParkingLot {
  static tableName = "ParkingLot";
  
  constructor(parkingLotId, parkingLotName, pointId, writerId,  altitude, capacity) {
    this.parkingLotId = parkingLotId;
    this.parkingLotName = parkingLotName;
    this.pointId = pointId;
    this.writerId = writerId;
    this.altitude = altitude;
    this.capacity = capacity;
  }
}

module.exports = ParkingLot;
