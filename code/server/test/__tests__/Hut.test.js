const PersistentManager = require("../../dao/PersistentManager");
const HutManager = require("../../controllers/HutManager");
const Hut = require("../../dao/model/Hut");
const Point = require("../../dao/model/Point");
const { clearAll } = require("../utils");

describe("Test", () => {

  /* Test Setup */
  beforeAll(clearAll);
  /* Test Teardown */
  afterAll(clearAll);

  const point = {
    type: "start point",
    parking: 1,
    hut: 0,
    name_of_location: "name",
    latitude: 44.5742508675903,
    longitude: 6.98268919251859,
    altitude: 1757.43,
    city: 4017,
    province: 4,
    address: "address"
  };

  test("getHutByPointId", async () => {
    await PersistentManager.deleteAll(Hut.tableName);
    let pointId = await PersistentManager.store(Point.tableName, point)
    const hut = {
      hut_name: "name",
      writer_id: 1,
      point_id: pointId,
      num_of_beds: 4,
      cost: 50.0
    };
    await PersistentManager.store(Hut.tableName, hut);

    const hutLoaded = await HutManager.getHutByPointId(pointId);

    expect(hutLoaded.hutName).toEqual(hut.hut_name);
    expect(hutLoaded.writerId).toEqual(hut.writer_id);
    expect(hutLoaded.pointId).toEqual(pointId);
    expect(hutLoaded.numOfBeds).toEqual(hut.num_of_beds);
    expect(hutLoaded.cost).toEqual(hut.cost);
  });

  test("getHutByPointId with non existing pointId", async () => {
    await PersistentManager.deleteAll(Hut.tableName);
    let pointId = await PersistentManager.store(Point.tableName, point)
    const hut = {
      hut_name: "name",
      writer_id: 1,
      point_id: pointId,
      num_of_beds: 4,
      cost: 50.0
    };
    const expectedError = {
      code: 404,
      result: `No available Hut with point_id = ${pointId+1}`,
    };

    await PersistentManager.store(Hut.tableName, hut);

    const hutLoaded = HutManager.getHutByPointId(pointId+1);

    expect(hutLoaded).rejects.toEqual(expectedError);
  });

});
