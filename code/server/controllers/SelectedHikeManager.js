"use strict";

const SelectedHike = require("../dao/model/SelectedHike");
const PersistentManager = require("../dao/PersistentManager");
const Hike = require("../dao/model/Hike");


class SelectedHikeManager {
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new SelectedHike
   * @param {SelectedHike} newSelectedHike 
   * @returns a Promise with the rowId value of the stored SelectedHike 
   */
   async storeSelectedHike(newSelectedHike) {
    // Check if foreign key hikeId exists
    const hikeExists = await PersistentManager.exists(Hike.tableName, "hikeId", newSelectedHike.hikeId);
    if (!hikeExists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with hikeId = ${newSelectedHike.hikeId}`
      });
    }

    return PersistentManager.store(SelectedHike.tableName, newSelectedHike);
  } 

  /**
   * Update a SelectedHike
   * @param {SelectedHike} newSelectedHike 
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value if the SelectedHike exists, a rejected Promise with an object containing code and result otherwise
   */
  /* async updateSelectedHike(newSelectedHike, attributeName, value) {
    const exists = await this.existsSelectedHike(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available SelectedHike with ${attributeName} = ${value}`
      });
    }
    // Check if foreign key hikeId exists
    const hikeExists = await PersistentManager.exists(Hike.tableName, "hikeId", newSelectedHike.hikeId);
    if (!hikeExists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with hikeId = ${newSelectedHike.hikeId}`
      });
    }
    // Check if foreign key parkingId exists
    const parkingLotExists = await PersistentManager.exists(ParkingLot.tableName, "parkingId", newSelectedHike.parkingId);
    if (!parkingLotExists) {
      return Promise.reject({
        code: 404,
        result: `No available parkingLot with parkingId = ${newSelectedHike.parkingId}`
      });
    }

    return PersistentManager.update(SelectedHike.tableName, newSelectedHike, attributeName, value);
  } */

  /**
   * Delete a SelectedHike
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value
   */
  /* async deleteSelectedHike(attributeName, value) {
    return PersistentManager.delete(SelectedHike.tableName, attributeName, value);
  } */

  /**
   * Delete all SelectedHikes
   * @returns a Promise without any value
   */
  /* async deleteAllSelectedHike() {
    return PersistentManager.deleteAll(SelectedHike.tableName);
  } */

  /**
   * Load all SelectedHikes 
   * @returns a Promise with the list of all SelectedHikes
   */
  /* async loadAllSelectedHike() {
    return PersistentManager.loadAll(SelectedHike.tableName);
  } */

  /**
   * Check if the SelectedHikes exists
   * @param {String} attributeName
   * @param {any} value  
   * @returns a resolved Promise with true value in case the SelectedHikes exists, a resolved Promise with false value otherwise   
   */
  async existsSelectedHike(attributeName, value) {
    return PersistentManager.exists(SelectedHike.tableName, attributeName, value);
  }

  /**
   * Load one SelectedHike by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the SelectedHike in case there is one, a rejected Promise with an object containing code and result otherwise  
   */
  /* async loadOneByAttributeSelectedHike(attributeName, value) {
    const exists = await this.existsSelectedHike(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available SelectedHike with ${attributeName} = ${value}`
      });
    }

    return PersistentManager.loadOneByAttribute(SelectedHike.tableName, attributeName, value);
  } */

  /**
   * Load all SelectedHikes by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise with the list of SelectedHikes that satisfy the condition  
   */
  async loadAllByAttributeSelectedHike(attributeName, value) {
    return PersistentManager.loadAllByAttribute(SelectedHike.tableName, attributeName, value);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */


  /* --------------------------------------------- Other functions ----------------------------------------------------- */
  // Insert other functions you need here
}

module.exports = new SelectedHikeManager();