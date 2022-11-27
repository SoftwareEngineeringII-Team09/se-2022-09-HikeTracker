"user strict";

class HikeHut {
  static tableName = "HikeHut";
  
  constructor(hikeId, hutId) {
    this.hikeId = hikeId;
    this.hutId = hutId;
  }
}

module.exports = HikeHut;
