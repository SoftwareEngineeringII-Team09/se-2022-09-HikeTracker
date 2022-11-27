"use strict";

const HikeRefPoint = require("../dao/model/HikeRefPoint");
const Hike = require("../dao/model/Hike");
const Point = require("../dao/model/Point");
const PersistentManager = require("../dao/PersistentManager");
const PointManager = require("./PointManager");

class HikeRefPointManager {
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new hikeRefPoint
   * @param {HikeRefPoint} newHikeRefPoint
   * @returns a Promise with the rowId value of the stored hikeRefPoint
   */
   async storeHikeRefPoint(newHikeRefPoint) {
    // Check if foreign key hikeId exists
    const hikeExists = await PersistentManager.exists(Hike.tableName, "hikeId", newHikeRefPoint.hikeId);
    if (!hikeExists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with hikeId = ${newHikeRefPoint.hikeId}`,
      });
    }
    // Check if foreign key pointId exists
    const refPointExists = await PersistentManager.exists(Point.tableName, "pointId", newHikeRefPoint.pointId);
    if (!refPointExists) {
      return Promise.reject({
        code: 404,
        result: `No available refPoint with pointId = ${newHikeRefPoint.pointId}`,
      });
    }

    return PersistentManager.store(HikeRefPoint.tableName, newHikeRefPoint);
  }

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
    // Check if foreign key hikeId exists
    const hikeExists = await PersistentManager.exists(Hike.tableName, "hikeId", newHikeRefPoint.hikeId);
    if (!hikeExists) {
      return Promise.reject({
        code: 404,
        result: `No available hike with hikeId = ${newHikeRefPoint.hikeId}`
      });
    }
    // Check if foreign key pointId exists
    const refPointExists = await PersistentManager.exists(Point.tableName, "pointId", newHikeRefPoint.pointId);
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
   * @returns a Promise with the list of all hikeRefPoints
   */
  /* async loadAllHikeRefPoint() {
    return PersistentManager.loadAll(HikeRefPoint.tableName);
  } */

  /**
   * Check if the hikeRefPoints exists
   * @param {String} attributeName
   * @param {any} value
   * @returns a resolved Promise with true value in case the hikeRefPoints exists, a resolved Promise with false value otherwise
   */
  async existsHikeRefPoint(attributeName, value) {
    return PersistentManager.exists(
      HikeRefPoint.tableName,
      attributeName,
      value
    );
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
   * @returns a resolved Promise with the list of hikeRefPoints that satisfy the condition
   */
  async loadAllByAttributeHikeRefPoint(attributeName, value) {
    return PersistentManager.loadAllByAttribute(
      HikeRefPoint.tableName,
      attributeName,
      value
    );
  }
  /* ------------------------------------------------------------------------------------------------------------------- */

  /* --------------------------------------------- Other functions ----------------------------------------------------- */

  //insert reference for a hike
  async defineRefPoints(hikeId, referencePoints, track) {
    let refPointId = 0;
    for (let i = 0; i < referencePoints.length; i++) {
      refPointId = await PointManager.storePoint(
        new Point(
          null,
          "reference point",
          0,
          0,
          referencePoints[i].name,
          track[i][0],
          track[i][1],
          track[i][2]
        )
      );
      console.log("defineRefPoints");
      this.storeHikeRefPoint(new HikeRefPoint(hikeId, refPointId));
    }
    return refPointId;
  }
}

module.exports = new HikeRefPointManager();
