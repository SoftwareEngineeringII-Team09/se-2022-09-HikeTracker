'use strict';

const express = require('express');
const router = express.Router();

// Import the module for authentication
const passport = require('passport');

// Import the module to generate the verification code
const randomWords = require('random-words');

// Import the module for creating HTTP errors
const createError = require('http-errors');

// Import the module for validations
const { validationResult } = require('express-validator');
// Import configs for validations
const authValidation = require('../validations/authValidation');

// Import models/DAOs (Data Access Objects)
const userModel = require('../models/user.model');
const mailModel = require('../models/mail.model');

// POST /auth/signup
// Route to create a new entry for a user within the DB and 
// to perform an account registration
router.post('/signup', authValidation.signup, (req, res) => {
    // Check for validation errors associated with request body
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        // If a validation error occurs, generate an HTTP error
        const error = new createError.UnprocessableEntity('Validation error');
        return res.status(error.statusCode).json({ errors: validationErrors.array(), message: error.message });
    }

    // Check if a user associated with the given email already exists
    userModel.getUserByEmail(req.body.email)
        .then(() => {
            // If a user associated with the given email already exists, generate a HTTP error
            // because two users with the same email can not exist
            const error = new createError.Conflict("An account associated to the given email already exists");
            res.status(error.statusCode).json({ message: error.message });
        })
        .catch(err => {
            // If there is no user associated with the given email, continue with signup
            if (err.statusCode === 404) {
                // Generate an email verification code
                const verificationCode = randomWords({ exactly: 3, join: "-" });
                // Create a new entry for the user within the DB
                userModel.createUser({ ...req.body, verificationCode: verificationCode })
                    .then(user => {
                        // Send by email the verification code to activate the user'account
                        mailModel.sendVerificationCode({ email: user.email, verificationCode: verificationCode })
                            .then(() => {
                                // Send back the user object as response
                                res.status(200).json(user);
                            })
                            .catch(err => {
                                // An error occurs while sending mail, but user is successfully registered
                                res.status(err.statusCode).json({ message: err.message })
                            })
                    })
                    .catch(err => {
                        // An error occurs while creating a new entry for the user within the DB
                        res.status(err.statusCode).json({ message: err.message });
                    })
            } else {
                // An error occurs while checking for the presence of the user within the DB
                res.status(err.statusCode).json({ message: err.message });
            }
        })
})

// PUT /auth/send-verification-code
// Route to generate and send by email a new verification code for the registration email
// of a user to activate his account
router.put('/send-verification-code', authValidation.sendVerificationCode, (req, res) => {
    // Check for validation errors associated with request body
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        // If a validation error occurs, generate an HTTP error
        const error = new createError.UnprocessableEntity('Validation error');
        return res.status(error.statusCode).json({ errors: validationErrors.array(), message: error.message });
    }

    // Generate a new verification code
    const verificationCode = randomWords({ exactly: 3, join: "-" });
    // Update the verification code associated with a user within the DB
    userModel.updateVerificationCode({ email: req.body.email, verificationCode: verificationCode })
        .then(() => {
            // Send by email the new verification code
            mailModel.sendVerificationCode({ email: req.body.email, verificationCode: verificationCode })
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    // An error occurs while sending mail, but the verification code is updated
                    res.status(err.statusCode).json({ message: err.message });
                })
        })
        .catch(err => {
            // An error occurs while updating the verification code within the DB
            res.status(err.statusCode).json({ message: err.message });
        })
})

// PUT /auth/verify-email
// Route to verify the registration email of a user and to activate his account
router.put('/verify-email', authValidation.verifyEmail, (req, res) => {
    // Check for validation errors associated with request body
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        // If a validation error occurs, generate an HTTP error
        const error = new createError.UnprocessableEntity('Validation error');
        return res.status(error.statusCode).json({ errors: validationErrors.array(), message: error.message });
    }

    // Get the user by email from the DB
    userModel.getUserByEmail(req.body.email)
        .then(() => {
            // Verify his registration email and active his account
            userModel.verifyEmail(req.body)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    // An error occurs while activating user's account
                    res.status(err.statusCode).json({ message: err.message });
                })
        })
        .catch(err => {
            // An error occurs while getting the user by email from the DB
            res.status(err.statusCode).json({ message: err.message });
        })
})

// POST /auth/login/password
// Route to perform user login with passport local strategy
router.post('/login/password', authValidation.login, (req, res, next) => {
    // Check for validation errors associated with request body
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        // If a validation error occurs, generate an HTTP error
        const error = new createError.UnprocessableEntity('Validation error');
        return res.status(error.statusCode).json({ errors: validationErrors.array(), message: error.message });
    }

    // Perform the authentication check
    passport.authenticate('local', (err, user) => {
        // An error occurs while performing authentication
        if (err) return res.status(err.statusCode).json(err);
        // Perform login
        req.login(user, (err) => {
            // An error occurs while performing login
            if (err) return next(err);
            // User is logged in and the server sends back the user object as response
            return res.json(req.user);
        });
    })(req, res, next);
});

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
    if (req.isAuthenticated()) return res.status(200).json(req.user);

    // User is not authenticated and logged in
    const error = new createError.Unauthorized("Unauthenticated user");
    res.status(error.statusCode).json(error.message)
})

module.exports = router;