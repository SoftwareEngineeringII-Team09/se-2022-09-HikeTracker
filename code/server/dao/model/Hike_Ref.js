"user strict";

class Hike_Ref {
  static tableName = "Hike_RefPoint";
  constructor(hike_id, point_id) {
    this.hike_id = hike_id;
    this.point_id = point_id;
  }
}

module.exports = Hike_Ref;
