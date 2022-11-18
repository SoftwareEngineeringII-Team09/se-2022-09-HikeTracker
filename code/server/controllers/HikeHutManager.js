"use strict";

const HikeHut = require("../dao/model/HikeHut");
const PersistentManager = require("../dao/PersistentManager");
const HikeManager = require("./HikeManager");
const HutManager = require("./HutManager");

class HikeHutManager {
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new hikeHut
   * @param {HikeHut} newHikeHut 
   * @returns a Promise with the rowId value of the stored hikeHut 
   */
  /* async storeHikeHut(newHikeHut) {
    // Check that foreign key hikeId exists
    const hikeExists = await HikeManager.existsHike("hikeId", newHikeHut.hikeId);
    if (!hikeExists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with hikeId = ${newHikeHut.hikeId}`
      });
    }
    // Check that foreign key hutId exists
    const hutExists = await HutManager.existsHut("hutId", newHikeHut.hutId);
    if (!hutExists) {
      return Promise.reject({
        code: 404,
        result: `No available hut with hutId = ${newHikeHut.hutId}`
      });
    }

    return PersistentManager.store(HikeHut.tableName, newHikeHut);
  } */

  /**
   * Update a hikeHut
   * @param {HikeHut} newHikeHut 
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value if the hikeHut exists, a rejected Promise with an object containing code and result otherwise
   */
  /* async updateHikeHut(newHikeHut, attributeName, value) {
    const exists = await this.existsHikeHut(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hikeHut with ${attributeName} = ${value}`
      });
    }
    // Check that foreign key hikeId exists
    const hikeExists = await HikeManager.existsHike("hikeId", newHikeHut.hikeId);
    if (!hikeExists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with hikeId = ${newHikeHut.hikeId}`
      });
    }
    // Check that foreign key hutId exists
    const hutExists = await HutManager.existsHut("hutId", newHikeHut.hutId);
    if (!hutExists) {
      return Promise.reject({
        code: 404,
        result: `No available hut with hutId = ${newHikeHut.hutId}`
      });
    }

    return PersistentManager.update(HikeHut.tableName, newHikeHut, attributeName, value);
  } */

  /**
   * Delete a hikeHut
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value
   */
  /* async deleteHikeHut(attributeName, value) {
    return PersistentManager.delete(HikeHut.tableName, attributeName, value);
  } */

  /**
   * Delete all hikeHuts
   * @returns a Promise without any value
   */
  /* async deleteAllHikeHut() {
    return PersistentManager.deleteAll(HikeHut.tableName);
  } */

  /**
   * Load all hikeHuts 
   * @returns a resolved Promise with the list of hikeHuts in case HikeHut table is not empty, a rejected Promise with an object containing code and result otherwise
   */
  /* async loadAllRowsHikeHut() {
    const hikeHuts = await PersistentManager.loadAllRows(HikeHut.tableName);
    if (hikeHuts.length === 0) {
      return Promise.reject({
        code: 404,
        result: "HikeHut table is empty"
      });
    }

    return Promise.resolve(hikeHuts);
  } */

  /**
   * Check if the hikeHuts exists
   * @param {String} attributeName
   * @param {any} value  
   * @returns a resolved Promise with true value in case the hikeHut exists, a resolved Promise with false value otherwise   
   */
  async existsHikeHut(attributeName, value) {
    return PersistentManager.exists(HikeHut.tableName, attributeName, value);
  }

  /**
   * Load one hikeHut by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the hikeHut in case there is one, a rejected Promise with an object containing code and result otherwise  
   */
  /* async loadOneByAttributeHikeHut(attributeName, value) {
    const exists = await this.existsHikeHut(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hikeHut with ${attributeName} = ${value}`
      });
    }

    return PersistentManager.loadOneByAttribute(HikeHut.tableName, attributeName, value);
  } */

  /**
   * Load all hikeHuts by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the list of hikeHuts in case there is at least one, a rejected Promise with an object containing code and result otherwise  
   */
  /* async loadAllByAttributeHikeHut(attributeName, value) {
    const hikeHuts = await PersistentManager.loadAllByAttribute(HikeHut.tableName, attributeName, value);
    if (hikeHuts.length === 0) {
      return Promise.reject({
        code: 404,
        result: `No available hikeHuts with ${attributeName} = ${value}`
      });
    }

    return Promise.resolve(hikeHuts);
  } */
  /* ------------------------------------------------------------------------------------------------------------------- */


  /* --------------------------------------------- Other functions ----------------------------------------------------- */
  // Insert other functions you need here
}

module.exports = new HikeHutManager();