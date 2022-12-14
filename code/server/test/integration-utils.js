const fs = require("fs");
const PersistentManager = require("../dao/PersistentManager");
const Hike = require("../dao/model/Hike");
const Point = require("../dao/model/Point");
const Hut = require("../dao/model/Hut");
const ParkingLot = require("../dao/model/ParkingLot");
const HikeHut = require("../dao/model/HikeHut");
const HikeRefPoint = require("../dao/model/HikeRefPoint");
const HutDailySchedule = require("../dao/model/HutDailySchedule");
const User = require("../dao/model/User");
const SelectedHike = require("../dao/model/SelectedHike");

/* Reset DB content */
exports.clearAll = async function () {
	await PersistentManager.deleteAll(HikeHut.tableName);
	await PersistentManager.deleteAll(HikeRefPoint.tableName);
	await PersistentManager.deleteAll(HutDailySchedule.tableName);
	await PersistentManager.deleteAll(Hut.tableName);
	await PersistentManager.deleteAll(ParkingLot.tableName);
	await PersistentManager.deleteAll(SelectedHike.tableName);
	await PersistentManager.deleteAll(Hike.tableName);
	await PersistentManager.deleteAll(Point.tableName);
	await PersistentManager.deleteAll(User.tableName);

	return Promise.resolve();
};

/*****************************************************************************************************
*              Auth
*****************************************************************************************************/
exports.postSignup = function (agent, itShould, expectedHTTPStatus, role, firstname, lastname, mobile, email, password) {
	const testUserData = { role: role, firstname: firstname, lastname: lastname, mobile: mobile, email: email, password: password };
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/signup').send(testUserData).then(function (res) {
			res.should.have.status(expectedHTTPStatus);
			done();
		}).catch(loginError => console.log(loginError));
	});
}

exports.putVerificationCode = function (agent, itShould, expectedHTTPStatus, userId) {
	const testUserIdData = { userId: userId };
	it(`Should ${itShould}`, function (done) {
		agent.put('/api/auth/sendVerificationCode').send(testUserIdData).then(function (res) {
			res.should.have.status(expectedHTTPStatus);
			done();
		}).catch(loginError => console.log(loginError));
	});
}

exports.putVerifyEmail = function (agent, itShould, expectedHTTPStatus, userId, token) {
	const testVerifyEmailData = { userId: userId, token: token };
	it(`Should ${itShould}`, function (done) {
		agent.put('/api/auth/verifyEmail').send(testVerifyEmailData).then(function (res) {
			res.should.have.status(expectedHTTPStatus);
			done();
		}).catch(loginError => console.log(loginError));
	});
}

exports.postLogin = function (agent, itShould, expectedHTTPStatus, username, password) {
	const testCredentials = { username: username, password: password };
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(testCredentials).then(function (res) {
			res.should.have.status(expectedHTTPStatus);
			done();
		}).catch(loginError => console.log(loginError));
	});
}

exports.postLogin = function (agent, itShould, expectedHTTPStatus, username, password) {
	const testCredentials = { username: username, password: password };
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(testCredentials).then(function (res) {
			res.should.have.status(expectedHTTPStatus);
			done();
		}).catch(loginError => console.log(loginError));
	});
}

exports.deleteLogout = function (agent, itShould, expectedHTTPStatus, credentials) {
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.delete("/api/auth/logout").then(function (res) {
				res.should.have.status(expectedHTTPStatus);
				done();
			}).catch(logoutError => console.log(logoutError))
		}).catch(loginError => console.log(loginError));
	});
}

exports.getCurrent = function (agent, itShould, expectedHTTPStatus, credentials) {
	it(`Should ${itShould}`, function (done) {
		if (expectedHTTPStatus == 200) {
			agent.post('/api/auth/login/password').send(credentials).then(function () {
				agent.get("/api/auth/current")
					.then(function (res) {
						res.should.have.status(expectedHTTPStatus);
						agent.delete("/api/auth/logout").then(function () {
							done();
						}).catch(logoutError => console.log(logoutError))
					}).catch(e => console.log(e));
			}).catch(loginError => console.log(loginError));
		} else {
			agent.get('/api/auth/current').then(function (res) {
				res.should.have.status(expectedHTTPStatus);
				done();
			}).catch(loginError => console.log(loginError));
		}
	});
}


/*****************************************************************************************************
*              Hike
*****************************************************************************************************/

exports.postHike = function (agent, itShould, expectedHTTPStatus, credentials, title, expectedTime, difficulty, description, city, province, region, testGpx,testImage) {
	const testHikeData = { title: title, expectedTime: expectedTime, difficulty: difficulty, description: description, city: city, province: province, region: region };
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.post("/api/hikes")
				.field(testHikeData)
				.attach("gpx", fs.readFileSync(`gpx/${testGpx}`), testGpx)
				.attach("hikeImage", fs.readFileSync(`hikeImage/${testImage}`), testImage)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
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

exports.getHikeById = function (agent, itShould, expectedHTTPStatus, hikeId, expectedHike = null) {
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

exports.getHikeGpxById = function (agent, itShould, expectedHTTPStatus, credentials, hikeId) {
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.get(`/api/hikes/${hikeId}/download`)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	})
}

exports.getHikeByWriterId = function (agent, itShould, expectedHTTPStatus, credentials, hikerId) {
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.get(`/api/hikes/writers/${hikerId}`)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	})
}


exports.getHikePotentialStartEndPoints = function (agent, itShould, expectedHTTPStatus, credentials, hikeId) {
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.get(`/api/hikes/${hikeId}/potentialStartEndPoints`)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	})
}

