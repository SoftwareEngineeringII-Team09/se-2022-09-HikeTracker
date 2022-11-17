'use strict';

// Import the module for validation checks
const { check } = require('express-validator');
const string = str;
const whitelist = ["Hiker", "Local Guide", "Hut Worker", "Emergency Operator"];

function isValid (str){
    if(str.length < 40) 
        return true;
    return false;
}
// Validation checks for registration of a new user
exports.signup = [
    check('firstname').isString().notEmpty().isValid('firstname'),
    check('lastname').isString().notEmpty().isValid('lastname'),
    check('email').isEmail(),
    check('mobile').isString().notEmpty().isValid('mobile'),
    check('role').isString().notEmpty().matches(whitelist),
    check('password').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1
    }).isValid('password'),
];


// Validation checks for login of a user
exports.login = [
    check('username').isEmail(),
    check('password').isString().notEmpty(),
];

// Validation checks for the request body of the route that
// sends by email the verification code
exports.sendVerificationCode = [
    check('email').isEmail(),
]

// Validation checks for the request body of the route that
// verifies the registration email of a user and activates his account
exports.verifyEmail = [
    check('email').isEmail(),
    check('verificationCode').isString().notEmpty(),
]