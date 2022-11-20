"user strict";

class HutDailySchedule {
  static tableName = "HutDailySchedule";
  
  constructor(hutId, day, openTime, closeTime) {
    this.hutId = hutId;
    this.day = day;
    this.openTime = openTime;
    this.closeTime = closeTime;
  }
}

module.exports = HutDailySchedule;
