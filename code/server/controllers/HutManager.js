"use strict";

const location = require("../lib/helpers/locations");
const fetch = require('node-fetch');
const Hut = require("../dao/model/Hut");
const Point = require("../dao/model/Point");
const User = require("../dao/model/User");
const PointManager = require("./PointManager");
const UserManager = require("./UserManager");
const PersistentManager = require("../dao/PersistentManager");
const HutDailyScheduleManager = require("./HutDailyScheduleManager");

class HutManager {
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new hut
   * @param {Hut} newHut
   * @returns a Promise with the hutId value of the stored hut
   */
  async storeHut(newHut) {
    // Check if foreign key pointId exists
    const pointExists = await PersistentManager.exists(Point.tableName, "pointId", newHut.pointId);
    if (!pointExists) {
      return Promise.reject({
        code: 404,
        result: `No available point with pointId = ${newHut.pointId}`,
      });
    }
    // Check if foreign key writerId exists
    const writerExists = await PersistentManager.exists(User.tableName, "userId", newHut.writerId);
    if (!writerExists) {
      return Promise.reject({
        code: 404,
        result: `No available writer with userId = ${newHut.writerId}`,
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
    // Check if foreign key pointId exists
    const pointExists = await PersistentManager.exists(Point.tableName, "pointId", newHut.pointId);
    if (!pointExists) {
      return Promise.reject({
        code: 404,
        result: `No available point with pointId = ${newHut.pointId}`
      });
    }
    // Check if foreign key writerId exists
    const writerExists = await PersistentManager.exists(User.tableName, "userId", newHut.writerId);
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
  async loadAllHut() {
    return PersistentManager.loadAll(Hut.tableName);
  }

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
        result: `No available hut with ${attributeName} = ${value}`,
      });
    }

    return PersistentManager.loadOneByAttribute(
      Hut.tableName,
      attributeName,
      value
    );
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
  async defineHut(hutData) {
    const URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location=";

    const apires = await (await fetch(URL + `${hutData.longitude},${hutData.latitude}`)).json();
    if (apires.address.City.toUpperCase() !== location.getCityName(parseInt(hutData.city))) {
      return Promise.reject({
        code: 422,
        result: `Location must be consistent!`,
      });
    }

    // Defining hut point
    const newPoint = new Point(
      null,
      "hut",
      0,
      1,
      null,
      hutData.latitude,
      hutData.longitude
    );
    const newPointId = await PointManager.storePoint(newPoint);

    // Defining hut
    const newHut = new Hut(
      null,
      hutData.hutName,
      newPointId,
      hutData.writerId,
      hutData.city,
      hutData.province,
      hutData.region,
      hutData.numOfBeds,
      hutData.cost,
      hutData.altitude,
      hutData.phone,
      hutData.email,
      hutData.website
    );

    return this.storeHut(newHut);
  }

  async getAllHuts() {
    let huts = await this.loadAllHut();
    //position coord needed
    //shcedule time needed
    huts = await Promise.all(
      huts.map(async (h) => {
        const scheduleTime =
          await HutDailyScheduleManager.loadAllByAttributeHutDailySchedule(
            "hutId",
            h.hutId
          );
        const hutPosition = await PointManager.loadOneByAttributePoint(
          "pointId",
          h.pointId
        );

        const hut = {
          hutId: h.hutId,
          hutName: h.hutName,
          pointId: h.pointId,
          city: h.city,
          province: h.province,
          region: h.region,
          numOfBeds: h.numOfBeds,
          cost: h.cost,
          latitude: hutPosition.latitude,
          longitude: hutPosition.longitude,
          altitude: h.altitude,
          phone: h.phone,
          email: h.email,
          website: h.website,
          schedule: scheduleTime.map((s) => {
            let time = {
              day: s.day,
              openTime: s.openTime,
              closeTime: s.closeTime,
            };
            return time;
          }),
        };

        return hut;
      })
    );

    return Promise.resolve(huts);
  }

  // Load a hut by hutId
  async getHutById(hutId) {
    let hut = await this.loadOneByAttributeHut("hutId", hutId);
    let point = await PointManager.loadOneByAttributePoint(
      "pointId",
      hut.pointId
    );

    hut = {
      ...hut,
      ...point
    }

    return Promise.resolve(hut);
  }


  // Load a hutInfo by pointId
  async getHutByPointId(pointId) {
    let hut = await this.loadOneByAttributeHut("pointId", pointId);
    let point = await PointManager.loadOneByAttributePoint(
      "pointId",
      hut.pointId
    );

    hut = {
      ...hut,
      ...point
    }

    return Promise.resolve(hut);
  }
  /*async getOneHut(atrName, val) {
    let hut = await this.loadOneByAttributeHut(atrName, val);
    //position coord needed
    //shcedule time needed
    console.log(hut)
    hut = await Promise.all(
      hut.map(async (h) => {
        const scheduleTime =
          await HutDailyScheduleManager.loadAllByAttributeHutDailySchedule(
            "hutId",
            h.hutId
          );
        const hutPosition = await PointManager.loadOneByAttributePoint(
          "pointId",
          h.pointId
        );

        const hut = {
          hutId: h.hutId,
          hutName: h.hutName,
          pointId: h.pointId,
          city: h.city,
          province: h.province,
          region: h.region,
          numOfBeds: h.numOfBeds,
          cost: h.cost,
          latitude: hutPosition.latitude,
          longitude: hutPosition.longitude,
          altitude: h.altitude,
          phone: h.phone,
          email: h.email,
          website: h.website,
          schedule: scheduleTime.map((s) => {
            let time = {
              day: s.day,
              openTime: s.openTime,
              closeTime: s.closeTime,
            };
            return time;
          }),
        };

        return hut;
      })
    );

    return Promise.resolve(huts);
  }*/
}

module.exports = new HutManager();
