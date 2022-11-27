"user strict";

class HikeParkingLot {
  static tableName = "HikeParkingLot";
  
  constructor(hikeId, parkingLotId) {
    this.hikeId = hikeId;
    this.parkingLotId = parkingLotId;
  }
}

module.exports = HikeParkingLot;