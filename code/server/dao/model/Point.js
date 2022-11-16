"user strict";

class Point {
  static tableName = "Point";

  constructor(
    pointId,
    type,
    parking,
    hut,
    nameOfLocation,
    latitude,
    longitude,
    altitude,
    city,
    province,
    address
  ) {
    this.point_id = pointId;
    this.type = type;
    this.parking = parking;
    this.hut = hut;
    this.name_of_location = nameOfLocation;
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
    this.city = city;
    this.province = province;
    this.address = address;
  }
}

module.exports = Point;
