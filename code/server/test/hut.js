const chai = require("chai");
const chaiHttp = require("chai-http");
const Hut = require("../dao/model/Hut");
const { clearAll } = require("./utils");
const HutManager = require("../controllers/HutManager");

chai.use(chaiHttp);
chai.should();

const app = require("../index");
let agent = chai.request.agent(app);

describe("Test Hut", function () {
  /* Test Setup */
  this.beforeAll(clearAll);
  /* Test Teardown */
  this.afterAll(clearAll);

  it("Should return userId non valid", (done) => {
    const nonExistingUserId = 8;
    let testData = {
      hut_name: "hutName2",
      num_of_beds: 5,
      cost: 20,
      altitude: 1333,
      latitude: 1245,
      longitude: 564,
      city: "test",
      province: "test",
      address: "null",
    };
    agent
      .post(`/api/huts/${nonExistingUserId}`)
      .send(testData)
      .then(function (res) {
        res.should.have.status(503);
        // res.should.have.property("error");
        // expect(res.body.error).to.equal(
        //   "Something went wrong, please try again"
        // );
        done();
      });
  });

  it("Add successfully", (done) => {
    let testData = {
      hut_name: "hutName2",
      num_of_beds: 5,
      cost: 20,
      altitude: 1333,
      latitude: 1245,
      longitude: 564,
      city: "test",
      province: "test",
      address: "null",
    };

    agent
      .post(`/api/huts/1`)
      .send(testData)
      .then(function (res) {
        res.should.have.status(201);
        //expect(res.body.hutId).to.have.property(`hut_id`);

        done();
      });
  });
});
