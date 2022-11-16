const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require("fs");
const Hike = require('../dao/model/Hike');
const Point = require('../dao/model/Point');
const HikeManager = require("../controllers/HikeManager");
const PersistentManager = require('../dao/PersistentManager');
const { clearAll } = require("./utils");

chai.use(chaiHttp);
chai.should();

const app = require("../index");
let agent = chai.request.agent(app);

// POST /api/hikes/:id
describe("POST /api/hikes/:id", function () {
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

// GET /api/hikes - test with hikes data in the DB
describe("GET /api/hikes - test with hikes data in the DB", function () {
	const hikeData = {
		writer_id: 1,
		track_path: "gpx/monte_ferra.gpx",
		city: 4018,
		province: 4,
		title: "Trail to Monte Ferra",
		length: 13.0,
		expected_time: "01:20",
		ascent: 237.7,
		max_elevation: 3094.14,
		difficulty: "Professional hiker",
		description: "Hike description",
	};

	const startPoint = {
		type: "start point",
		parking: 0,
		hut: 0,
		name_of_location: "Start point of Trial to Monte Ferra",
		latitude: 44.5742508675903,
		longitude: 6.98268919251859,
		altitude: 1757.43,
		city: 4017,
		province: 4,
		address: "address"
	};

	const endPoint = {
		type: "end point",
		parking: 0,
		hut: 0,
		name_of_location: "Start point of Trial to Monte Ferra",
		latitude: 44.0,
		longitude: 45.0,
		altitude: 1700.0,
		city: 4017,
		province: 4,
		address: "address"
	};

	const hikes = [];

	/* Test Setup */
	this.beforeAll(async () => {
		await clearAll();
		const startPointId = await PersistentManager.store(Point.tableName, startPoint);
		const endPointId = await PersistentManager.store(Point.tableName, endPoint);
		const hike = { ...hikeData, start_point: startPointId, end_point: endPointId };
		hikes.push(await PersistentManager.store(Hike.tableName, hike));
		hikes.push(await PersistentManager.store(Hike.tableName, hike));
		hikes.push(await PersistentManager.store(Hike.tableName, hike));
	})

	/* Test Teardown */
	this.afterAll(clearAll);

	it('Should return the list of all hikes', (done) => {
		agent.get('/api/hikes/')
			.then(function (res) {
				res.should.have.status(200);
				done();
			}).catch(e => console.log(e));
	});

});

// GET /api/hikes - test without hikes data in the DB
describe("GET /api/hikes - test without hikes data in the DB", function () {

	/* Test Setup */
	this.beforeAll(clearAll)
	/* Test Teardown */
	this.afterAll(clearAll);

	it('Should return 404', (done) => {
		agent.get('/api/hikes/')
			.then(function (res) {
				res.should.have.status(404);
				done();
			}).catch(e => console.log(e));
	});
});

// GET /api/hikes/:hikeId
describe("GET /api/hikes/:hikeId", function () {
	const hikeData = {
		writer_id: 1,
		track_path: "gpx/monte_ferra.gpx",
		city: 4018,
		province: 4,
		title: "Trail to Monte Ferra",
		length: 13.0,
		expected_time: "01:20",
		ascent: 237.7,
		max_elevation: 3094.14,
		difficulty: "Professional hiker",
		description: "Hike description",
	};

	const startPoint = {
		type: "start point",
		parking: 0,
		hut: 0,
		name_of_location: "Start point of Trial to Monte Ferra",
		latitude: 44.5742508675903,
		longitude: 6.98268919251859,
		altitude: 1757.43,
		city: 4017,
		province: 4,
		address: "address"
	};

	const endPoint = {
		type: "end point",
		parking: 0,
		hut: 0,
		name_of_location: "Start point of Trial to Monte Ferra",
		latitude: 44.0,
		longitude: 45.0,
		altitude: 1700.0,
		city: 4017,
		province: 4,
		address: "address"
	};

	let hikeId;

	/* Test Setup */
	this.beforeAll(async () => {
		await clearAll();
		const startPointId = await PersistentManager.store(Point.tableName, startPoint);
		const endPointId = await PersistentManager.store(Point.tableName, endPoint);
		const hike = { ...hikeData, start_point: startPointId, end_point: endPointId };
		hikeId = await PersistentManager.store(Hike.tableName, hike);
	})

	/* Test Teardown */
	this.afterAll(clearAll);

	it('Should return the hike by :hikeId', (done) => {
		agent.get(`/api/hikes/${hikeId}`)
			.then(function (res) {
				res.should.have.status(200);
				done();
			}).catch(e => console.log(e));
	});

	it('Should return 404', (done) => {
		const nonExistingHikeId = hikeId + 1; 
		agent.get(`/api/hikes/${nonExistingHikeId}`)
			.then(function (res) {
				res.should.have.status(404);
				done();
			}).catch(e => console.log(e));
	});

	it('Should provide error for wrong :hikeId format', (done) => {
		agent.get('/api/hikes/wrongHikeIdFormat')
			.then(function (res) {
				res.should.have.status(422);
				res.body.should.have.property('error');
				res.body.error.should.have.property('value');
				res.body.error.should.have.property('msg');
				res.body.error.value.should.equal('wrongHikeIdFormat');
				res.body.error.msg.should.equal('Provide a valid hikeId');
				done();
			});
	});
});

// GET /api/hikes/:hikeId/download
describe("GET /api/hikes/:hikeId/download", function () {
	const hikeData = {
		writer_id: 1,
		track_path: "gpx/monte_ferra.gpx",
		city: 4018,
		province: 4,
		title: "Trail to Monte Ferra",
		length: 13.0,
		expected_time: "01:20",
		ascent: 237.7,
		max_elevation: 3094.14,
		difficulty: "Professional hiker",
		description: "Hike description",
	};

	const startPoint = {
		type: "start point",
		parking: 0,
		hut: 0,
		name_of_location: "Start point of Trial to Monte Ferra",
		latitude: 44.5742508675903,
		longitude: 6.98268919251859,
		altitude: 1757.43,
		city: 4017,
		province: 4,
		address: "address"
	};

	const endPoint = {
		type: "end point",
		parking: 0,
		hut: 0,
		name_of_location: "Start point of Trial to Monte Ferra",
		latitude: 44.0,
		longitude: 45.0,
		altitude: 1700.0,
		city: 4017,
		province: 4,
		address: "address"
	};

	let hikeId;

	/* Test Setup */
	this.beforeAll(async () => {
		await clearAll();
		const startPointId = await PersistentManager.store(Point.tableName, startPoint);
		const endPointId = await PersistentManager.store(Point.tableName, endPoint);
		const hike = { ...hikeData, start_point: startPointId, end_point: endPointId };
		hikeId = await PersistentManager.store(Hike.tableName, hike);
	})

	/* Test Teardown */
	this.afterAll(clearAll);

	it('Should return the gpx file by :hikeId', (done) => {
		agent.get(`/api/hikes/${hikeId}/download`)
			.then(function (res) {
				res.should.have.status(200);
				done();
			}).catch(e => console.log(e));
	});

	it('Should return 404', (done) => {
		const nonExistingHikeId = hikeId + 1; 
		agent.get(`/api/hikes/${nonExistingHikeId}/download`)
			.then(function (res) {
				res.should.have.status(404);
				done();
			}).catch(e => console.log(e));
	});

	it('Should provide error for wrong :hikeId format', (done) => {
		agent.get('/api/hikes/wrongHikeIdFormat/download')
			.then(function (res) {
				res.should.have.status(422);
				res.body.should.have.property('error');
				res.body.error.should.have.property('value');
				res.body.error.should.have.property('msg');
				res.body.error.value.should.equal('wrongHikeIdFormat');
				res.body.error.msg.should.equal('Provide a valid hikeId');
				done();
			});
	});
});