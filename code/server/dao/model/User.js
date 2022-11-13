"user strict";

class User {
  static tableName = "User";
  
  constructor(userId, email, firstName, lastName, mobile, role, active) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.mobile = mobile;
    this.role = role;
    this.active = active;
  }
}

module.exports = User;

const crypto = require('crypto');
const createError = require('http-errors');
const db = require('../db'); 

exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM User WHERE email = ?';
        db.get(query, [email], (err, row) => {
            if (err) reject(new createError.InternalServerError(err.message));
            else if (!row) reject(new createError.NotFound("We checked, but we can't find this email in our logs ..."));
            else resolve(row);
        })
    })
}

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM User WHERE user_id = ?';
        db.get(query, [id], (err, row) => {
            if (err) reject(new createError.InternalServerError(err.message));
            else if (!row) reject(new createError.NotFound("No users with given id"));
            else resolve(row);
        })
    })
}

// This function is used at log-in time to verify username and password.
exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM User WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve(false);
        }
        else {
  
          const user = { id: row.id, username: row.email, name: row.name };
  
          // Check the hashes with an async call, this operation may be CPU-intensive (and we don't want to block the server)
          crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) { 
            if (err) reject(err);
            if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword)) 
              resolve(false);
            else
              resolve(user);
          });
        }
      });
    });
  };

exports.createUser = (user) => {
    return new Promise((resolve, reject) => {
        // Generate a random salt for the password
        const salt = crypto.randomBytes(16);
        // Generate the hashed password to store it within the DB.
        crypto.pbkdf2(user.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) {
                reject(new createError.InternalServerError("Internal server error with crypto"))
                return;
            }

            const query = 'INSERT INTO User (firstname, lastname, email, password, salt, verification_code, mobile, role, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.run(query, [user.firstname, user.lastname, user.email, hashedPassword, salt, user.verificationCode, 0, user.role, 0], function (err) {
                if (err) reject(new createError.InternalServerError(err.message));
                // New entry for a user created within the DB, so resolve its id and its email
                else resolve({ id: this.lastID, email: user.email })
            });
        });
    })
}

// Function to update the email verification code for a user, given its registration email
exports.updateVerificationCode = (data) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE User SET verification_code = ? WHERE email = ?';        //   MANCA QUESTO CAMPO NEL DB, NON NECESSARIO PER ORA
        db.run(query, [data.verificationCode, data.email], function (err) {
            if (err) reject(new createError.InternalServerError(err.message));
            else if (this.changes === 0) reject(new createError.NotFound('We checked, but we can t find this email in our logs ...'));
            else resolve();
        })
    })
}

// Function to verify the user registration email by its verification code
exports.verifyEmail = (data) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE User SET active = ?, verification_code = ? WHERE email = ? and verification_code = ?';      //   MANCA QUESTO CAMPO NEL DB, NON NECESSARIO PER ORA
        db.run(query, [1, undefined, data.email, data.verificationCode], function (err) {
            if (err) reject(new createError.InternalServerError(err.message));
            // No changes have been made, so wrong verification code given
            else if (this.changes === 0) reject(new createError.NotAcceptable('We don t joke when we say we check ... Wrong code!'));
            else resolve();
        })
    })
}