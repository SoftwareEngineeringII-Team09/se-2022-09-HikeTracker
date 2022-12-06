"user strict";

class Point {
  static tableName = "Point";

  constructor(
    pointId,
    type,
    parkingLot,
    hut,
    nameOfLocation,
    latitude,
    longitude
  ) {
    this.pointId = pointId;
    this.type = type;
    this.parkingLot = parkingLot;
    this.hut = hut;
    this.nameOfLocation = nameOfLocation;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

module.exports = Point;
