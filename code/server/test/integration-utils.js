const fs = require("fs");
const PersistentManager = require("../dao/PersistentManager");
const Hike = require("../dao/model/Hike");
const Point = require("../dao/model/Point");
const Hut = require("../dao/model/Hut");
const ParkingLot = require("../dao/model/ParkingLot");
const HikeHut = require("../dao/model/HikeHut");
const HikeParkingLot = require("../dao/model/HikeParkingLot");
const HikeRefPoint = require("../dao/model/HikeRefPoint");
const HutDailySchedule = require("../dao/model/HutDailySchedule");
const User = require("../dao/model/User");
const UserManager = require('../controllers/UserManager');
const e = require("express");

/* Reset DB content */
exports.clearAll = async function () {
	await PersistentManager.deleteAll(HikeHut.tableName);
	await PersistentManager.deleteAll(HikeParkingLot.tableName);
	await PersistentManager.deleteAll(HikeRefPoint.tableName);
	await PersistentManager.deleteAll(HutDailySchedule.tableName);
	await PersistentManager.deleteAll(Hut.tableName);
	await PersistentManager.deleteAll(ParkingLot.tableName);
	await PersistentManager.deleteAll(Hike.tableName);
	await PersistentManager.deleteAll(Point.tableName);
	await PersistentManager.deleteAll(User.tableName);

	return Promise.resolve();
};


/*****************************************************************************************************
*              Hike
*****************************************************************************************************/
exports.postHike = function (agent, itShould, expectedHTTPStatus, writerId, title, expectedTime, difficulty, description, city, province, region, testGpx) {
	const testHikeData = { title: title, expectedTime: expectedTime, difficulty: difficulty, description: description, city: city, province: province, region: region };
	it(`Should ${itShould}`, function (done) {
		agent.post(`/api/hikes/writers/${writerId}`)
			.field(testHikeData)
			.attach("gpx", fs.readFileSync(`gpx/${testGpx}`), testGpx)
			.then(function (res) {
				res.should.have.status(expectedHTTPStatus);
				done();
			}).catch(e => console.log(e));
	});
}

exports.getAllHikes = function (agent, itShould, expectedHTTPStatus, expectedLength) {
	it(`Should ${itShould}`, function (done) {
		agent.get("/api/hikes")
			.then(function (res) {
				res.should.have.status(expectedHTTPStatus);
				res.body.should.be.a("array");
				res.body.length.should.be.eql(expectedLength);
				done();
			}).catch(e => console.log(e));
	});
}

exports.getHikeById = function (agent, itShould, expectedHTTPStatus, hikeId, expectedHike = undefined) {
	it(`Should ${itShould}`, function (done) {
		if (expectedHTTPStatus === 200) {
			agent.get(`/api/hikes/${hikeId}`)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					res.body.hikeId.should.be.eql(hikeId);
					res.body.title.should.be.eql(expectedHike.title);
					res.body.city.should.be.eql(expectedHike.city);
					res.body.province.should.be.eql(expectedHike.province);
					res.body.region.should.be.eql(expectedHike.region);
					res.body.length.should.be.eql(expectedHike.length);
					res.body.ascent.should.be.eql(expectedHike.ascent);
					res.body.maxElevation.should.be.eql(expectedHike.maxElevation);
					res.body.difficulty.should.be.eql(expectedHike.difficulty);
					res.body.description.should.be.eql(expectedHike.description);
					done();
				}).catch(e => console.log(e));
		} else {
			agent.get(`/api/hikes/${hikeId}`)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					done();
				}).catch(e => console.log(e));
		}
	});
}

exports.getHikeGpxById = function (agent, itShould, expectedHTTPStatus, hikeId) {
	it(`Should ${itShould}`, function (done) {
		agent.get(`/api/hikes/${hikeId}`)
			.then(function (res) {
				res.should.have.status(expectedHTTPStatus);
				done();
			}).catch(e => console.log(e));
	});
}


