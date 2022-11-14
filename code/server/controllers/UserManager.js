"use strict";

const User = require("../dao/model/User");
const PersistentManager = require("../dao/PersistentManager");
const crypto = require('crypto')

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
      user.userId,
      user.email,
      user.firstname,
      user.lastname,
      user.mobile,
      user.role,
      user.active
    ));
  }

  async getUserByEmail(userEmail) {
    let exists = await PersistentManager.exists(User.tableName, "email", userEmail);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available User with email = ${userEmail}`,
      });
    }
    let user = await PersistentManager.loadOneByAttribute(User.tableName, "email", userEmail); 

    return Promise.resolve(new User(
      user.userId,
      user.email,
      user.salt,
      user.password,
      user.firstname,
      user.lastname,
      user.mobile,
      user.role,
      user.active
    ));
  }

  async getUser(email, password) {
    let exists = await PersistentManager.exists(User.tableName, "email", userEmail);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available User with email = ${userEmail}`,
      });
    }
    let user = await PersistentManager.loadOneByAttribute(User.tableName, "email", userEmail); 
  
    crypto.scrypt(password, user.salt, 32, function (err, hashedPassword) { 
      if (err) Promise.reject({
        code: 500,
        result: `Error with crypto`
      });
      if (!crypto.timingSafeEqual(Buffer.from(user.password, 'hex'), hashedPassword)) 
        Promise.resolve(false);
      else
        Promise.resolve(new User(
          user.userId,
          user.email,
          user.firstname,
          user.lastname,
          user.mobile,
          user.role,
          user.active))
    });
  }

  async createUser(user) {
    const salt = crypto.randomBytes(16);
        // Generate the hashed password to store it within the DB.
        crypto.pbkdf2(user.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) {
                Promise.reject({
                  code: 500,
                  result: `Error with crypto`
                })
            }

            PersistentManager.store(User.tableName, new User(
              null,
              user.email,
              salt,
              hashedPassword,
              user.firstname,
              user.lastname,
              user.mobile,
              user.role,
              true
            ))
            .then((userId) => ({userId: userId, email: email}))
            .catch(() => ({code: 500, result: `Error in createUser`}))
        });
  }
}

module.exports = new UserManager();
