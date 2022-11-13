const PersistentManager = require("../../dao/PersistentManager");
const HutManager = require("../../controllers/HutManager");
const Hut = require("../../dao/model/Hut");
const Position = require("../../dao/model/Position");
const { clearAll } = require("../utils");

describe("Add Hut", () => {
  /* Test Setup */
  beforeAll(clearAll);
  /* Test Teardown */
  afterAll(clearAll);

  // let huttest = new Hut(null, "testname", 1, null, 12, 50);

  // let positiontest = new Position(null, 123, 345, 234, "test", "test", "test");

  // test("define", async () => {
  //   let newHut = await HutManager.defineHut(
  //     huttest.hut_name,
  //     huttest.writer_id,
  //     huttest.num_of_beds,
  //     huttest.cost,
  //     positiontest.altitude,
  //     positiontest.latitude,
  //     positiontest.longitude,
  //     positiontest.city,
  //     positiontest.province,
  //     positiontest.address
  //   );

  //   huttest.hut_id = newHut.hut_id;

  //   huttest.position_id = newHut.position_id;
  //   const res = await PersistentManager.loadOneByAttribute(
  //     "Hut",
  //     "hut_id",
  //     newHut.hut_id
  //   );

  //   expect(huttest).toEqual(res);
  // });
});
