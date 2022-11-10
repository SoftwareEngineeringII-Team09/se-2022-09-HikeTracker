"user strict";
//15 attributes
class Hike {
  static tableName = "Hike";
  constructor(
    hike_id,
    hut_id,
    writer_id,
    track_path,
    region,
    city,
    title,
    length,
    expected_time,
    ascent,
    difficulty,
    description,
    start_point,
    end_point,
    reference_point
  ) {
    this.hike_id = hike_id;
    this.hut_id = hut_id;
    this.writer_id = writer_id;
    this.track_path = track_path;
    this.region = region;
    this.city = city;
    this.title = title;
    this.length = length;
    this.expected_time = expected_time;
    this.ascent = ascent;
    this.difficulty = difficulty;
    this.description = description;
    this.start_point = start_point;
    this.end_point = end_point;
    this.reference_point = reference_point;
  }
}

module.exports = Hike;
