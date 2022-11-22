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
const HikeManager = require("../controllers/HikeManager");

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
exports.testStoreHike = function (itShould, newHike, expectedRejectionCode = undefined) {
	test(`Should ${itShould}`, async () => {
		if (!expectedRejectionCode) {
			const res = await HikeManager.storeHike(newHike);
			const storedHike = await PersistentManager.loadAll(Hike.tableName).then(hikes => hikes[0]);

			expect(res).toEqual(newHike.hikeId);
			expect(storedHike).toEqual(newHike);
		}
		else {
			await expect(HikeManager.storeHike(newHike)).rejects.toHaveProperty("code", expectedRejectionCode);
		}
	});
}

exports.testUpdateHike = function (itShould, newHike, attributeName, value, expectedRejectionCode = undefined) {
	test(`Should ${itShould}`, async () => {
		if (!expectedRejectionCode) {
			let attributesName = [];
			for (const attribute in newHike) {
				if (Object.prototype.hasOwnProperty.call(newHike, attribute)) {
					attributesName.push(attribute);
				}
			}
			await HikeManager.updateHike(newHike, attributeName, value);
			let updatedHikes = await PersistentManager.loadAllByAttribute(Hike.tableName, attributeName, value);

			for (const updatedHike of updatedHikes) {
				for (const attribute in attributesName) {
					expect(updatedHike[attribute]).toEqual(newHike[attribute]);
				}
			}
		}
		else {
			await expect(HikeManager.updateHike(newHike, attributeName, value)).rejects.toHaveProperty("code", expectedRejectionCode);
		}
	});
}

exports.testDeleteHike = function (itShould, attributeName, value) {
	test(`Should ${itShould}`, async () => {
		await HikeManager.deleteHike(attributeName, value);
		const numOfRemainingHikes = await PersistentManager.loadAllByAttribute(Hike.tableName, attributeName, value).then(hikes => hikes.length);

		expect(numOfRemainingHikes).toEqual(0);
	})
}

exports.testDeleteAllHike = function (itShould) {
	test(`Should ${itShould}`, async () => {
		await HikeManager.deleteAllHike();
		const numOfRemainingHikes = await PersistentManager.loadAll(Hike.tableName).then(hikes => hikes.length);

		expect(numOfRemainingHikes).toEqual(0);
	})
}

exports.testLoadAllHike = function (itShould, expectedLength) {
	test(`Should ${itShould}`, async () => {
		const actualLength = await HikeManager.loadAllHike().then(hikes => hikes.length);

		expect(actualLength).toEqual(expectedLength);
	})
}

exports.testExistsHike = function (itShould, attributeName, value, expectedResult) {
	test(`Should ${itShould}`, async () => {
		const res = await HikeManager.existsHike(attributeName, value);

		expect(res).toEqual(expectedResult);
	})
}

exports.testLoadOneByAttributeHike = function (itShould, attributeName, value, expectedRejectionCode = undefined) {
	test(`Should ${itShould}`, async () => {
		if (!expectedRejectionCode) {
			const res = await HikeManager.loadOneByAttributeHike(attributeName, value);

			expect(res[attributeName]).toEqual(value);
		} else {
			await expect(HikeManager.loadOneByAttributeHike(attributeName, value)).rejects.toHaveProperty("code", expectedRejectionCode);
		}
	})
}

exports.testLoadAllByAttributeHike = function (itShould, attributeName, value) {
	test(`Should ${itShould}`, async () => {
		const res = await HikeManager.loadAllByAttributeHike(attributeName, value).then(hikes => hikes.length);

		for (const r in res) {
			expect(r[attributeName]).toEqual(value);
		}
	})
}

exports.testGetAllHikes = function (itShould, expectedLength, expectedGetAllHikesProperties) {
	test(`Should ${itShould}`, async () => {
		const res = await HikeManager.getAllHikes();

		expect(res.length).toEqual(expectedLength);
		for (const r of res) {
			for (const p of expectedGetAllHikesProperties) {
				expect(r).toHaveProperty(p);
			}
		}
	})
}

exports.testGetHikeByHikeId = function (itShould, hikeId, expectedGetHikeByIdProperties = undefined, expectedRejectionCode = undefined) {
	test(`Should ${itShould}`, async () => {
		if (!expectedRejectionCode) {
			const res = await HikeManager.getHikeById(hikeId);

			for (const p of expectedGetHikeByIdProperties) {
				expect(res).toHaveProperty(p);
			}
		} else {
			await expect(HikeManager.getHikeById(hikeId)).rejects.toHaveProperty("code", expectedRejectionCode);
		}
	})
}

exports.testGetGpxPath = function (itShould, hikeId, expectedGpxPath = undefined, expectedRejectionCode = undefined) {
	test(`Should ${itShould}`, async () => {
		if (!expectedRejectionCode) {
			const res = await HikeManager.getGpxPath(hikeId);

			expect(res).toEqual(expectedGpxPath);
		} else {
			await expect(HikeManager.getGpxPath(hikeId)).rejects.toHaveProperty("code", expectedRejectionCode);
		}
	})
}


/*****************************************************************************************************
*              Hut
*****************************************************************************************************/



/*****************************************************************************************************
*              ParkingLot
*****************************************************************************************************/



/*****************************************************************************************************
*              Others
*****************************************************************************************************/