"user strict";

class HikeRef {
  static tableName = "HikeRefPoint";
  
  constructor(hikeId, pointId) {
    this.hikeId = hikeId;
    this.pointId = pointId;
  }
}

module.exports = HikeRef;
