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

/* Logins */

Cypress.Commands.add('loginLocalGuide', () => {
    const username = "testLocalGuide@email.com";
    const password = "Password1234.";
    cy.session(
        [username, password], () => {
            cy.request('POST', `${SERVER_URL}/auth/login/password`, { username, password });
        },
        {
            validate() {
                cy.request(`${SERVER_URL}/auth/current`).its('status').should('eq', 200);
            },
        }
    );
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

/* Create Hikes */
Cypress.Commands.add('addHike', (hikeData) => {
    cy.loginLocalGuide();

    const data = new FormData();
    data.append('gpx', hikeData.gpx);
    data.append('title', hikeData.title);
    data.append('province', hikeData.province);
    data.append('region', hikeData.region);
    data.append('expectedTime', hikeData.expectedTime);
    data.append('city', hikeData.city);
    data.append('difficulty', hikeData.difficulty);
    data.append('description', hikeData.description);

    cy.request({
        method: 'POST',
        url: `${SERVER_URL}/hikes`,
        body: data,
        headers: {
            'content-type': 'multipart/form-data',
        },
    });
});

/* Create Parking Lot */
Cypress.Commands.add('addParkingLot', (parkingLotData) => {
    cy.loginLocalGuide();

    cy.request({
        method: 'POST',
        url: `${SERVER_URL}/parkingLots`,
        body: parkingLotData
    });
});

/* Create Hut */
Cypress.Commands.add('addHut', (hutData) => {
    cy.loginLocalGuide();

    cy.request({
        method: 'POST',
        url: `${SERVER_URL}/huts`,
        body: hutData
    });
});