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
    altitude
  ) {
    this.pointId = pointId;
    this.type = type;
    this.parking = parking;
    this.hut = hut;
    this.nameOfLocation = nameOfLocation;
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
  }
}

module.exports = Point;
