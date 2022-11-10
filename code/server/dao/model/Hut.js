"user strict";

class Hut {
  static tableName = "Hut";
  constructor(hut_id, hut_name, writer_id, position_id, num_of_beds, cost) {
    this.hut_id = hut_id;
    this.hut_name = hut_name;
    this.writer_id = writer_id;
    this.position_id = position_id;
    this.num_of_beds = num_of_beds;
    this.cost = cost;
  }
}

module.exports = Hut;
