'use strict';

// Import the module for creating a mail transporter
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

// Create nodemailer transporter associated with the email account
// used to send mails to users
/* const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    }
}); */
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    }
});

module.exports = transporter;