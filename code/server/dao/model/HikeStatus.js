"user strict";

class HikeStatus {
  static tableName = "HikeStatus";
  
  constructor(statusId, hikeId, status, startTime, endTime) {
    this.statusId = statusId;
    this.hikeId = hikeId;
    this.status = status;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

module.exports = HikeStatus;
