"use strict";

const HikeHut = require("../dao/model/HikeHut");
const Hike = require("../dao/model/Hike");
const Hut = require("../dao/model/Hut");
const PersistentManager = require("../dao/PersistentManager");

class HikeHutManager {
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new hikeHut
   * @param {HikeHut} newHikeHut 
   * @returns a Promise with the rowId value of the stored hikeHut 
   */
  async storeHikeHut(newHikeHut) {
    // Check if foreign key hikeId exists
    const hikeExists = await PersistentManager.exists(Hike.tableName, "hikeId", newHikeHut.hikeId);
    if (!hikeExists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with hikeId = ${newHikeHut.hikeId}`
      });
    }
    // Check if foreign key hutId exists
    const hutExists = await PersistentManager.exists(Hut.tableName, "hutId", newHikeHut.hutId);
    if (!hutExists) {
      return Promise.reject({
        code: 404,
        result: `No available hut with hutId = ${newHikeHut.hutId}`
      });
    }

    return PersistentManager.store(HikeHut.tableName, newHikeHut);
  }

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
    // Check if foreign key hikeId exists
    const hikeExists = await PersistentManager.exists(Hike.tableName, "hikeId", newHikeHut.hikeId);
    if (!hikeExists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with hikeId = ${newHikeHut.hikeId}`
      });
    }
    // Check if foreign key hutId exists
    const hutExists = await PersistentManager.exists(Hut.tableName, "hutId", newHikeHut.hutId);
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
  async deleteHikeHut(attributeName, value) {
    return PersistentManager.delete(HikeHut.tableName, attributeName, value);
  }

  /**
   * Delete all hikeHuts
   * @returns a Promise without any value
   */
  /* async deleteAllHikeHut() {
    return PersistentManager.deleteAll(HikeHut.tableName);
  } */

  /**
   * Load all hikeHuts 
   * @returns a Promise with the list of all hikeHuts
   */
  /* async loadAllHikeHut() {
    return PersistentManager.loadAll(HikeHut.tableName);    
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
   * @returns a Promise with the list of hikeHuts that satisfy the condition   
   */
  async loadAllByAttributeHikeHut(attributeName, value) {
    return PersistentManager.loadAllByAttribute(HikeHut.tableName, attributeName, value);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */


  /* --------------------------------------------- Other functions ----------------------------------------------------- */


  // Update the start point of a hike by hikeId
  async updatehutId(hikeId, newhutIds) {
    // Search pointIds in HikeHut table
    const hutIds = await this.loadAllByAttributeHikeHut("hikeId", hikeId);
    // Delete old hutId in HikeHut table
    if (hutIds) {
      await Promise.all(
        hutIds.map(async (p) => {
          await this.deleteHikeHut("hutId", p.hutId);
        })
      );
    }
    // Add new hutId 
    await Promise.all(
      newhutIds.map(async (p) => {
        await this.storeHikeHut(new HikeHut(hikeId, p));
      })
    )
    return hikeId;
  }
}

module.exports = new HikeHutManager();