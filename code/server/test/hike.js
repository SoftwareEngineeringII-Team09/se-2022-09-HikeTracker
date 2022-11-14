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

  // it("Should return userId non valid", (done) => {
  //   const nonExistingUserId = 8;
  //   agent
  //     .post(`/api/hikes/${nonExistingUserId}`)
  //     .field("province", 4)
  //     .field("city", 23)
  //     .field("title", "title")
  //     .field("difficulty", "hiker")
  //     .field("description", "thisistest")
  //     .attach(
  //       "gpx",
  //       fs.readFileSync(`gpx/bivacco_berardo.gpx`),
  //       `bivacco_berardo.gpx`
  //     )
  //     .then(function (res) {
  //       console.log("res");
  //       res.should.have.status(404);

  //       //res.should.have.property("error");
  //       done();
  //     })
  //     .catch(function (err) {
  //       console.log("err");
  //       throw err;
  //     });

  // });

  it("Should store successfully", (done) => {
    let testData = {
      province: 3,
      city: 23,
      title: "title",
      difficulty: "hiker",
      description: "thisistest",
    };
    agent
      .post(`/api/hikes/1`)
      .send(testData)
      // .attach(
      //   "gpx",
      //   fs.readFileSync(`gpx/bivacco_berardo.gpx`),
      //   `bivacco_berardo.gpx`
      // )
      .then(function (res) {
        console.log(res);
        res.should.have.status(201);
        done();
      });
  });
});
