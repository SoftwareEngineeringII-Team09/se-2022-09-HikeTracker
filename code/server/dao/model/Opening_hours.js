"user strict";

class Opening_hours {
  static tableName = "Opening_Hours";
  constructor(openhour_id, day, open_time, close_time) {
    this.openhour_id = openhour_id;
    this.day = day;
    this.open_time = open_time;
    this.close_time = close_time;
  }
}

module.exports = Opening_hours;
