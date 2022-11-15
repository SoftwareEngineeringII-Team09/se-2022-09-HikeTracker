const chai = require("chai");
const chaiHttp = require("chai-http");
const Hike = require("../dao/model/Hike");
const { clearAll } = require("./utils");
const fs = require("fs");
const HikeManager = require("../controllers/HikeManager");

chai.use(chaiHttp);
chai.should();

const app = require("../index");
let agent = chai.request.agent(app);

describe("Test Hike API", function () {
  /* Test Setup */
  this.beforeAll(clearAll);
  /* Test Teardown */
  this.afterAll(clearAll);

  it("Should return userId non valid", (done) => {
    const nonExistingUserId = 8;
    const testData = {
      province: 3,
      city: 23,
      title: "title",
      difficulty: "hiker",
      description: "thisistest",
      reference_point: JSON.stringify({
        name: "parking",
        altitude: 1324.22,
        longitude: 234.33,
        city: 23,
        province: 244,
      }),
    };
    agent
      .post(`/api/hikes/${nonExistingUserId}`)
      .field(testData)
      .attach(
        "gpx",
        fs.readFileSync(`gpx/rocciamelone.gpx`),
        `rocciamelone.gpx`
      )
      .then(function (res) {
        res.should.have.status(503);
        done();
      })
      .catch((e) => console.log(e));
  });

  it("Should store successfully", (done) => {
    const testData = {
      province: 3,
      city: 23,
      title: "title",
      difficulty: "hiker",
      description: "thisistest",
      reference_point: JSON.stringify({
        name: "parking",
        altitude: 1324.22,
        longitude: 234.33,
        city: 23,
        province: 244,
      }),
    };
    agent
      .post(`/api/hikes/1`)
      .field(testData)
      .attach(
        "gpx",
        fs.readFileSync(`gpx/rocciamelone.gpx`),
        `rocciamelone.gpx`
      )
      .then(function (res) {
        res.should.have.status(201);
        done();
      })
      .catch((e) => console.log(e));
  });
});
