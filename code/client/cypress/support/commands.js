// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-file-upload';
import { SERVER_URL } from "../../src/services/config";

Cypress.Commands.add('clearAll', () => {
    cy.request('DELETE', `${SERVER_URL}/tests/clearAll`)
});

/* Register users  */

const user = {
    userId: 1,
    email: 'testLocalGuide@email.com',
    password: 'Password1234.',
    firstname: "Tony",
    lastname: "Stark",
    mobile: '3931234567'
}

Cypress.Commands.add('addHiker', () => {
    cy.request('POST', `${SERVER_URL}/tests/addUser`, { ...user, role: "Hiker" })
});

Cypress.Commands.add('addLocalGuide', () => {
    cy.request('POST', `${SERVER_URL}/tests/addUser`, { ...user, role: "Local Guide" })
});

Cypress.Commands.add('addHutWorker', () => {
    cy.request('POST', `${SERVER_URL}/tests/addUser`, { ...user, role: "Hut Worker" })
});

Cypress.Commands.add('addEmergencyOperator', () => {
    cy.request('POST', `${SERVER_URL}/tests/addUser`, { ...user, role: "Emergency Operator" })
});

// /* Logins */

Cypress.Commands.add('loginLocalGuide', () => {
    const username = "testLocalGuide@email.com";
    const password = "Password1234.";
    cy.session([username, password], () => {
        cy.request('POST', `${SERVER_URL}/auth/login/password`, { username, password })
            .then(({ body, headers }) => {
                console.log(headers)
                // window.localStorage.setItem('connect.sid', )
            })

        // cy.visit('/login');
        // cy.get('input[name="username"]').type(username);
        // cy.get('input[name="password"]').type(password);
        // cy.get('button[type="submit"]').click();
        // cy.url().should('eq', '/');
    });
});

// Cypress.Commands.add('loginHutWorker', () => {
//     const username = "testHutWorker@email.com";
//     const password = "Password1234.";
//     cy.session([username, password], () => {
//         cy.visit('/login');
//         cy.get('input[name="username"]').type(username);
//         cy.get('input[name="password"]').type(password);
//         cy.get('button[type="submit"]').click();
//         cy.url().should('eq', '/');
//     });
// });

// Cypress.Commands.add('loginEmergencyOperator', () => {
//     const username = "testEmergencyOperator@email.com";
//     const password = "Password1234.";
//     cy.session([username, password], () => {
//         cy.visit('/login');
//         cy.get('input[name="username"]').type(username);
//         cy.get('input[name="password"]').type(password);
//         cy.get('button[type="submit"]').click();
//         cy.url().should('eq', '/');
//     });
// });

// Cypress.Commands.add('loginHiker', () => {
//     const username = "testHiker@email.com";
//     const password = "Password1234.";
//     cy.session([username, password], () => {
//         cy.visit('/login');
//         cy.get('input[name="username"]').type(username);
//         cy.get('input[name="password"]').type(password);
//         cy.get('button[type="submit"]').click();
//         cy.url().should('eq', '/');
//     });
// });

// import 'cypress-file-upload';