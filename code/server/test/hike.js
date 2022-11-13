const chai = require('chai');
const chaiHttp = require('chai-http');
const Hike = require('../dao/model/Hike');
const Point = require('../dao/model/Point');
const { clearAll } = require("./utils");
const HikeManager = require('../controllers/HikeManager');
const PersistentManager = require('../dao/PersistentManager');

chai.use(chaiHttp);
chai.should();

const app = require('../index');
let agent = chai.request.agent(app);

describe("Test", function () {

	/* Test Setup */
	this.beforeAll(clearAll);
	/* Test Teardown */
	this.afterAll(clearAll);

	describe('Test GET for hikes', () => {
		const hike = {
			writer_id: 1,
			track_path: "gpx/monte_ferra.gpx",
			city: 4017,
			province: 4,
			title: "Trail to Monte Ferra",
			length: 13.0,
			expected_time: "01:20",
			ascent: 237.7,
			max_elevation: 3094.14,
			difficulty: "Professional hiker",
			description: "Hike description",
			start_point: 1,
			end_point: 2
		};

		const point = {
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

		const hikes = [];

		this.beforeAll(async () => {
			await PersistentManager.store(Point.tableName, point);
			await PersistentManager.store(Point.tableName, point);
			hikes.push(await PersistentManager.store(Hike.tableName, hike));
			hikes.push(await PersistentManager.store(Hike.tableName, hike));
			hikes.push(await PersistentManager.store(Hike.tableName, hike));
		});

		it('Should return a list of hikes', (done) => {
			agent.get('/api/hikes/')
				.then(function (res) {
					res.should.have.status(200);
					res.body.should.have.property('hikes');
					done();
				});
		});

		it('Should return a hike', (done) => {
			agent.get(`/api/hikes/${hikes[0]}`)
				.then(function (res) {
					res.should.have.status(200);
					res.body.should.have.property('hike');
					res.body.hike.should.have.property('id');
					res.body.hike.should.have.property('title');
					res.body.hike.should.have.property('writer');
					res.body.hike.should.have.property('maxElevation');
					res.body.hike.should.have.property('description');
					res.body.hike.should.have.property('difficulty');
					res.body.hike.should.have.property('length');
					res.body.hike.should.have.property('totalAscent');
					res.body.hike.should.have.property('expectedTime');
					res.body.hike.should.have.property('province');
					res.body.hike.should.have.property('city');
					res.body.hike.should.have.property('startPoint');
					res.body.hike.should.have.property('endPoint');
					res.body.hike.should.have.property('referencePoints');
					res.body.hike.should.have.property('track');
					done();
				});
		});

		it('Should provide error for wrong hikeId format', (done) => {
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

		it('Should provide error for non existing hikeId', (done) => {
			const nonExistingHikeId = hikes[hikes.length - 1] + 1;
			agent.get(`/api/hikes/${nonExistingHikeId}`)
				.then(function (res) {
					res.should.have.status(404);
					res.body.should.have.property('error');
					res.body.error.should.equal(`No available Hike with hike_id = ${nonExistingHikeId}`);
					done();
				});
		});

		describe('Test GET for downloading a hike gpx', () => {

			it('Should return a gpx file', (done) => {
				agent.get(`/api/hikes/${hikes[0]}/download`)
					.then(function (res) {
						res.should.have.status(200);
						done();
					});
			});			

			it('Should provide error for wrong hikeId format', (done) => {
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

			it('Should provide error for non existing hikeId', (done) => {
				const nonExistingHikeId = hikes[hikes.length - 1] + 1;
				agent.get(`/api/hikes/${nonExistingHikeId}/download`)
					.then(function (res) {
						res.should.have.status(404);
						res.body.should.have.property('error');
						res.body.error.should.equal(`No available Hike with hike_id = ${nonExistingHikeId}`);
						done();
					});
			});

		})

	});

});