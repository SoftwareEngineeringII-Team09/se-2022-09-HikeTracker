"use strict";

const ParkingLot = require("../dao/model/ParkingLot");
const PointManager = require("./PointManager");
const UserManager = require("./UserManager");
const PersistentManager = require("../dao/PersistentManager");

class ParkingLotManager {
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new parking lot
   * @param {ParkingLot} newParkingLot 
   * @returns a Promise with the parkingId value of the stored parkingId 
   */
   async storeParkingLot(newParkingLot) {
    // Check that foreign key pointId exists
    const pointExists = await PointManager.existsPoint("pointId", newParkingLot.pointId);
    if (!pointExists) {
      return Promise.reject({
        code: 404,
        result: `No available point with pointId = ${newParkingLot.pointId}`
      });
    }
    // Check that foreign key writerId exists
    const writerExists = await UserManager.existsUser("userId", newParkingLot.writerId);
    if (!writerExists) {
      return Promise.reject({
        code: 404,
        result: `No available writer with userId = ${newParkingLot.writerId}`
      });
    }

    return PersistentManager.store(ParkingLot.tableName, newParkingLot);
  }

  /**
   * Update a parking lot
   * @param {ParkingLot} newParkingLot 
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value if the parking lot exists, a rejected Promise with an object containing code and result otherwise
   */
  async updateParkingLot(newParkingLot, attributeName, value) {
    const exists = await this.existsParkingLot(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available parking lot with ${attributeName} = ${value}`
      });
    }
    // Check that foreign key pointId exists
    const pointExists = await PointManager.existsPoint("pointId", newParkingLot.pointId);
    if (!pointExists) {
      return Promise.reject({
        code: 404,
        result: `No available point with pointId = ${newParkingLot.pointId}`
      });
    }
    // Check that foreign key writerId exists
    const writerExists = await UserManager.existsUser("userId", newParkingLot.writerId);
    if (!writerExists) {
      return Promise.reject({
        code: 404,
        result: `No available writer with userId = ${newParkingLot.writerId}`
      });
    }

    return PersistentManager.update(ParkingLot.tableName, newParkingLot, attributeName, value);
  }

  /**
   * Delete a parking lot
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value
   */
  async deleteParkingLot(attributeName, value) {
    return PersistentManager.delete(ParkingLot.tableName, attributeName, value);
  }

  /**
   * Delete all parking lots
   * @returns a Promise without any value
   */
  async deleteAllParkingLot() {
    return PersistentManager.deleteAll(ParkingLot.tableName);
  }

  /**
   * Load all parking lots 
   * @returns a resolved Promise with the list of parking lots in case ParkingLot table is not empty, a rejected Promise with an object containing code and result otherwise
   */
  async loadAllRowsParkingLot() {
    const parkingLots = await PersistentManager.loadAllRows(ParkingLot.tableName);
    if (parkingLots.length === 0) {
      return Promise.reject({
        code: 404,
        result: "ParkingLot table is empty"
      });
    }

    return Promise.resolve(parkingLots);
  }

  /**
   * Check if the parking lot exists
   * @param {String} attributeName
   * @param {any} value  
   * @returns a resolved Promise with true value in case the parking lot exists, a resolved Promise with false value otherwise   
   */
  async existsParkingLot(attributeName, value) {
    return PersistentManager.exists(ParkingLot.tableName, attributeName, value);
  }

  /**
   * Load one parking lot by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the parking lot in case there is one, a rejected Promise with an object containing code and result otherwise  
   */
  async loadOneByAttributeParkingLot(attributeName, value) {
    const exists = await this.existsParkingLot(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available parking lot with ${attributeName} = ${value}`
      });
    }

    return PersistentManager.loadOneByAttribute(ParkingLot.tableName, attributeName, value);
  }

  /**
   * Load all parking lots by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the list of parking lots in case there is at least one, a rejected Promise with an object containing code and result otherwise  
   */
  async loadAllByAttributeParkingLot(attributeName, value) {
    const parkingLots = await PersistentManager.loadAllByAttribute(ParkingLot.tableName, attributeName, value);
    if (parkingLots.length === 0) {
      return Promise.reject({
        code: 404,
        result: `No available parking lots with ${attributeName} = ${value}`
      });
    }

    return Promise.resolve(parkingLots);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */


  /* --------------------------------------------- Other functions ----------------------------------------------------- */
  // Insert other functions you need here
}

module.exports = new ParkingLotManager();
