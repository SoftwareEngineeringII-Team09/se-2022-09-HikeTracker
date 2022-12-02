"use strict";

const User = require("../dao/model/User");
const PersistentManager = require("../dao/PersistentManager");
const crypto = require('crypto');
const transporter = require("../middlewares/mail");

class UserManager {
  costructor() { }
  /* -------------------------------------------------- DAO functions -------------------------------------------------- */
  /**
   * Store a new user
   * @param {User} newUser 
   * @returns a Promise with the userId value of the stored user
   */
  async storeUser(newUser) {
    const users = await this.loadAllUser();
    if (users.some(u => u.email === newUser.email)) {
      return Promise.reject({
        code: 409,
        result: `A user with email = ${newUser.email} already exists`
      });
    }
    return PersistentManager.store(User.tableName, newUser);
  }

  /**
   * Update a user
   * @param {User} newUser 
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value if the user exists, a rejected Promise with an object containing code and result otherwise
   */
  async updateUser(newUser, attributeName, value) {
    const exists = await this.existsUser(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available user with ${attributeName} = ${value}`
      });
    }

    return PersistentManager.update(User.tableName, newUser, attributeName, value);
  }

  /**
   * Delete a user
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise without any value
   */
  /* async deleteUser(attributeName, value) {
    return PersistentManager.delete(User.tableName, attributeName, value);
  } */

  /**
   * Delete all users
   * @returns a Promise without any value
   */
  /* async deleteAllUser() {
    return PersistentManager.deleteAll(User.tableName);
  } */

  /**
   * Load all users 
   * @returns a Promise with the list of all users
   */
  async loadAllUser() {
    return PersistentManager.loadAll(User.tableName);
  }

  /**
   * Check if the user exists
   * @param {String} attributeName
   * @param {any} value  
   * @returns a resolved Promise with true value in case the user exists, a resolved Promise with false value otherwise   
   */
  async existsUser(attributeName, value) {
    return PersistentManager.exists(User.tableName, attributeName, value);
  }

  /**
   * Load one user by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a resolved Promise with the user in case there is one, a rejected Promise with an object containing code and result otherwise  
   */
  async loadOneByAttributeUser(attributeName, value) {
    const exists = await this.existsUser(attributeName, value);
    if (!exists) {
      return Promise.reject({
        code: 404,
        result: `No available user with ${attributeName} = ${value}`
      });
    }

    return PersistentManager.loadOneByAttribute(User.tableName, attributeName, value);
  }

  /**
   * Load all users by attribute
   * @param {String} attributeName 
   * @param {any} value 
   * @returns a Promise with the list of users that satisfy the condition  
   */
  /* async loadAllByAttributeUser(attributeName, value) {
    return PersistentManager.loadAllByAttribute(User.tableName, attributeName, value);
  } */
  /* ------------------------------------------------------------------------------------------------------------------- */


  /* --------------------------------------------- Other functions ----------------------------------------------------- */
  // Function to create a new entry for a user within the DB
  async defineUser(
    role,
    firstname,
    lastname,
    mobile,
    email,
    password,
    verificationCode
  ) {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16);

      crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
        if (err) {
          reject();
        }
        const newUser = new User(null, email, salt.toString("hex"), hashedPassword.toString("hex"), verificationCode, firstname, lastname, mobile, role, 0);
        this.storeUser(newUser)
          .then((userId) => resolve(userId))
          .catch((err) => reject(err));
      });
    });
  };

  // Send the email verification code associated with a user account that is not activated yet
  async sendVerificationCode(email, userId, verificationCode) {
    return new Promise((resolve, reject) => {
      // Mail template for sending the verification code
      const mail = {
        from: `HikeTracker <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: "Welcome to HikePiemonte! Here your verification code.",
        html: `
              <div style="color: #001829; padding: 30px">
              <h1 style="color: #003052;">HikeTracker</h1>
          
              <p>Hi, thanks for signing up to HikeTracker!</p>
          
              <p>To complete your enrollment and verify your email account,
              I invite you to <a href="http://localhost:${process.env.CLIENT_PORT || 3000}/activate?id=${userId}&token=${verificationCode}">click here</a>.</p>
              
              <p style="line-height: 0px">The HikeTracker Team</p>
              <p style="line-height: 10px">Best regards!</p>
              </div>`,
      };

      // Verify that the transporter is working
      transporter.verify()
        .then(() => {
          // If it is working, send mail
          transporter.sendMail(mail)
            .then(() => {
              resolve();
            })
            .catch(() => {
              // reject if an error occurs with sending the mail
              const error = {
                code: 500,
                result: "Error while sending email!"
              }
              reject(error);
            })
        })
        .catch(() => {
          const error = {
            code: 500,
            result: "Transporter not working!"
          }
          reject(error);
        })
    })
  }

  // Function to update the email verification code for a user, given its registration email
  async updateVerificationCode(userId, verificationCode) {
    const oldUser = await this.loadOneByAttributeUser("userId", userId);
    const newUser = { ...oldUser, verificationCode: verificationCode };
    await this.updateUser(newUser, "userId", userId);
  }

  // Function to verify the user registration email by its verification code and to activate its account
  async verifyEmail(userId, verificationCode) {
    const user = await this.loadOneByAttributeUser("userId", userId);
    if (user.verificationCode !== verificationCode) {
      return Promise.reject({
        code: 406,
        result: "Wrong code!"
      });
    }

    return this.updateUser({ ...user, active: 1, verificationCode: null }, "userId", userId);
  }

}

module.exports = new UserManager();