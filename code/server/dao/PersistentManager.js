"use strict";
const sqlite = require("sqlite3");

class PersistentManager {
  constructor() {
    this.dbName = process.env.NODE_ENV === "test" ? "DB.test.db" : "DB.db";
    this.db = new sqlite.Database(this.dbName, (err) => {
      if (err) throw err;
    });
    this.db.get("PRAGMA foreign_keys = ON");
  }

  store(tableName, object) {
    return new Promise((resolve, reject) => {
      //names of the attributes of the objects
      let attributesName = [];
      //Values of the attributes
      let attributesValue = [];

      //Loop through all the object attributes and push them into the arrays
      for (let prop in object) {
        if (Object.prototype.hasOwnProperty.call(object, prop)) {
          attributesName.push(prop);
          attributesValue.push(object[prop]);
        }
      }

      const placeHoldersArray = attributesName.map((val) => "?");
      const sql =
        "INSERT INTO " +
        tableName +
        "(" +
        attributesName.join(",") +
        ") VALUES (" +
        placeHoldersArray.join(",") +
        ")";

      this.db.run(sql, attributesValue, function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      });
    });
  }


  async update(tableName, object, attributeName, value) {
    return new Promise((resolve, reject) => {
      //names of the attributes of the objects
      let attributesName = [];
      //Values of the attributes
      let attributesValue = [];

      //Loop through all the object attributes and push them into the arrays
      for (let prop in object) {
        if (Object.prototype.hasOwnProperty.call(object, prop)) {
          attributesName.push(prop + "= ?");
          attributesValue.push(object[prop]);
        }
      }

      const sql =
        "UPDATE " +
        tableName +
        " SET " +
        attributesName.join(",") +
        " WHERE " +
        attributeName +
        " = ?";

      this.db.run(sql, [...attributesValue, value], (err) => {
        if (err) reject(err);

        resolve();
      });
    });
  }

  async delete(tableName, attributeName, value) {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM " + tableName + " WHERE " + attributeName + "= ?";

      this.db.run(sql, value, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  async deleteAll(tableName) {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM " + tableName;

      this.db.run(sql, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  loadAll(tableName) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM " + tableName;

      this.db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  }

  async exists(tableName, attributeName, value) {
    try {
      let row = await this.loadOneByAttribute(tableName, attributeName, value);
      return !(row === undefined);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async loadOneByAttribute(tableName, attributeName, value) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM " + tableName + " WHERE " + attributeName + "= ?";

      this.db.get(sql, value, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  async loadAllByAttribute(tableName, attributeName, value) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM " + tableName + " WHERE " + attributeName + "= ?";

      this.db.all(sql, value, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

}

module.exports = new PersistentManager();
