"use strict";

const HikeStatus = require("../dao/model/HikeStatus");
const PersistentManager = require("../dao/PersistentManager");
const Hike = require("../dao/model/Hike");


class HikeStatusManager {
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new hikeStatus
   * @param {HikeStatus} newhikeStatus 
   * @returns a Promise with the rowId value of the stored hikeStatus 
   */
   async storehikeStatus(newhikeStatus) {
    // Check if foreign key hikeId exists
    const hikeExists = await PersistentManager.exists(Hike.tableName, "hikeId", newhikeStatus.hikeId);
    if (!hikeExists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with hikeId = ${newhikeStatus.hikeId}`
      });
    }

    return PersistentManager.store(HikeStatus.tableName, newhikeStatus);
  } 

  /**
   * Update a hikeStatus
   * @param {HikeStatus} newhikeStatus 
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value if the hikeStatus exists, a rejected Promise with an object containing code and result otherwise
   */
  /* async updatehikeStatus(newhikeStatus, attributeName, value) {
    const exists = await this.existshikeStatus(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hikeStatus with ${attributeName} = ${value}`
      });
    }
    // Check if foreign key hikeId exists
    const hikeExists = await PersistentManager.exists(Hike.tableName, "hikeId", newhikeStatus.hikeId);
    if (!hikeExists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with hikeId = ${newhikeStatus.hikeId}`
      });
    }
    // Check if foreign key parkingId exists
    const parkingLotExists = await PersistentManager.exists(ParkingLot.tableName, "parkingId", newhikeStatus.parkingId);
    if (!parkingLotExists) {
      return Promise.reject({
        code: 404,
        result: `No available parkingLot with parkingId = ${newhikeStatus.parkingId}`
      });
    }

    return PersistentManager.update(hikeStatus.tableName, newhikeStatus, attributeName, value);
  } */

  /**
   * Delete a hikeStatus
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value
   */
  /* async deletehikeStatus(attributeName, value) {
    return PersistentManager.delete(hikeStatus.tableName, attributeName, value);
  } */

  /**
   * Delete all hikeStatuss
   * @returns a Promise without any value
   */
  /* async deleteAllhikeStatus() {
    return PersistentManager.deleteAll(hikeStatus.tableName);
  } */

  /**
   * Load all hikeStatuss 
   * @returns a Promise with the list of all hikeStatuss
   */
  /* async loadAllhikeStatus() {
    return PersistentManager.loadAll(hikeStatus.tableName);
  } */

  /**
   * Check if the hikeStatuss exists
   * @param {String} attributeName
   * @param {any} value  
   * @returns a resolved Promise with true value in case the hikeStatuss exists, a resolved Promise with false value otherwise   
   */
  async existshikeStatus(attributeName, value) {
    return PersistentManager.exists(HikeStatus.tableName, attributeName, value);
  }

  /**
   * Load one hikeStatus by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the hikeStatus in case there is one, a rejected Promise with an object containing code and result otherwise  
   */
  /* async loadOneByAttributehikeStatus(attributeName, value) {
    const exists = await this.existshikeStatus(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hikeStatus with ${attributeName} = ${value}`
      });
    }

    return PersistentManager.loadOneByAttribute(hikeStatus.tableName, attributeName, value);
  } */

  /**
   * Load all hikeStatuss by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise with the list of hikeStatuss that satisfy the condition  
   */
  async loadAllByAttributehikeStatus(attributeName, value) {
    return PersistentManager.loadAllByAttribute(hikeStatus.tableName, attributeName, value);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */


  /* --------------------------------------------- Other functions ----------------------------------------------------- */
  // Insert other functions you need here
}

module.exports = new HikeStatusManager();