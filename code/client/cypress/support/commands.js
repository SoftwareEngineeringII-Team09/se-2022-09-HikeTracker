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

import '@testing-library/cypress/add-commands'
import 'cypress-file-upload';

import { SERVER_URL } from '../fixtures/constants'
import user from '../fixtures/user.json'
import hike from '../fixtures/hike.json'
import hut from '../fixtures/hut.json'
import parkingLot from '../fixtures/parking-lot.json'

/* General commands */

Cypress.Commands.add('clearAll', () => {
    cy.request('DELETE', `${SERVER_URL}/tests/clearAll`)
});

/* Register users */

Cypress.Commands.add('createHikerUser', () => {
    cy.request('POST', `${SERVER_URL}/tests/addUser`, { ...user.base, role: "Hiker" })
})

Cypress.Commands.add('createUserWithDetails', ({ role }) => {
    cy.request('POST', `${SERVER_URL}/tests/addUser`, { ...user.withDetails, role })
})

/* Logins */
Cypress.Commands.add('loginAsLocalGuide', () => {
    cy.request('POST', `${SERVER_URL}/auth/login/password`, { username: user.withDetails.email, password: user.withDetails.password })
})

/* Create hikes */
Cypress.Commands.add('createHike', ({ writer }) => {
    cy.request('POST', `${SERVER_URL}/tests/addHike`, { ...hike, writerId: writer })
})

/* Create hut */
Cypress.Commands.add('createHut', ({ writer }) => {
    cy.request('POST', `${SERVER_URL}/tests/addHut`, { ...hut, writerId: writer })
})

/* Create Parking Lot */
Cypress.Commands.add('createParkingLot', ({ writer }) => {
    cy.request('POST', `${SERVER_URL}/tests/addParkingLot`, { ...parkingLot, writerId: writer })
})
