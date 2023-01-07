"user strict";

class Hut {
  static tableName = "Hut";
  
  constructor(hutId, hutName, pointId, writerId, city, province, region, numOfBeds, cost, altitude, phone, email, website,hutImage) {
    this.hutId = hutId;
    this.hutName = hutName;
    this.pointId = pointId;
    this.writerId = writerId;
    this.city = city;
    this.province = province;
    this.region = region;
    this.numOfBeds = numOfBeds;
    this.cost = cost;
    this.altitude = altitude;
    this.phone = phone;
    this.email = email;
    this.website = website;
    this.hutImage = hutImage;
  }
}

module.exports = Hut;
