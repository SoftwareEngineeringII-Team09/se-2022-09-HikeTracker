const PersistentManager = require("../../dao/PersistentManager");
const HikeManager = require("../../controllers/HikeManager");
const Hike = require("../../dao/model/Hike");
const { clearAll } = require("../utils");

describe("Add Hike", () => {
  /* Test Setup */
  beforeAll(clearAll);
  /* Test Teardown */
  afterAll(clearAll);

  const hiketest = {
    writer_id: 1,
    track_path: "gpx/test.gpx",
    city: 4017,
    province: 4,
    title: "Monte Ferra",
    length: 13.0,
    expected_time: "01:20",
    ascent: 237.7,
    max_elevation: 3094.14,
    difficulty: "Professional hiker",
    description: "Hike description",
    start_point: null,
    end_point: null,
  };

  const hikeMoreInfo = {
    start_pointX: 111,
    start_pointY: 234,
    start_pointA: 343,
    end_pointX: 234.44,
    end_pointY: 111.33,
    end_pointA: 45.0,
    reference_point: [
      {
        name: "parking",
        altitude: 1324.22,
        longitude: 234.33,
        city: 23,
        province: 244,
      },
      {
        name: "fountain",
        altitude: 1324.22,
        longitude: 234.33,
        city: 23,
        province: 244,
      },
    ],
  };

  const startPoint = {
    type: "start point",
    parking: 0,
    hut: 0,
    name_of_location: `Start point of ${hiketest.title}`,
    latitude: hikeMoreInfo.start_pointX,
    longitude: hikeMoreInfo.start_pointY,
    altitude: hikeMoreInfo.start_pointA,
    city: hiketest.city,
    province: hiketest.province,
    address: null,
  };

  const endPoint = {
    type: "end point",
    parking: 0,
    hut: 0,
    name_of_location: `End point of ${hiketest.title}`,
    latitude: hikeMoreInfo.end_pointX,
    longitude: hikeMoreInfo.end_pointY,
    altitude: hikeMoreInfo.end_pointA,
    city: hiketest.city,
    province: hiketest.province,
    address: null,
  };

  test("define", async () => {
    let resIds = await HikeManager.defineHike(
      hiketest.writer_id,
      hiketest.track_path,
      hiketest.province,
      hiketest.city,
      hiketest.title,
      hiketest.length,
      hiketest.expected_time,
      hiketest.ascent,
      hiketest.max_ele,
      hiketest.difficulty,
      hiketest.description,
      hikeMoreInfo.start_pointX,
      hikeMoreInfo.start_pointY,
      hikeMoreInfo.start_pointA,
      hikeMoreInfo.end_pointX,
      hikeMoreInfo.end_pointY,
      hikeMoreInfo.end_pointA,
      hikeMoreInfo.reference_point
    );

    //1: check point table 2 position added
    let startPointId = resIds.StartPointId;
    let endPointId = resIds.EndPointId;
    const startRes = await PersistentManager.loadOneByAttribute(
      "Point",
      "point_id",
      startPointId
    );
    startPoint["point_id"] = startPointId;
    expect(startRes).toEqual(startPoint);

    const endRes = await PersistentManager.loadOneByAttribute(
      "Point",
      "point_id",
      endPointId
    );
    endPoint["point_id"] = endPointId;
    expect(endRes).toEqual(endPoint);

    // //2: check hike table
    hiketest.hike_id = resIds.newHikeid;
    hiketest.title = `Trail to ${hiketest.title}`;
    hiketest.start_point = startPointId;
    hiketest.end_point = endPointId;

    const res = await PersistentManager.loadOneByAttribute(
      "Hike",
      "hike_id",
      resIds.newHikeid
    );
    (res.max_elevation = 3094.14), expect(hiketest).toEqual(res);
  });
});
