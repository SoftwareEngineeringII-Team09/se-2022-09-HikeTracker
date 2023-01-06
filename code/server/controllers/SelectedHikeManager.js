"use strict";

const SelectedHike = require("../dao/model/SelectedHike");
const PersistentManager = require("../dao/PersistentManager");
const Hike = require("../dao/model/Hike");
const User = require("../dao/model/User");
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);



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
    // Check if foreign key hikerId exists
    const hikerExists = await PersistentManager.exists(User.tableName, "userId", newSelectedHike.hikerId);
    if (!hikerExists) {
      return Promise.reject({
        code: 404,
        result: `No available hiker with userId = ${newSelectedHike.hikerId}`
      });
    }
    let lastId = PersistentManager.store(SelectedHike.tableName, newSelectedHike);
    return lastId
  } 

  /**
   * Update a SelectedHike
   * @param {SelectedHike} newSelectedHike 
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value if the SelectedHike exists, a rejected Promise with an object containing code and result otherwise
   */
  async updateSelectedHike(newSelectedHike, attributeName, value) {
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
    // Check if foreign key hikerId exists
    const hikerExists = await PersistentManager.exists(User.tableName, "userId", newSelectedHike.hikerId);
    if (!hikerExists) {
      return Promise.reject({
        code: 404,
        result: `No available hiker with userId = ${newSelectedHike.hikerId}`
      });
    }
    return PersistentManager.update(SelectedHike.tableName, newSelectedHike, attributeName, value);
  }

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
  async loadOneByAttributeSelectedHike(attributeName, value) {
    const exists = await this.existsSelectedHike(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available SelectedHike with ${attributeName} = ${value}`
      });
    }
    return PersistentManager.loadOneByAttribute(SelectedHike.tableName, attributeName, value);
  }

  /**
   * Load all SelectedHikes by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise with the list of SelectedHikes that satisfy the condition  
   */
  async loadAllByAttributeSelectedHike(attributeName, value) {
    const exists = await this.existsSelectedHike(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available SelectedHike with ${attributeName} = ${value}`,
      });
    }
    return PersistentManager.loadAllByAttribute(SelectedHike.tableName, attributeName, value);
  }
  /* ------------------------------------------------------------------------------------------------------------------- */


  /* --------------------------------------------- Other functions ----------------------------------------------------- */
  async terminateHike(selectedHikeId, endTime) {
    const selectedHike = await this.loadOneByAttributeSelectedHike("selectedHikeId", selectedHikeId);
    const startTimeObject = dayjs(selectedHike.startTime, 'DD/MM/YYYY, HH:mm:ss');
    const endTimeObject =  dayjs(endTime, 'DD/MM/YYYY, HH:mm:ss');
    if (startTimeObject.isAfter(endTimeObject)) {
      return Promise.reject({
        code: 422,
        result: `startTime = ${selectedHike.startTime} is after endTime = ${endTime}`
      });
    }

    return this.updateSelectedHike({ ...selectedHike, endTime: endTime, status: "finished"}, "selectedHikeId", selectedHikeId);
  }


async startHike(hikeId, startTime,hikerId) {
  const startTimeObject = dayjs(startTime,['D/M/YYYY, HH:mm:ss','DD/MM/YYYY, HH:mm:ss' ],true);
  const NowObject =  dayjs();
    if (startTimeObject.isAfter(NowObject)) {
      return ({
        code: 422,
        result: `startTime = ${startTime} is after current Time`
      });
    }
    const selectedHike = await this.existsSelectedHike("hikeId", hikeId);
 
    if (selectedHike && selectedHike.endTime == null) {
      return Promise.reject({
        code: 400,
        result: `This hiker already had a started hike`
      });
    }
    const newSelectedHike =  new SelectedHike(
      null,
      hikeId,
      hikerId,
      "ongoing",
      startTime,
      null
    )

    return this.storeSelectedHike(newSelectedHike);
  }




async loadStartedHike(hikerId) {
  let startHike = await this.loadOneByAttributeSelectedHike("hikerId", hikerId);
      return {
        hikeId : startHike.hikeId,
        startTime: startHike.startTime
      } 
}
}

module.exports = new SelectedHikeManager();