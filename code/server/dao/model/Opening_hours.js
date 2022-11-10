"user strict";

class Opening_hours {
  static tableName = "Opening_Hours";
  constructor(openhour_id, business_id, type, day, open_time, close_time) {
    this.openhour_id = openhour_id;
    this.business_id = business_id;
    this.type = type;
    this.day = day;
    this.open_time = open_time;
    this.close_time = close_time;
  }
}

module.exports = Opening_hours;