/*****************************************************************************************************
*              Hut
*****************************************************************************************************/
exports.postHut = function (agent, itShould, expectedHTTPStatus, writerId, hutName, city, province, region, numOfBeds, cost, latitude, longitude, altitude) {
	const testHutData = { hutName: hutName, city: city, province: province, region: region, numOfBeds: numOfBeds, cost: cost, latitude: latitude, longitude: longitude, altitude: altitude };
	it(`Should ${itShould}`, function (done) {
		agent.post(`/api/huts/writers/${writerId}`)
			.send(testHutData)
			.then(function (res) {
				res.should.have.status(expectedHTTPStatus);
				done();
			}).catch(e => console.log(e));
	});
}


/*****************************************************************************************************
*              ParkingLot
*****************************************************************************************************/
exports.postParkingLot = function (agent, itShould, expectedHTTPStatus, writerId, parkingLotName, latitude, longitude, altitude) {
	const testParkingLotData = { parkingLotName: parkingLotName, latitude: latitude, longitude: longitude, altitude: altitude };
	it(`Should ${itShould}`, function (done) {
		agent.post(`/api/parkingLots/writers/${writerId}`)
			.send(testParkingLotData)
			.then(function (res) {
				res.should.have.status(expectedHTTPStatus);
				done();
			}).catch(e => console.log(e));
	});
}

/*****************************************************************************************************
*              User
*****************************************************************************************************/
exports.postUser = function (agent, itShould, expectedHTTPStatus, userId, email, password, salt, firstname, lastname, mobile, role, active) {
	const testUserData = { userId: userId, email: email, password: password, salt: salt, firstname: firstname, lastname: lastname, mobile: mobile, role: role, active: active};
	it(`Should ${itShould}`, function (done) {
		agent.post(`/api/users/${usersId}`)
			.field(testUserData)
			.then(function (res) {
				res.should.have.status(expectedHTTPStatus);
				done();
			}).catch(e => console.log(e));
	});
}

exports.getAllUsers = function (agent, itShould, expectedHTTPStatus, expectedLength) {
	it(`Should ${itShould}`, function (done) {
		agent.get("/api/users")
			.then(function (res) {
				res.should.have.status(expectedHTTPStatus);
				res.body.should.be.a("array");
				res.body.length.should.be.eql(expectedLength);
				done();
			}).catch(e => console.log(e));
	});
}

exports.getUserById = function (agent, itShould, expectedHTTPStatus, userId, expectedUser = undefined) {
	it(`Should ${itShould}`, function (done) {
		if (expectedHTTPStatus === 200) {
			agent.get(`/api/users/${userId}`)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					res.body.userId.should.be.eql(userId);
					res.body.email.should.be.eql(expectedUser.email);
					res.body.password.should.be.eql(expectedUser.password);
					res.body.salt.should.be.eql(expectedUser.salt);
					res.body.firstname.should.be.eql(expectedUser.firstname);
					res.body.lastname.should.be.eql(expectedUser.lastname);
					res.body.mobile.should.be.eql(expectedUser.mobile);
					res.body.role.should.be.eql(expectedUser.role);
					res.body.active.should.be.eql(expectedUser.active);
					done();
				}).catch(e => console.log(e));
		} else {
			agent.get(`/api/users/${userId}`)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					done();
				}).catch(e => console.log(e));
		}
	});
}

exports.getUserByEmail = function (agent, itShould, expectedHTTPStatus, email, expectedUser = undefined) {
	it(`Should ${itShould}`, function (done) {
		if (expectedHTTPStatus === 200) {
			agent.get(`/api/users/${email}`)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					res.body.email.should.be.eql(email);
					res.body.userId.should.be.eql(expectedUser.userId);
					res.body.password.should.be.eql(expectedUser.password);
					res.body.salt.should.be.eql(expectedUser.salt);
					res.body.firstname.should.be.eql(expectedUser.firstname);
					res.body.lastname.should.be.eql(expectedUser.lastname);
					res.body.mobile.should.be.eql(expectedUser.mobile);
					res.body.role.should.be.eql(expectedUser.role);
					res.body.active.should.be.eql(expectedUser.active);
					done();
				}).catch(e => console.log(e));
		} else {
			agent.get(`/api/users/${email}`)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					done();
				}).catch(e => console.log(e));
		}
	});
}

/*****************************************************************************************************
*              Others
*****************************************************************************************************/