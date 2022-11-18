"use strict";

const Point = require("../dao/model/Point");
const PersistentManager = require("../dao/PersistentManager");

class PointManager {
  constructor() { }
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new point
   * @param {Point} newPoint 
   * @returns a Promise with the pointId value of the stored point 
   */
   async storePoint(newPoint) {
    return PersistentManager.store(Point.tableName, newPoint);
  }

  /**
   * Update a point
   * @param {Point} newPoint 
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value if the point exists, a rejected Promise with an object containing code and result otherwise
   */
  /* async updatePoint(newPoint, attributeName, value) {
    const exists = await this.existsPoint(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available point with ${attributeName} = ${value}`
      });
    }

    return PersistentManager.update(Point.tableName, newPoint, attributeName, value);
  } */

  /**
   * Delete a point
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value
   */
  /* async deletePoint(attributeName, value) {
    return PersistentManager.delete(Point.tableName, attributeName, value);
  } */

  /**
   * Delete all points
   * @returns a Promise without any value
   */
  /* async deleteAllPoint() {
    return PersistentManager.deleteAll(Point.tableName);
  } */

  /**
   * Load all points 
   * @returns a resolved Promise with the list of points in case Point table is not empty, a rejected Promise with an object containing code and result otherwise
   */
  /* async loadAllRowsPoint() {
    const points = await PersistentManager.loadAllRows(Point.tableName);
    if (points.length === 0) {
      return Promise.reject({
        code: 404,
        result: "Point table is empty"
      });
    }

    return Promise.resolve(points);
  } */

  /**
   * Check if the point exists
   * @param {String} attributeName
   * @param {any} value  
   * @returns a resolved Promise with true value in case the point exists, a resolved Promise with false value otherwise   
   */
  async existsPoint(attributeName, value) {
    return PersistentManager.exists(Point.tableName, attributeName, value);
  }

  /**
   * Load one point by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the point in case there is one, a rejected Promise with an object containing code and result otherwise  
   */
  async loadOneByAttributePoint(attributeName, value) {
    const exists = await this.existsPoint(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available point with ${attributeName} = ${value}`
      });
    }

    return PersistentManager.loadOneByAttribute(Point.tableName, attributeName, value);
  }

  /**
   * Load all points by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the list of points in case there is at least one, a rejected Promise with an object containing code and result otherwise  
   */
  /* async loadAllByAttributePoint(attributeName, value) {
    const points = await PersistentManager.loadAllByAttribute(Point.tableName, attributeName, value);
    if (points.length === 0) {
      return Promise.reject({
        code: 404,
        result: `No available points with ${attributeName} = ${value}`
      });
    }

    return Promise.resolve(points);
  } */
  /* ------------------------------------------------------------------------------------------------------------------- */


  /* --------------------------------------------- Other functions ----------------------------------------------------- */
}

module.exports = new PointManager();