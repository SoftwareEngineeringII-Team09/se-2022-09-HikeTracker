"user strict";

class Point {
  static tableName = "Point";
  constructor(
    point_id,
    type,
    parking,
    hut,
    name_of_location,
    latitude,
    longitude,
    altitude,
    city,
    province,
    address
  ) {
    this.point_id = point_id;
    this.type = type;
    this.parking = parking;
    this.hut = hut;
    this.name_of_location = name_of_location;
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
    this.city = city;
    this.province = province;
    this.address = address;
  }
}

module.exports = Point;
