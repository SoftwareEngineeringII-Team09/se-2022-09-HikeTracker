"user strict";

class Hike {
  static tableName = "Hike";

  constructor(
    hikeId,
    title,
    writerId,
    trackPath,
    city,
    province,
    region,
    length,
    expectedTime,
    ascent,
    maxElevation,
    difficulty,
    description,
    startPoint,
    endPoint,
    hikeImage,
  ) {
    this.hikeId = hikeId;
    this.title = title;
    this.writerId = writerId;
    this.trackPath = trackPath;
    this.city = city;
    this.province = province;
    this.region = region;
    this.length = length;
    this.expectedTime = expectedTime;
    this.ascent = ascent;
    this.maxElevation = maxElevation;
    this.difficulty = difficulty;
    this.description = description;
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.hikeImage = hikeImage;
  }
}

module.exports = Hike;
