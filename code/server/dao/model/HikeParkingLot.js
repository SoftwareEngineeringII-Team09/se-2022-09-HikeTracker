"user strict";

class HikeParkingLot {
  static tableName = "HikeParkingLot";
  
  constructor(hikeId, parkingId) {
    this.hikeId = hikeId;
    this.parkingId = parkingId;
  }
}

module.exports = HikeParkingLot;