"user strict";

class Point {
  static tableName = "Point";

  constructor(
    pointId, type, parking, hut, nameOfLocation, latitude, longitude, altitude, city, province, address
  ) {
    this.pointId = pointId;
    this.type = type;
    this.parking = parking;
    this.hut = hut;
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
