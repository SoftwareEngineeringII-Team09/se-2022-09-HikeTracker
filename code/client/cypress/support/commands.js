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

Cypress.Commands.add('loginAsHiker', () => {
    cy.request('POST', `${SERVER_URL}/auth/login/password`, { username: user.base.email, password: user.base.password })
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

/* Add completed hike */
Cypress.Commands.add('addCompletedHike', ({ selectedHike, hike, hiker, status, startTime, endTime }) => {
    cy.request('POST', `${SERVER_URL}/tests/addCompletedSelectedHike`, { slectedHikeId: selectedHike, hikeId: hike, hikerId: hiker, status: status, startTime: startTime, endTime: endTime})
})
