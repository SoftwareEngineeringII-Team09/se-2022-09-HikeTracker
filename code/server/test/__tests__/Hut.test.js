const PersistentManager = require("../../dao/PersistentManager");
const HutManager = require("../../controllers/HutManager");
const Hut = require("../../dao/model/Hut");
const Point = require("../../dao/model/Point");
const { clearAll } = require("../utils");

describe("Test defineHut()", () => {
  /* Test Setup */
  beforeAll(clearAll);
  /* Test Teardown */
  afterAll(clearAll);
  
  let huttest = new Hut(null, "testname", 1, null, 12, 50);

  let HutTestInfo = {
    altitude: 111.11,
    latitude: 222.22,
    longitude: 333.33,
    city: 4,
    province: 202,
    address: null,
  };

  test("Define a new hut", async () => {
    let newHut = await HutManager.defineHut(
      huttest.hut_name,
      huttest.writer_id,
      huttest.num_of_beds,
      huttest.cost,
      HutTestInfo.altitude,
      HutTestInfo.latitude,
      HutTestInfo.longitude,
      HutTestInfo.city,
      HutTestInfo.province,
      HutTestInfo.address
    );

    huttest.hut_id = newHut.hut_id;

    const res = await PersistentManager.loadOneByAttribute(
      "Hut",
      "hut_id",
      newHut.hut_id
    );

    expect(res.hut_name).toEqual(huttest.hut_name);
    expect(res.writer_id).toEqual(huttest.writer_id);
    expect(res.num_of_beds).toEqual(huttest.num_of_beds);
    expect(res.cost).toEqual(huttest.cost);
  });
});

describe("Test getHutByPointId()", () => {
  /* Test Setup */
  beforeAll(clearAll);
  /* Test Teardown */
  afterAll(clearAll);

  const point = {
    type: "start point",
    parking: 0,
    hut: 1,
    name_of_location: "name",
    latitude: 44.5742508675903,
    longitude: 6.98268919251859,
    altitude: 1757.43,
    city: 4017,
    province: 4,
    address: "address"
  };

  test("Get hut by pointId", async () => {
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
    expect(hutLoaded.hut_name).toEqual(hut.hut_name);
    expect(hutLoaded.writer_id).toEqual(hut.writer_id);
    expect(hutLoaded.point_id).toEqual(pointId);
    expect(hutLoaded.num_of_beds).toEqual(hut.num_of_beds);
    expect(hutLoaded.cost).toEqual(hut.cost);
  });

  test("Get hut with non existing pointId", async () => {
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
