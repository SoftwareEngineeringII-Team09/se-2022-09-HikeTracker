"use strict";

const HutDailySchedule = require("../dao/model/HutDailySchedule");
const PersistentManager = require("../dao/PersistentManager");
const HutManager = require("./HutManager");

class HutDailyScheduleManager {
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new hut daily schedule
   * @param {HutDailySchedule} newHutDailySchedule 
   * @returns a Promise with the rowId value of the stored hut daily schedule 
   */
   /* async storeHutDailySchedule(newHutDailySchedule) {
    // Check that foreign key hutId exists
    const hutExists = await HutManager.existsHut("hutId", newHutDailySchedule.hutId);
    if (!hutExists) {
      return Promise.reject({
        code: 404,
        result: `No available hut with hutId = ${newHutDailySchedule.hutId}`
      });
    }

    return PersistentManager.store(HutDailySchedule.tableName, newHutDailySchedule);
  } */

  /**
   * Update a hut daily schedule
   * @param {HutDailySchedule} newHutDailySchedule 
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value if the hutDailySchedule exists, a rejected Promise with an object containing code and result otherwise
   */
  /* async updateHutDailySchedule(newHutDailySchedule, attributeName, value) {
    const exists = await this.existsHutDailySchedule(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hut daily schedule with ${attributeName} = ${value}`
      });
    }
    // Check that foreign key hutId exists
    const hutExists = await HutManager.existsHut("hutId", newHutDailySchedule.hutId);
    if (!hutExists) {
      return Promise.reject({
        code: 404,
        result: `No available hut with hutId = ${newHutDailySchedule.hutId}`
      });
    }

    return PersistentManager.update(HutDailySchedule.tableName, newHutDailySchedule, attributeName, value);
  } */

  /**
   * Delete a hut daily schedule
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value
   */
  /* async deleteHutDailySchedule(attributeName, value) {
    return PersistentManager.delete(HutDailySchedule.tableName, attributeName, value);
  } */

  /**
   * Delete all hut daily schedules
   * @returns a Promise without any value
   */
  /* async deleteAllHutDailySchedule() {
    return PersistentManager.deleteAll(HutDailySchedule.tableName);
  } */

  /**
   * Load all hut daily schedules 
   * @returns a resolved Promise with the list of hut daily schedules in case HutDailySchedule table is not empty, a rejected Promise with an object containing code and result otherwise
   */
  /* async loadAllRowsHutDailySchedule() {
    const hutDailySchedules = await PersistentManager.loadAllRows(HutDailySchedule.tableName);
    if (hutDailySchedules.length === 0) {
      return Promise.reject({
        code: 404,
        result: "HutDailySchedule table is empty"
      });
    }

    return Promise.resolve(hutDailySchedules);
  } */

  /**
   * Check if the hut daily schedule exists
   * @param {String} attributeName
   * @param {any} value  
   * @returns a resolved Promise with true value in case the hut daily schedule exists, a resolved Promise with false value otherwise   
   */
  async existsHutDailySchedule(attributeName, value) {
    return PersistentManager.exists(HutDailySchedule.tableName, attributeName, value);
  }

  /**
   * Load one hut daily schedule by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the hut daily schedule in case there is one, a rejected Promise with an object containing code and result otherwise  
   */
  /* async loadOneByAttributeHutDailySchedule(attributeName, value) {
    const exists = await this.existsHutDailySchedule(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available hut daily schedule with ${attributeName} = ${value}`
      });
    }

    return PersistentManager.loadOneByAttribute(HutDailySchedule.tableName, attributeName, value);
  } */

  /**
   * Load all hut daily schedules by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the list of hut daily schedules in case there is at least one, a rejected Promise with an object containing code and result otherwise  
   */
  /* async loadAllByAttributeHutDailySchedule(attributeName, value) {
    const hutDailySchedules = await PersistentManager.loadAllByAttribute(HutDailySchedule.tableName, attributeName, value);
    if (hutDailySchedules.length === 0) {
      return Promise.reject({
        code: 404,
        result: `No available hut daily schedules with ${attributeName} = ${value}`
      });
    }

    return Promise.resolve(hutDailySchedules);
  } */
  /* ------------------------------------------------------------------------------------------------------------------- */


  /* --------------------------------------------- Other functions ----------------------------------------------------- */
  // Insert other functions you need here
}

module.exports = new HutDailyScheduleManager();