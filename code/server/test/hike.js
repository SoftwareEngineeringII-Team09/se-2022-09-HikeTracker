const chai = require("chai");
const chaiHttp = require("chai-http");
const Hike = require("../dao/model/Hike");
const { clearAll } = require("./utils");
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

  describe("Add new hike", () => {
    this.beforeAll(async () => {});
  });

  it("Should return userId non valid", (done) => {
    const nonExistingUserId = 8;
    agent.post(`/api/hikes/${nonExistingUserId}`).then(function (res) {
      res.should.have.status(404);
      res.should.have.property("error");
      done();
    });
  });

  it("Should store successfully", (done) => {
    agent.post(`/api/hikes/1`).then(function (res) {
      res.should.have.status(201);
      done();
    });
  });
});
