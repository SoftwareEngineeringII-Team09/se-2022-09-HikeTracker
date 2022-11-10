"user strict";

class ParkingLot {
  static tableName = "ParkingLot";
  constructor(
    parking_id,
    parking_name,
    writer_id,
    position_id,
    num_of_cars,
    cost
  ) {
    this.parking_id = parking_id;
    this.parking_name = parking_name;
    this.writer_id = writer_id;
    this.position_id = position_id;
    this.num_of_cars = num_of_cars;
    this.cost = cost;
  }
}

module.exports = ParkingLot;
