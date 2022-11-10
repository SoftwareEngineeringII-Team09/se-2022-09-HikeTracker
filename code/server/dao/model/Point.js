"user strict";

class Point {
  static tableName = "Point";
  constructor(
    point_id,
    position_id,
    type,
    parking_id,
    hut_id,
    name_of_location
  ) {
    this.point_id = point_id;
    this.position_id = position_id;
    this.type = type;
    this.parking_id = parking_id;
    this.hut_id = hut_id;
    this.name_of_location = name_of_location;
  }
}

module.exports = Point;
