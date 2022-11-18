"use strict";

const HikeRefPoint = require("../dao/model/HikeRefPoint");
const PersistentManager = require("../dao/PersistentManager");
const PointManager = require("./PointManager");

class HikeRefPointManager {
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new hikeRefPoint
   * @param {HikeRefPoint} newHikeRefPoint 
   * @returns a Promise with the rowId value of the stored hikeRefPoint 
   */
   /* async storeHikeRefPoint(newHikeRefPoint) {
    // Check that foreign key hikeId exists
    const hikeExists = await HikeManager.existsHike("hikeId", newHikeRefPoint.hikeId);
    if (!hikeExists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with hikeId = ${newHikeRefPoint.hikeId}`
      });
    }
    // Check that foreign key pointId exists
    const refPointExists = await PointManager.existsPoint("pointId", newHikeRefPoint.pointId);
    if (!refPointExists) {
      return Promise.reject({
        code: 404,
        result: `No available refPoint with pointId = ${newHikeRefPoint.pointId}`
      });
    }

    return PersistentManager.store(HikeRefPoint.tableName, newHikeRefPoint);
  } */

  /**
   * Update a hikeRefPoint
   * @param {HikeRefPoint} newHikeRefPoint 
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value if the hikeRefPoint exists, a rejected Promise with an object containing code and result otherwise
   */
  /* async updateHikeRefPoint(newHikeRefPoint, attributeName, value) {
    const exists = await this.existsHikeRefPoint(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hikeRefPoint with ${attributeName} = ${value}`
      });
    }
    // Check that foreign key hikeId exists
    const hikeExists = await HikeManager.existsHike("hikeId", newHikeRefPoint.hikeId);
    if (!hikeExists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with hikeId = ${newHikeRefPoint.hikeId}`
      });
    }
    // Check that foreign key pointId exists
    const refPointExists = await PointManager.existsPoint("pointId", newHikeRefPoint.pointId);
    if (!refPointExists) {
      return Promise.reject({
        code: 404,
        result: `No available refPoint with pointId = ${newHikeRefPoint.pointId}`
      });
    }

    return PersistentManager.update(HikeRefPoint.tableName, newHikeRefPoint, attributeName, value);
  } */

  /**
   * Delete a hikeRefPoint
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value
   */
  /* async deleteHikeRefPoint(attributeName, value) {
    return PersistentManager.delete(HikeRefPoint.tableName, attributeName, value);
  } */

  /**
   * Delete all hikeRefPoints
   * @returns a Promise without any value
   */
  /* async deleteAllHikeRefPoint() {
    return PersistentManager.deleteAll(HikeRefPoint.tableName);
  } */

  /**
   * Load all hikeRefPoints 
   * @returns a resolved Promise with the list of hikeRefPoints in case HikeRefPoint table is not empty, a rejected Promise with an object containing code and result otherwise
   */
  /* async loadAllRowsHikeRefPoint() {
    const hikeRefPoints = await PersistentManager.loadAllRows(HikeRefPoint.tableName);
    if (hikeRefPoints.length === 0) {
      return Promise.reject({
        code: 404,
        result: "HikeRefPoint table is empty"
      });
    }

    return Promise.resolve(hikeRefPoints);
  } */

  /**
   * Check if the hikeRefPoints exists
   * @param {String} attributeName
   * @param {any} value  
   * @returns a resolved Promise with true value in case the hikeRefPoints exists, a resolved Promise with false value otherwise   
   */
  async existsHikeRefPoint(attributeName, value) {
    return PersistentManager.exists(HikeRefPoint.tableName, attributeName, value);
  }

  /**
   * Load one hikeRefPoint by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the hikeRefPoint in case there is one, a rejected Promise with an object containing code and result otherwise  
   */
  /* async loadOneByAttributeHikeRefPoint(attributeName, value) {
    const exists = await this.existsHikeRefPoint(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hikeRefPoint with ${attributeName} = ${value}`
      });
    }

    return PersistentManager.loadOneByAttribute(HikeRefPoint.tableName, attributeName, value);
  } */

  /**
   * Load all hikeRefPoints by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the list of hikeRefPoints in case there is at least one, a rejected Promise with an object containing code and result otherwise  
   */
  async loadAllByAttributeHikeRefPoint(attributeName, value) {
    const hikeRefPoints = await PersistentManager.loadAllByAttribute(HikeRefPoint.tableName, attributeName, value);
    if (hikeRefPoints.length === 0) {
      return Promise.reject({
        code: 404,
        result: `No available hikeRefPoints with ${attributeName} = ${value}`
      });
    }

    return Promise.resolve(hikeRefPoints);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */


  /* --------------------------------------------- Other functions ----------------------------------------------------- */
  // Insert other functions you need here
}

module.exports = new HikeRefPointManager();