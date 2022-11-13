"use strict";

const User = require("../dao/model/User");
const PersistentManager = require("../dao/PersistentManager");

class UserManager {
  constructor() { }

  async getUserById(userId) {
    let exists = await PersistentManager.exists(User.tableName, "user_id", userId);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available User with user_id = ${userId}`,
      });
    }
    let user = await PersistentManager.loadOneByAttribute(User.tableName, "user_id", userId); 

    return Promise.resolve(new User(
      user.user_id,
      user.emial,
      user.firstname,
      user.lastname,
      user.mobile,
      user.role,
      user.active
    ));
  }
}

module.exports = new UserManager();
