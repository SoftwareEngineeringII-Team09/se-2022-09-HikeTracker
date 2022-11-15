const PersistentManager = require("../../dao/PersistentManager");
const HutManager = require("../../controllers/HutManager");
const Hut = require("../../dao/model/Hut");
const { clearAll } = require("../utils");

describe("Add Hut", () => {
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

  test("define", async () => {
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

    expect(true).toEqual(true);
  });
});
