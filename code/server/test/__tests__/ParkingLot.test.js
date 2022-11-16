const PersistentManager = require("../../dao/PersistentManager");
const ParkingLotManager = require("../../controllers/ParkingLotManager");
const ParkingLot = require("../../dao/model/ParkingLot");
const Point = require("../../dao/model/Point");
const { clearAll } = require("../utils");

describe("Test", () => {

  /* Test Setup */
  beforeAll(clearAll);
  /* Test Teardown */
  afterAll(clearAll);

  /* test("loadHikeById", async () => {
    expect(true).toEqual(true);
  }); */

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

  test("getParkingLotByPointId", async () => {
    let pointId = await PersistentManager.store(Point.tableName, point)
    const parking = {
      parking_name: "name",
      writer_id: 1,
      point_id: pointId,
    };
    await PersistentManager.store(ParkingLot.tableName, parking);

    const parkingLoaded = await ParkingLotManager.getParkingLotByPointId(pointId);

    expect(parkingLoaded.parking_name).toEqual(parking.parking_name);
    expect(parkingLoaded.writer_id).toEqual(parking.writer_id);
    expect(parkingLoaded.point_id).toEqual(pointId);
  });

  test("getParkingLotByPointId with non existing pointId", async () => {
    let pointId = await PersistentManager.store(Point.tableName, point)
    const parking = {
      parking_name: "name",
      writer_id: 1,
      point_id: pointId,
    };
    const expectedError = {
      code: 404,
      result: `No available ParkingLot with point_id = ${pointId+1}`,
    };

    await PersistentManager.store(ParkingLot.tableName, parking);

    const parkingLoaded = ParkingLotManager.getParkingLotByPointId(pointId+1);

    expect(parkingLoaded).rejects.toEqual(expectedError);
  });

});
