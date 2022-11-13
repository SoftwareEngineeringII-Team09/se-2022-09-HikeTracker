"user strict";

class Point {
  static tableName = "Point";

  constructor(
    pointId, type, parkingId, hutId, nameOfLocation, latitude, longitude, altitude, city, province, address
  ) {
    this.pointId = pointId;
    this.type = type;
    this.parkingId = parkingId;
    this.hutId = hutId;
    this.nameOfLocation = nameOfLocation;
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
    this.city = city;
    this.province = province;
    this.address = address;
  }
}

module.exports = Point;