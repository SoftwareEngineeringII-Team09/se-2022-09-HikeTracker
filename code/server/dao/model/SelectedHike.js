"user strict";

class SelectedHike {
  static tableName = "SelectedHike";
  
  constructor(selectedHikeId, hikeId, hikerId,status, startTime, endTime) {
    this.selectedHikeId = selectedHikeId;
    this.hikeId = hikeId;
    this.hikerId = hikerId;
    this.status = status;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

module.exports = SelectedHike;
