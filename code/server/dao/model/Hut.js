"user strict";

class Hut {
  static tableName = "Hut";

  constructor(hutId, hutName, writerId, pointId, numOfBeds, cost) {
    this.hut_id = hutId;
    this.hut_name = hutName;
    this.writer_id = writerId;
    this.point_id = pointId;
    this.num_of_beds = numOfBeds;
    this.cost = cost;
  }
}

module.exports = Hut;