exports.putHikeStartEndPoints = function (agent, itShould, expectedHTTPStatus, credentials, hikeId, newStartPointType, newStartPointId, newEndPointType, newEndPointId) {
	const newStartPoint = { type: newStartPointType, id: newStartPointId };
	const newEndPoint = { type: newEndPointType, id: newEndPointId };
	const testNewStartEndPointData = { newStartPoint: newStartPoint, newEndPoint: newEndPoint };
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.put(`/api/hikes/${hikeId}/startEndPoints`)
				.send(testNewStartEndPointData)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	})
}

exports.putRefPoint = function (agent, itShould, expectedHTTPStatus, credentials, hikeId, newRefpointList) {
	const newRefPoints = { referencePoints: newRefpointList };
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.put(`/api/hikes/${hikeId}/refPoints`)
				.send(newRefPoints)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	})
}

exports.putHutList = function (agent, itShould, expectedHTTPStatus, credentials, hikeId, testHutList) {
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.put(`/api/hikes/${hikeId}/huts`)
				.send(testHutList)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	})
}

exports.getPotentialHut = function (agent, itShould, expectedHTTPStatus, credentials, hikeId) {
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.get(`/api/hikes/${hikeId}/linkable-huts`)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	})
}

exports.getAllCompletedHikes = function (agent, itShould, expectedHTTPStatus, credentials, expectedLength) {
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.get(`/api/hikes/all/completed`)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					if (expectedHTTPStatus !== 401) {
						res.body.should.be.a("array");
						res.body.length.should.be.eql(expectedLength);
					}
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	})
}

exports.getAllHikesByWriter = function (agent, itShould, expectedHTTPStatus, credentials, writerId, expectedLength) {
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.get(`/api/hikes/writers/${writerId}`)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					if (expectedHTTPStatus !== 401 && expectedHTTPStatus !== 422) {
						res.body.should.be.a("array");
						res.body.length.should.be.eql(expectedLength);
					}
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	});
}


/*****************************************************************************************************
*              Hut
*****************************************************************************************************/
exports.postHut = function (agent, itShould, expectedHTTPStatus, credentials, hutName, city, province, region, numOfBeds, cost, latitude, longitude, altitude, phone, email, website,hutImage) {
	const testHutData = { hutName: hutName, city: city, province: province, region: region, numOfBeds: numOfBeds, cost: cost, latitude: latitude, longitude: longitude, altitude: altitude, phone: phone, email: email, website: website };
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.post("/api/huts")
				.field(testHutData)
				.attach("hutImage", fs.readFileSync(`hutImage/${hutImage}`), hutImage)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	});
}

exports.getAllHuts = function (agent, itShould, expectedHTTPStatus, credentials, expectedLength) {
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.get("/api/huts")
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					if (expectedHTTPStatus !== 401) {
						res.body.should.be.a("array");
						res.body.length.should.be.eql(expectedLength);
					}
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	});
}

exports.getOneHut = function (
	agent,
	itShould,
	expectedHTTPStatus,
	hutId,
	credentials
) {
	it(`Should ${itShould}`, function (done) {
		agent
			.post("/api/auth/login/password")
			.send(credentials)
			.then(function () {
				agent
					.get(`/api/huts/${hutId}`)
					.then(function (res) {
						res.should.have.status(expectedHTTPStatus);
						if (expectedHTTPStatus !== 401 && expectedHTTPStatus !== 404) {
							res.body.hutId.should.be.eql(hutId);
						}
						agent.delete("/api/auth/logout").then(function () {
							done();
						}).catch(logoutError => console.log(logoutError))
					}).catch((e) => console.log(e));
			})
			.catch((loginError) => console.log(loginError));
	});
};



/*****************************************************************************************************
*              ParkingLot
*****************************************************************************************************/
exports.postParkingLot = function (agent, itShould, expectedHTTPStatus, credentials, parkingLotName, latitude, longitude, altitude, capacity) {
	const testParkingLotData = { parkingLotName: parkingLotName, latitude: latitude, longitude: longitude, altitude: altitude, capacity: capacity };
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.post("/api/parkingLots")
				.send(testParkingLotData)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	});
}


/*****************************************************************************************************
*              SelectedHike
*****************************************************************************************************/

exports.startSelectedHike = function (agent, itShould, expectedHTTPStatus, credentials, hikeId, time) {
	const newSelectedHike = { hikeId: hikeId, time: time }
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.post(`/api/selectedHikes/start`)
				.send(newSelectedHike)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	})
}

exports.getSelectedHike = function (agent, itShould, expectedHTTPStatus, credentials, hikeId, time) {
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.get(`/api/selectedHikes/`)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					if (expectedHTTPStatus !== 401){
						res.body.hikeId.should.be.eql(hikeId);
						res.body.startTime.should.be.eql(time);
					}
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	})
}

exports.putTerminateSelectedHike = function (agent, itShould, expectedHTTPStatus, credentials, selectedHikeId, time) {
	const testNewEndTime = { time: time }
	it(`Should ${itShould}`, function (done) {
		agent.post('/api/auth/login/password').send(credentials).then(function () {
			agent.put(`/api/selectedHikes/${selectedHikeId}/terminate`)
				.send(testNewEndTime)
				.then(function (res) {
					res.should.have.status(expectedHTTPStatus);
					agent.delete("/api/auth/logout").then(function () {
						done();
					}).catch(logoutError => console.log(logoutError))
				}).catch(e => console.log(e));
		}).catch(loginError => console.log(loginError));
	})
}


/*****************************************************************************************************
 *              Others
 *****************************************************************************************************/
