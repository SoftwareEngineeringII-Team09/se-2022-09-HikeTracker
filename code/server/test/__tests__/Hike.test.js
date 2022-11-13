const PersistentManager = require("../../dao/PersistentManager");
const HikeManager = require("../../controllers/HikeManager");
const Point = require("../../dao/model/Point");
const Hike = require("../../dao/model/Hike");
const { clearAll } = require("../utils");

describe("Test", () => {

  /* Test Setup */
  beforeAll(clearAll);
  /* Test Teardown */
  afterAll(clearAll);

  const hike = {
    writer_id: 1,
    track_path: "gpx/monte_ferra.gpx",
    city: 4017,
    province: 4,
    title: "Trail to Monte Ferra",
    length: 13.0,
    expected_time: "01:20",
    ascent: 237.7,
    max_elevation: 3094.14,
    difficulty: "Professional hiker",
    description: "Hike description",
    start_point: 1,
    end_point: 2
  };

  const point = {
    type: "start point",
    parking: 0,
    hut: 0,
    name_of_location: "Start point of Trial to Monte Ferra",
    latitude: 44.5742508675903,
    longitude: 6.98268919251859,
    altitude: 1757.43,
    city: 4017,
    province: 4,
    address: "address"
  };

  const emptyListOfHikes = {
    code: 404,
    result: "Hikes table is empty"
  };

  test("loadAllHikes", async () => {
    let hikes = [];
    await PersistentManager.store(Point.tableName, point);
    await PersistentManager.store(Point.tableName, point);
    hikes.push(await PersistentManager.store(Hike.tableName, hike));
    hikes.push(await PersistentManager.store(Hike.tableName, hike));
    hikes.push(await PersistentManager.store(Hike.tableName, hike));

    const hikesList = await HikeManager.loadAllHikes();

    expect(hikesList.length).toEqual(hikes.length);
  });

  test("loadAllHikes with empty hikes", async () => {
    await PersistentManager.store(Point.tableName, point);
    await PersistentManager.store(Point.tableName, point);
    await PersistentManager.deleteAll(Hike.tableName);

    const hikesList = HikeManager.loadAllHikes();

    expect(hikesList).rejects.toEqual(emptyListOfHikes);
  })

  test("loadHikeById", async () => {
    await PersistentManager.store(Point.tableName, point);
    await PersistentManager.store(Point.tableName, point);
    const hikeId = await PersistentManager.store(Hike.tableName, hike);

    const hikeLoaded = await HikeManager.loadHikeById(hikeId);

    expect(hikeLoaded.id).toEqual(hikeId);
    expect(hikeLoaded.title).toEqual(hike.title);
    expect(hikeLoaded.maxElevation).toEqual(hike.max_elevation);
    expect(hikeLoaded.description).toEqual(hike.description);
    expect(hikeLoaded.difficulty).toEqual(hike.difficulty);
    expect(hikeLoaded.length).toEqual(hike.length);
    expect(hikeLoaded.totalAscent).toEqual(hike.ascent);
    expect(hikeLoaded.province).toEqual(hike.province);
    expect(hikeLoaded.city).toEqual(hike.city);
  });

  test("loadHikeById with non existing hikeId", async () => {
    await PersistentManager.store(Point.tableName, point);
    await PersistentManager.store(Point.tableName, point);
    const hikeId = await PersistentManager.store(Hike.tableName, hike);
    const expectedError = {
      code: 404,
      result: `No available Hike with hike_id = ${hikeId+1}`,
    };

    const hikeLoaded = HikeManager.loadHikeById(hikeId+1);

    expect(hikeLoaded).rejects.toEqual(expectedError);
  });

  test("getGpxTrackById", async () => {
    await PersistentManager.store(Point.tableName, point);
    await PersistentManager.store(Point.tableName, point);
    const hikeId = await PersistentManager.store(Hike.tableName, hike);

    const gpx = await HikeManager.getGpxTrackById(hikeId);

    expect(gpx).toEqual(hike.track_path);
  });

  test("getGpxTrackById with non existing hikeId", async () => {
    await PersistentManager.store(Point.tableName, point);
    await PersistentManager.store(Point.tableName, point);
    const hikeId = await PersistentManager.store(Hike.tableName, hike);
    const expectedError = {
      code: 404,
      result: `No available Hike with hike_id = ${hikeId+1}`,
    };

    const gpx = HikeManager.getGpxTrackById(hikeId+1);

    expect(gpx).rejects.toEqual(expectedError);
  });

});
