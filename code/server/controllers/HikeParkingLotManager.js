"use strict";

const HikeParkingLot = require("../dao/model/HikeParkingLot");
const PersistentManager = require("../dao/PersistentManager");
const ParkingLotManager = require("./ParkingLotManager");
const Hike = require("../dao/model/Hike");
const ParkingLot = require("../dao/model/ParkingLot");

class HikeParkingLotManager {
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new hikeParkingLot
   * @param {HikeParkingLot} newHikeParkingLot 
   * @returns a Promise with the rowId value of the stored hikeParkingLot 
   */
   /* async storeHikeParkingLot(newHikeParkingLot) {
    // Check that foreign key hikeId exists
    const hikeExists = await PersistentManager.exists(Hike.tableName, "hikeId", newHikeParkingLot.hikeId);
    if (!hikeExists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with hikeId = ${newHikeParkingLot.hikeId}`
      });
    }
    // Check that foreign key parkingId exists
    const parkingLotExists = await PersistentManager.exists(ParkingLot.tableName, "parkingId", newHikeParkingLot.parkingId);
    if (!parkingLotExists) {
      return Promise.reject({
        code: 404,
        result: `No available parkingLot with parkingId = ${newHikeParkingLot.parkingId}`
      });
    }

    return PersistentManager.store(HikeParkingLot.tableName, newHikeParkingLot);
  } */

  /**
   * Update a hikeParkingLot
   * @param {HikeParkingLot} newHikeParkingLot 
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value if the hikeParkingLot exists, a rejected Promise with an object containing code and result otherwise
   */
  /* async updateHikeParkingLot(newHikeParkingLot, attributeName, value) {
    const exists = await this.existsHikeParkingLot(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hikeParkingLot with ${attributeName} = ${value}`
      });
    }
    // Check that foreign key hikeId exists
    const hikeExists = await PersistentManager.exists(Hike.tableName, "hikeId", newHikeParkingLot.hikeId);
    if (!hikeExists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with hikeId = ${newHikeParkingLot.hikeId}`
      });
    }
    // Check that foreign key parkingId exists
    const parkingLotExists = await PersistentManager.exists(ParkingLot.tableName, "parkingId", newHikeParkingLot.parkingId);
    if (!parkingLotExists) {
      return Promise.reject({
        code: 404,
        result: `No available parkingLot with parkingId = ${newHikeParkingLot.parkingId}`
      });
    }

    return PersistentManager.update(HikeParkingLot.tableName, newHikeParkingLot, attributeName, value);
  } */

  /**
   * Delete a hikeParkingLot
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value
   */
  /* async deleteHikeParkingLot(attributeName, value) {
    return PersistentManager.delete(HikeParkingLot.tableName, attributeName, value);
  } */

  /**
   * Delete all hikeParkingLots
   * @returns a Promise without any value
   */
  /* async deleteAllHikeParkingLot() {
    return PersistentManager.deleteAll(HikeParkingLot.tableName);
  } */

  /**
   * Load all hikeParkingLots 
   * @returns a Promise with the list of all hikeParkingLots
   */
  /* async loadAllHikeParkingLot() {
    return PersistentManager.loadAll(HikeParkingLot.tableName);
  } */

  /**
   * Check if the hikeParkingLots exists
   * @param {String} attributeName
   * @param {any} value  
   * @returns a resolved Promise with true value in case the hikeParkingLots exists, a resolved Promise with false value otherwise   
   */
  async existsHikeParkingLot(attributeName, value) {
    return PersistentManager.exists(HikeParkingLot.tableName, attributeName, value);
  }

  /**
   * Load one hikeParkingLot by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the hikeParkingLot in case there is one, a rejected Promise with an object containing code and result otherwise  
   */
  /* async loadOneByAttributeHikeParkingLot(attributeName, value) {
    const exists = await this.existsHikeParkingLot(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hikeParkingLot with ${attributeName} = ${value}`
      });
    }

    return PersistentManager.loadOneByAttribute(HikeParkingLot.tableName, attributeName, value);
  } */

  /**
   * Load all hikeParkingLots by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise with the list of hikeParkingLots that satisfy the condition  
   */
  /* async loadAllByAttributeHikeParkingLot(attributeName, value) {
    return PersistentManager.loadAllByAttribute(HikeParkingLot.tableName, attributeName, value);
  } */
  /* ------------------------------------------------------------------------------------------------------------------- */


  /* --------------------------------------------- Other functions ----------------------------------------------------- */
  // Insert other functions you need here
}

module.exports = new HikeParkingLotManager();