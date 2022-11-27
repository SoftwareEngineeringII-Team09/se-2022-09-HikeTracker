"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");
const randomWords = require('random-words');
const { validationResult } = require("express-validator");
const authValidation = require("../validations/authValidation");
const UserManager = require("../controllers/UserManager");

// POST /auth/signup
// Route to create a new entry for a user within the DB and 
// to perform an account registration
router.post("/signup", authValidation.signup, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ error: errors.array()[0] });
		}
		const verificationCode = randomWords({ exactly: 3, join: "-" });

		const userId = await UserManager.defineUser(
			req.body.role,
			req.body.firstname,
			req.body.lastname,
			req.body.mobile,
			req.body.email,
			req.body.password,
			verificationCode
		);
		await UserManager.sendVerificationCode(req.body.email, userId, verificationCode);

		return res.status(201).json(userId);
	} catch (exception) {
		const errorCode = exception.code ?? 500;
		const errorMessage =
			exception.result ?? "Something went wrong, try again";
		return res.status(errorCode).json({ error: errorMessage });
	}
})

// PUT /auth/send-verification-code
// Route to generate and send by email a new verification code for the registration email
// of a user to activate his account
router.put('/sendVerificationCode', authValidation.sendVerificationCode, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ error: errors.array()[0] });
		}
		const verificationCode = randomWords({ exactly: 3, join: "-" });

		await UserManager.updateVerificationCode(req.body.userId, verificationCode);
		const user = await UserManager.loadOneByAttributeUser("userId", req.body.userId);
		await UserManager.sendVerificationCode(user.email, req.body.userId, verificationCode);

		return res.status(201).end();
	} catch (exception) {
		const errorCode = exception.code ?? 500;
		const errorMessage =
			exception.result ?? "Something went wrong, try again";
		return res.status(errorCode).json({ error: errorMessage });
	}
})

// PUT /auth/verify-email
// Route to verify the registration email of a user and to activate his account
router.put('/verifyEmail', authValidation.verifyEmail, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ error: errors.array()[0] });
		}
		
		await UserManager.verifyEmail(req.body.userId, req.body.token);

		return res.status(201).end();
	} catch (exception) {
		const errorCode = exception.code ?? 500;
		const errorMessage =
			exception.result ?? "Something went wrong, try again";
		return res.status(errorCode).json({ error: errorMessage });
	}
})

// POST /auth/login/password
// Route to perform user login with passport local strategy
router.post('/login/password', authValidation.login, (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ error: errors.array()[0] });
		}
		// Perform the authentication check
		passport.authenticate('local', (err, user) => {
			// An error occurs while performing authentication
			if (err) {
				const errorCode = err.code ?? 500;
				const errorMessage =
					err.result ?? "Something went wrong, try again";
				return res.status(errorCode).json({ error: errorMessage });
			}
			// Perform login
			req.login(user, (err) => {
				// An error occurs while performing login
				if (err) return next(err);
				// User is logged in and the server sends back the user object as response
				return res.json(req.user);
			});
		})(req, res, next);
	} catch (exception) {
		const errorCode = exception.code ?? 500;
		const errorMessage =
			exception.result ?? "Something went wrong, try again";
		return res.status(errorCode).json({ error: errorMessage });
	}
})


// DELETE /auth/logout
// Route to perform the logout of the user
router.delete('/logout', (req, res, next) => {
	// Perform logout
	req.logout((err) => {
		// An error occurs while performing logout
		if (err) return next(err);
	})
	// Logout successfully performed
	res.end();
})

// GET /auth/current
// Route to get the current session of a user, if he is logged in
router.get('/current', (req, res) => {
	// If the user is authenticated and logged in, the server sends back user data as response
	if (req.isAuthenticated()) return res.status(200).json({ userId: req.user.userId, email: req.user.email, firstname: req.user.firstname, lastname: req.user.lastname, mobile: req.user.mobile, role: req.user.role, active: req.user.active });

	// User is not authenticated and logged in
	const errorCode = 401;
	const errorMessage = "The user is not unauthenticated";
	return res.status(errorCode).json({ error: errorMessage });
})

module.exports = router;
