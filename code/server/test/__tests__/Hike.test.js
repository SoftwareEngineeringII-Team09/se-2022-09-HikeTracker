const PersistentManager = require("../../dao/PersistentManager");
const HikeManager = require("../../controllers/HikeManager");
const Hike = require("../../dao/model/Hike");
const { clearAll } = require("../utils");

describe("Add Hike", () => {
  /* Test Setup */
  beforeAll(clearAll);
  /* Test Teardown */
  afterAll(clearAll);

  // hiketest = new Hike(
  //   null,
  //   1,
  //   1,
  //   "pathtest",
  //   "test",
  //   "test",
  //   "title",
  //   1333,
  //   "1:20",
  //   7,
  //   "easy",
  //   "This is test",
  //   1,
  //   2,
  //   3
  // );

  // test("define", async () => {
  //   let hikeId = await HikeManager.defineHike(
  //     hiketest.hut_id,
  //     hiketest.writer_id,
  //     hiketest.track_path,
  //     hiketest.region,
  //     hiketest.city,
  //     hiketest.title,
  //     hiketest.length,
  //     hiketest.expected_time,
  //     hiketest.ascent,
  //     hiketest.difficulty,
  //     hiketest.description,
  //     hiketest.start_point,
  //     hiketest.end_point,
  //     hiketest.reference_point
  //   );

  //   hiketest.hike_id = hikeId;
  //   const res = await PersistentManager.loadOneByAttribute(
  //     "Hike",
  //     "hike_id",
  //     hikeId
  //   );

  //   expect(hiketest).toEqual(res);
  //});
});
