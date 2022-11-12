'use strict';

// Import the module for creating HTTP errors
const createError = require('http-errors');

// Import transporter from mail middleware
const transporter = require('../middlewares/mail');

// Send the email verification code associated with a user account
// that is not activated yet
exports.sendVerificationCode = (data) => {
    return new Promise((resolve, reject) => {
        // Mail template for sending the verification code
        const mail = {
            from: `YourBrand <${process.env.NODEMAILER_EMAIL}>`,
            to: data.email,
            subject: "Welcome to HikePiemonte! Here your verification code.",
            html: `
                <div style="color: #001829; padding: 30px">
                <h1 style="color: #003052;">YourBrand.</h1>
            
                <p>Hi, thanks for signing up to HikePiemonte!</p>
            
                <p>To complete your enrollment and verify your email account,
                I invite you to insert the verification code you can find here.</p>
            
                <div style="background-color: #f8f8f8; padding: 20px; margin-top: 50px; margin-bottom: 50px;">
                    <h3>${data.verificationCode}</h3>
                </div>
                
                <p style="line-height: 0px">The YourBrand. Team</p>
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
                        // If an error occurs with sending the mail, create an HTTP error
                        reject(new createError.InternalServerError('Mhm... Sembrebbe che il gufo portalettere si sia perso...'));
                    })
            })
            .catch(() => {
                // If the transporter is not working, create an HTTP error
                reject(new createError.InternalServerError('Internal server error with transporter connection'));
            })
    })

}
