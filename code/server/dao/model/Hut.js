"user strict";

class Hut {
  static tableName = "Hut";

  constructor(hutId, hutName, writerId, pointId, numOfBeds, cost) {
    this.hutId = hutId;
    this.hutName = hutName;
    this.writerId = writerId;
    this.pointId = pointId;
    this.numOfBeds = numOfBeds;
    this.cost = cost;
  }
}

module.exports = Hut;
