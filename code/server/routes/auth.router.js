'use strict';

const express = require('express');
const router = express.Router();

// Import the module for authentication
const passport = require('passport');

// Import the module to generate the verification code
// const randomWords = require('random-words');

// const createError = require('http-errors');

// Import the module for validations
const { validationResult } = require('express-validator');
// Import configs for validations
// const authValidation = require('../validations/authValidation');

const UserManager = require('../controllers/UserManager');
// const mailModel = require('../model/Mail');

// POST /auth/signup
// Route to create a new entry for a user within the DB and 
// to perform an account registration
router.post('/signup', (req, res) => {
    // Check for validation errors associated with request body
    // const validationErrors = validationResult(req);
    // if (!validationErrors.isEmpty()) {
    //     // If a validation error occurs, generate an HTTP error
    //     const error = new createError.UnprocessableEntity('Validation error');
    //     return res.status(error.statusCode).json({ errors: validationErrors.array(), message: error.message });
    // }

    // Check if a user associated with the given email already exists
    UserManager.getUserByEmail(req.body.email)
        .then(() => {
            // If a user associated with the given email already exists, generate a HTTP error
            // because two users with the same email can not exist
            res.status(409).json({ error: "An account associated to the given email already exists" });
        })
        .catch(err => {
            // If there is no user associated with the given email, continue with signup
            if (err.code === 404) {
                // Generate an email verification code
                // const verificationCode = randomWords({ exactly: 3, join: "-" });
                // Create a new entry for the user within the DB
                UserManager.createUser({ ...req.body, })
                    .then(user => {
                        // Send by email the verification code to activate the user'account
                        // mailModel.sendVerificationCode({ email: user.email, verificationCode: verificationCode })
                        //     .then(() => {
                        //         // Send back the user object as response
                        //         res.status(200).json(user);
                        //     })
                        //     .catch(err => {
                        //         // An error occurs while sending mail, but user is successfully registered
                        //         res.status(err.statusCode).json({ message: err.message })
                        //     })
                        res.status(200).end();
                    })
                    .catch(err => {
                        // An error occurs while creating a new entry for the user within the DB
                        res.status(err.code).json({ error: err.result });
                    })
            } else {
                // An error occurs while checking for the presence of the user within the DB
                res.status(err.code).json({ error: err.result });
            }
        })
})

// PUT /auth/send-verification-code
// Route to generate and send by email a new verification code for the registration email
// of a user to activate his account
// router.put('/send-verification-code', authValidation.sendVerificationCode, (req, res) => {
//     // Check for validation errors associated with request body
//     const validationErrors = validationResult(req);
//     if (!validationErrors.isEmpty()) {
//         // If a validation error occurs, generate an HTTP error
//         const error = new createError.UnprocessableEntity('Validation error');
//         return res.status(error.statusCode).json({ errors: validationErrors.array(), message: error.message });
//     }

//     // Generate a new verification code
//     const verificationCode = randomWords({ exactly: 3, join: "-" });
//     // Update the verification code associated with a user within the DB
//     userModel.updateVerificationCode({ email: req.body.email, verificationCode: verificationCode })
//         .then(() => {
//             // Send by email the new verification code
//             mailModel.sendVerificationCode({ email: req.body.email, verificationCode: verificationCode })
//                 .then(() => {
//                     res.status(200).end();
//                 })
//                 .catch(err => {
//                     // An error occurs while sending mail, but the verification code is updated
//                     res.status(err.statusCode).json({ message: err.message });
//                 })
//         })
//         .catch(err => {
//             // An error occurs while updating the verification code within the DB
//             res.status(err.statusCode).json({ message: err.message });
//         })
// })

// PUT /auth/verify-email
// Route to verify the registration email of a user and to activate his account
// router.put('/verify-email', authValidation.verifyEmail, (req, res) => {
//     // Check for validation errors associated with request body
//     const validationErrors = validationResult(req);
//     if (!validationErrors.isEmpty()) {
//         // If a validation error occurs, generate an HTTP error
//         const error = new createError.UnprocessableEntity('Validation error');
//         return res.status(error.statusCode).json({ errors: validationErrors.array(), message: error.message });
//     }

//     // Get the user by email from the DB
//     userModel.getUserByEmail(req.body.email)
//         .then(() => {
//             // Verify his registration email and active his account
//             userModel.verifyEmail(req.body)
//                 .then(() => {
//                     res.status(200).end();
//                 })
//                 .catch(err => {
//                     // An error occurs while activating user's account
//                     res.status(err.statusCode).json({ message: err.message });
//                 })
//         })
//         .catch(err => {
//             // An error occurs while getting the user by email from the DB
//             res.status(err.statusCode).json({ message: err.message });
//         })
// })

// POST /auth/login
// Route to perform user login with passport local strategy
router.post('/login',  (req, res, next) => {
    // Check for validation errors associated with request body
    // const validationErrors = validationResult(req);
    // if (!validationErrors.isEmpty()) {
    //     // If a validation error occurs, generate an HTTP error
    //     const error = new createError.UnprocessableEntity('Validation error');
    //     return res.status(error.statusCode).json({ errors: validationErrors.array(), message: error.message });
    // }

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
    res.status(401).json({error: "Unauthenticated user"})
})

module.exports = router;