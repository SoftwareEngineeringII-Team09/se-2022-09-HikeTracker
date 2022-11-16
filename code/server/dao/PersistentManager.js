"use strict";
const sqlite = require("sqlite3");

class PersistentManager {
  constructor() {
    this.dbName = "DB.db";
  }

  store(tableName, object) {
    return new Promise((resolve, reject) => {
      //names of the attributes of the objects
      let attributesName = [];
      //Values of the attributes
      let attributesValue = [];

      //Loop through all the object attributes and push them into the arrays
      for (var prop in object) {
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

      const db = new sqlite.Database(this.dbName, (err) => {
        if (err) {
          reject(err);
          return;
        }
      });
      db.get("PRAGMA foreign_keys = ON");
      db.run(sql, attributesValue, function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
      db.close();
    });
  }

  // NOTE: This function has been commented out for test coverage purposes because is unused at the moment, uncomment when you will use it
  /* async delete(tableName, attribute_name, id) {
    return new Promise((resolve, reject) => {
      const sql =
        "DELETE FROM " + tableName + " WHERE " + attribute_name + "= ?";
      const db = new sqlite.Database(this.dbName, (err) => {
        if (err) reject(err);
      });
      db.get("PRAGMA foreign_keys = ON");
      db.run(sql, id, (err) => {
        if (err) reject(err);
        resolve();
      });
      db.close();
    });
  } */

  // NOTE: This function has been commented out for test coverage purposes because is unused at the moment, uncomment when you will use it
  /* async update(tableName, object, attribute_name, id) {
    return new Promise((resolve, reject) => {
      //names of the attributes of the objects
      let attributesName = [];
      //Values of the attributes
      let attributesValue = [];

      //Loop through all the object attributes and push them into the arrays
      for (var prop in object) {
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
        attribute_name +
        " = ?";

      const db = new sqlite.Database(this.dbName, (err) => {
        if (err) reject(err);
      });
      db.get("PRAGMA foreign_keys = ON");
      db.run(sql, [...attributesValue, id], (err) => {
        if (err) reject(err);

        resolve();
      });
      db.close();
    });
  } */

  async deleteAll(tableName) {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM " + tableName;
      const db = new sqlite.Database(this.dbName, (err) => {
        if (err) reject(err);
      });
      db.get("PRAGMA foreign_keys = ON");
      db.run(sql, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
      db.close();
    });
  }

  loadAllRows(tableName) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM " + tableName;
      const db = new sqlite.Database(this.dbName, (err) => {
        if (err) {
          reject(err);
          return;
        }
      });
      db.get("PRAGMA foreign_keys = ON");
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
      db.close();
    });
  }

  async exists(tableName, parameter_name, value) {
    try {
      let row = await this.loadOneByAttribute(tableName, parameter_name, value);
      if (row) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async loadOneByAttribute(tableName, parameter_name, value) {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT * FROM " + tableName + " WHERE " + parameter_name + "= ?";
      const db = new sqlite.Database(this.dbName, (err) => {
        if (err) reject(err);
      });
      db.get("PRAGMA foreign_keys = ON");
      db.get(sql, value, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
      db.close();
    });
  }

  async loadAllByAttribute(tableName, parameter_name, value) {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT * FROM " + tableName + " WHERE " + parameter_name + "= ?";
      const db = new sqlite.Database(this.dbName, (err) => {
        if (err) reject(err);
      });
      db.get("PRAGMA foreign_keys = ON");
      db.all(sql, value, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
      db.close();
    });
  }
}

module.exports = new PersistentManager();
