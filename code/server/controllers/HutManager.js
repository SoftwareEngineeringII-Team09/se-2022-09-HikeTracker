"use strict";

const Hut = require("../dao/model/Hut");
const Point = require("../dao/model/Point");
const PointManager = require("./PointManager");
const UserManager = require("./UserManager");
const PersistentManager = require("../dao/PersistentManager");

class HutManager {
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new hut
   * @param {Hut} newHut 
   * @returns a Promise with the hutId value of the stored hut 
   */
   async storeHut(newHut) {
    // Check that foreign key pointId exists
    const pointExists = await PointManager.existsPoint("pointId", newHut.pointId);
    if (!pointExists) {
      return Promise.reject({
        code: 404,
        result: `No available point with pointId = ${newHut.pointId}`
      });
    }
    // Check that foreign key writerId exists
    const writerExists = await UserManager.existsUser("userId", newHut.writerId);
    if (!writerExists) {
      return Promise.reject({
        code: 404,
        result: `No available writer with userId = ${newHut.writerId}`
      });
    }

    return PersistentManager.store(Hut.tableName, newHut);
  }

  /**
   * Update a hut
   * @param {Hut} newHut 
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value if the hut exists, a rejected Promise with an object containing code and result otherwise
   */
  /* async updateHut(newHut, attributeName, value) {
    const exists = await this.existsHut(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hut with ${attributeName} = ${value}`
      });
    }
    // Check that foreign key pointId exists
    const pointExists = await PointManager.existsPoint("pointId", newHut.pointId);
    if (!pointExists) {
      return Promise.reject({
        code: 404,
        result: `No available point with pointId = ${newHut.pointId}`
      });
    }
    // Check that foreign key writerId exists
    const writerExists = await UserManager.existsUser("userId", newHut.writerId);
    if (!writerExists) {
      return Promise.reject({
        code: 404,
        result: `No available writer with userId = ${newHut.writerId}`
      });
    }

    return PersistentManager.update(Hut.tableName, newHut, attributeName, value);
  } */

  /**
   * Delete a hut
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value
   */
  /* async deleteHut(attributeName, value) {
    return PersistentManager.delete(Hut.tableName, attributeName, value);
  } */

  /**
   * Delete all huts
   * @returns a Promise without any value
   */
  /* async deleteAllHut() {
    return PersistentManager.deleteAll(Hut.tableName);
  } */

  /**
   * Load all huts 
   * @returns a Promise with the list of all huts
   */
  /* async loadAllHut() {
    return PersistentManager.loadAll(Hut.tableName);
  } */

  /**
   * Check if the hut exists
   * @param {String} attributeName
   * @param {any} value  
   * @returns a resolved Promise with true value in case the hut exists, a resolved Promise with false value otherwise   
   */
  async existsHut(attributeName, value) {
    return PersistentManager.exists(Hut.tableName, attributeName, value);
  }

  /**
   * Load one hut by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the hut in case there is one, a rejected Promise with an object containing code and result otherwise  
   */
  async loadOneByAttributeHut(attributeName, value) {
    const exists = await this.existsHut(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hut with ${attributeName} = ${value}`
      });
    }

    return PersistentManager.loadOneByAttribute(Hut.tableName, attributeName, value);
  }

  /**
   * Load all huts by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise with the list of huts that satisfy the condition  
   */
  /* async loadAllByAttributeHut(attributeName, value) {
    return PersistentManager.loadAllByAttribute(Hut.tableName, attributeName, value);
  } */
  /* ------------------------------------------------------------------------------------------------------------------- */


  /* --------------------------------------------- Other functions ----------------------------------------------------- */
  // Define a new hut
  async defineHut(
    hutName,
    writerId,
    city,
    province,
    region,
    numOfBeds,
    cost,
    latitude,
    longitude,
    altitude
  ) {
    // Defining hut point
    const newPoint = new Point(
      null,
      "hut",
      0,
      1,
      null,
      latitude,
      longitude,
      altitude
    );
    const newPointId = await PointManager.storePoint(newPoint);

    // Defining hut
    const newHut = new Hut(
      null,
      hutName,
      newPointId,
      writerId,
      city,
      province,
      region,
      numOfBeds,
      cost
    ); 

    return this.storeHut(newHut);
  }
}

module.exports = new HutManager();
