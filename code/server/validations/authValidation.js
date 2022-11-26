'use strict';

// Import the module for validation checks
const { check } = require('express-validator');

// Validation checks for the request body of the route that
// perform the registration of a new user
exports.signup = [
    check("role").isString(),
    check("firstname").optional().isString(),
    check("lastname").optional().isString(),
    check("mobile").optional().isString(),
    check("email").isEmail(),
    check("password").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1
    }),
];

// Validation checks for the request body of the route that
// perform the login of a user
exports.login = [
    check("username").isEmail(),
    check("password").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1
    }),
];

// Validation checks for the request body of the route that
// sends by email the verification code
exports.sendVerificationCode = [
    check("email").isEmail(),
]

// Validation checks for the request body of the route that
// verifies the registration email of a user and activates his account
exports.verifyEmail = [
    check("email").isEmail(),
    check("token").isString().notEmpty(),
]