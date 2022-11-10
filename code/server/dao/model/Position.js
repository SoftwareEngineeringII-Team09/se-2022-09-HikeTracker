"user strict";

class Position {
  static tableName = "Position";
  constructor(
    position_id,
    altitude,
    latitude,
    longitude,
    city,
    province,
    address
  ) {
    this.position_id = position_id;
    this.altitude = altitude;
    this.latitude = latitude;
    this.longitude = longitude;
    this.city = city;
    this.province = province;
    this.address = address;
  }
}

module.exports = Position;
