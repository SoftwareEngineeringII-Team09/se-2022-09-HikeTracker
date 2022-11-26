'use strict';

const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const UserManager = require('../controllers/UserManager');

// Configuration for passport logging in with local strategy
exports.useLocal = () => passport.use(new LocalStrategy(function verify(username, password, done) {
	// get user by email from the DB
	UserManager.loadOneByAttributeUser("email", username).then(user => {
		// if the user exists, check for password matching
		crypto.pbkdf2(password, Buffer.from(user.salt, "hex"), 310000, 32, 'sha256', function (err, hashedPassword) {
			// An error occurs with pbkdf2 or crypto
			if (err) {
				const error = {
					code: 500,
					result: "Internal server error with crypto",
				}
				return done(error);
			}

			// If the given password does not match with the one within the DB
			// return an error.
			if (!crypto.timingSafeEqual(Buffer.from(user.password, "hex"), hashedPassword)) {
				const error = {
					code: 401,
					result: "Wrong password! Try again",
				}
				return done(error);
			}

			// If it's all right, the user is logged in
			return done(null, { userId: user.userId, email: user.email, firstname: user.firstname, lastname: user.lastname, mobile: user.mobile, role: user.role, active: user.active });
		});
	})
		.catch(err => {
			// An error occurs with getting the user from the DB.
			// In particular, it can be an Internal Server Error 
			// or a Not Found Error, if there is no user with the given email.
			return done(err);
		})
}));

// Configuration for passport serialization of the logged in user
exports.serializeUser = () => passport.serializeUser((user, done) => {
	done(null, user.userId);
})

// Configuration for passport deserialization of the logged in user
exports.deserializeUser = () => passport.deserializeUser((userId, done) => {
	UserManager.loadOneByAttributeUser("userId", userId)
		.then(user => {
			done(null, user);
		})
		.catch(err => {
			done(err, null);
		})
})

// Check if the user is currently logged in
exports.withAuth = (req, res, next) => {
	// If the user is logged in, the server can execute
	// the requested operation
	if (req.isAuthenticated()) return next();

	// If the user is not logged in, the server 
	// does not execute the requested operation and send back an error
	const errorCode = 401;
	const errorMessage = "The user is not authorized";
	return res.status(errorCode).json({ error: errorMessage });
}