'use strict';

const crypto = require('crypto');

// Import modules for authentication
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Import the module for creating HTTP errors
// const createError = require('http-errors');

const UserManager = require('../controllers/UserManager');

// Configuration for passport logging in with local strategy
exports.useLocal = () => passport.use(new LocalStrategy(function verify(username, password, done) {
    // get user by email from the DB
    UserManager.getUserByEmail(username)
        .then(user => {
            // if the user exists, check for password matching
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
                // An error occurs with pbkdf2 or crypto
                if (err) return done({code: 500, result: "Internal server error with crypto"});

                // If the given password does not match with the one within the DB
                // return an error.
                if (!crypto.timingSafeEqual(user.password, hashedPassword))
                    return done({code: 500, result: "Internal server error with crypto"});

                // If it's all right, the user is logged in
                return done(null, { id: user.userId, email: user.email, firstname: user.firstname, lastname: user.lastname, mobile: user.mobile, role: user.role, active: user.active });
            });
        })
        .catch(err => {
            // An error occurs with getting the user from the DB.
            // In particular, it can be an Internal Server Error 
            // or a Not Found Error, if there is no user with the given email.
            return done(err)
        })
}));

// Configuration for passport serialization of the logged in user
exports.serializeUser = () => passport.serializeUser((user, done) => {
    done(null, user);
})

// Configuration for passport deserialization of the logged in user
exports.deserializeUser = () => passport.deserializeUser((id, done) => {
    UserManager.getUserById(id)
        .then(user => {
            done(null, { id: user.userId, email: user.email, firstname: user.firstname, lastname: user.lastname, mobile: user.mobile, role: user.role, active: user.active });
        })
        .catch(err => {
            done(err, null);
        })
})

// Check if the user is currently logged in
exports.withAuth = (req, res, next) => {
    // If the user is logged in, the server can execute the requested operation
    if (req.isAuthenticated()) return next();

    // If the user is not logged in, the server does not execute the requested operation and send back an error
    const error = {code: 401, result: "Not authenticated"};
    return res.status(error.code).json({ message: error.result });
}