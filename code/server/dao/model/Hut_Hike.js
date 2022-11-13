"user strict";

class Hut_Hike {
  static tableName = "Hut_Hike";
  constructor(hike_id, hut_id) {
    this.hike_id = hike_id;
    this.hut_id = hut_id;
  }
}

module.exports = Hut_Hike;
